import datetime
from decimal import Decimal, ROUND_HALF_UP
from countries.models import Country
from insurance.models import AddonOption, AssetOption, CoverOption


class InsuranceQuoteService:
    @staticmethod
    def calculate_premium(
        asset_id: str,
        cover_id: str,
        selected_addon_ids: list,
        vehicle_value_usd: float = 0.0,
        vehicle_year: int = None,
        country_code: str = "zw",
    ) -> dict:
        """
        Server-side actuarial premium calculation engine.
        Calculates accurate monthly and annual premiums factoring in asset type,
        cover tier, vehicle value risk percentage, vehicle age loading,
        selected add-ons, and statutory regulatory levies.
        """
        asset = AssetOption.objects.filter(id=asset_id).first()
        cover = CoverOption.objects.filter(id=cover_id).first()

        if not cover:
            raise ValueError(f"Invalid cover option: {cover_id}")

        vehicle_val = Decimal(str(max(0.0, float(vehicle_value_usd or 0.0))))
        base_price = Decimal(str(cover.base_price_usd))

        # 1. Base cover monthly premium calculation
        if cover.id == "comprehensive":
            rate = Decimal(str(cover.rate_percentage or 0.045))
            annual_val_prem = vehicle_val * rate
            monthly_val_prem = (annual_val_prem / Decimal("12")).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )
            cover_monthly = max(base_price, monthly_val_prem)

            # Age loading: older vehicles (>10 yrs) carry higher repair/parts costs
            current_year = datetime.datetime.now().year
            if vehicle_year and (current_year - int(vehicle_year)) > 10:
                cover_monthly = (cover_monthly * Decimal("1.10")).quantize(
                    Decimal("0.01"), rounding=ROUND_HALF_UP
                )

        elif cover.id == "fullthird":
            rate = Decimal("0.010")  # 1% for fire & theft
            annual_val_prem = vehicle_val * rate
            monthly_val_prem = (annual_val_prem / Decimal("12")).quantize(
                Decimal("0.01"), rounding=ROUND_HALF_UP
            )
            cover_monthly = base_price + monthly_val_prem
        else:
            # Third Party statutory fixed
            cover_monthly = base_price

        # 2. Addons pricing
        addons = AddonOption.objects.filter(id__in=selected_addon_ids)
        addon_items = []
        addons_total = Decimal("0.00")
        for addon in addons:
            addons_total += Decimal(str(addon.price_usd))
            addon_items.append(
                {
                    "id": addon.id,
                    "name": addon.name,
                    "priceUSD": float(addon.price_usd),
                }
            )

        # 3. Subtotal and statutory levy (e.g. 5% IPEC/statutory insurance levy)
        subtotal = cover_monthly + addons_total
        statutory_levy = (subtotal * Decimal("0.05")).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        total_monthly_usd = subtotal + statutory_levy

        # 4. Annual premium with 5% annual payment discount
        total_annual_usd = (total_monthly_usd * Decimal("12") * Decimal("0.95")).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )

        # 5. Local currency conversion if Country FX available
        country = Country.objects.filter(code=country_code.lower()).first()
        fx_rate = float(country.rate) if country else 1.0
        currency_label = country.cur if country else "USD"

        monthly_local = round(float(total_monthly_usd) * fx_rate, 2)
        annual_local = round(float(total_annual_usd) * fx_rate, 2)

        return {
            "totalMonthlyUSD": float(total_monthly_usd),
            "totalAnnualUSD": float(total_annual_usd),
            "localCurrency": {
                "label": currency_label,
                "rate": fx_rate,
                "totalMonthly": monthly_local,
                "totalAnnual": annual_local,
            },
            "breakdown": {
                "baseCoverMonthlyUSD": float(cover_monthly),
                "addonsMonthlyUSD": float(addons_total),
                "statutoryLevyUSD": float(statutory_levy),
                "annualDiscountUSD": round(
                    float(total_monthly_usd * Decimal("12") - total_annual_usd), 2
                ),
            },
            "coverObj": {
                "id": cover.id,
                "name": cover.name,
                "tier": cover.tier,
                "basePriceUSD": float(cover.base_price_usd),
                "features": cover.features,
            },
            "activeAddonsList": addon_items,
            "asset": asset.name if asset else "Motor Insurance",
        }
