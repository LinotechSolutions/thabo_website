import math
from products.models import ProductItem


class StandAffordabilityService:
    @staticmethod
    def calculate(
        monthly_income: float,
        existing_debt: float = 0.0,
        deposit_amount: float = 0.0,
        loan_term_years: int = 15,
        interest_rate_percent: float = 9.5,
    ) -> dict:
        """
        Calculates stand and mortgage affordability for CBZ Properties.
        Respects CBZ Bank prudential guidelines (max DTI: 40%).
        """
        income = max(0.0, float(monthly_income))
        debt = max(0.0, float(existing_debt))
        deposit = max(0.0, float(deposit_amount))
        term_years = max(1, min(30, int(loan_term_years or 15)))
        rate = max(1.0, float(interest_rate_percent or 9.5))

        # Max allowed monthly repayment: 40% of income minus existing debt obligations
        max_allowed_repayment = (income * 0.40) - debt
        qualifies = max_allowed_repayment >= 100.0  # Min $100/mo repayment threshold

        if not qualifies or max_allowed_repayment <= 0:
            return {
                "qualifies": False,
                "monthlyRepayment": 0.0,
                "maxLoanAmount": 0.0,
                "depositAmount": deposit,
                "maxAffordablePrice": deposit,
                "debtToIncomeRatio": round((debt / income * 100) if income > 0 else 100.0, 1),
                "totalInterest": 0.0,
                "totalRepayment": 0.0,
                "loanTermYears": term_years,
                "interestRate": rate,
                "message": "Monthly debt obligations exceed the permissible 40% debt-to-income threshold.",
            }

        # Monthly interest rate & number of payments
        r = (rate / 100.0) / 12.0
        n = term_years * 12

        # Present Value of annuity: PV = PMT * (1 - (1 + r)^(-n)) / r
        discount_factor = (1.0 - math.pow(1.0 + r, -n)) / r
        max_loan = max_allowed_repayment * discount_factor

        max_property_price = max_loan + deposit
        total_repayment = max_allowed_repayment * n
        total_interest = total_repayment - max_loan

        total_debt_service = max_allowed_repayment + debt
        dti_ratio = (total_debt_service / income) * 100.0 if income > 0 else 0.0

        return {
            "qualifies": True,
            "monthlyRepayment": round(max_allowed_repayment, 2),
            "maxLoanAmount": round(max_loan, 2),
            "depositAmount": round(deposit, 2),
            "maxAffordablePrice": round(max_property_price, 2),
            "debtToIncomeRatio": round(dti_ratio, 1),
            "totalInterest": round(total_interest, 2),
            "totalRepayment": round(total_repayment, 2),
            "loanTermYears": term_years,
            "interestRate": rate,
            "message": "Pre-qualified for CBZ Properties development stands & home financing.",
        }


class SeasonalBudgetService:
    CROP_BENCHMARKS = {
        "maize": {"yield": 5.5, "price": 335.0, "cost": 550.0},
        "wheat": {"yield": 6.0, "price": 440.0, "cost": 850.0},
        "tobacco": {"yield": 2.4, "price": 3200.0, "cost": 1600.0},
        "soya": {"yield": 2.8, "price": 520.0, "cost": 480.0},
        "sorghum": {"yield": 3.5, "price": 300.0, "cost": 380.0},
        "cotton": {"yield": 1.8, "price": 460.0, "cost": 410.0},
    }

    @classmethod
    def calculate(
        cls,
        crop_type: str,
        hectares: float,
        input_cost_per_ha: float = None,
        expected_yield_per_ha: float = None,
        expected_price_per_ton: float = None,
        include_insurance: bool = True,
    ) -> dict:
        """
        Calculates seasonal yield budget, gross margins, and financing requirements for Agro-Yield.
        """
        crop = crop_type.lower().strip()
        defaults = cls.CROP_BENCHMARKS.get(crop, cls.CROP_BENCHMARKS["maize"])

        ha = max(0.1, float(hectares))
        cost_ha = float(input_cost_per_ha) if input_cost_per_ha is not None and float(input_cost_per_ha) > 0 else defaults["cost"]
        yield_ha = float(expected_yield_per_ha) if expected_yield_per_ha is not None and float(expected_yield_per_ha) > 0 else defaults["yield"]
        price_ton = float(expected_price_per_ton) if expected_price_per_ton is not None and float(expected_price_per_ton) > 0 else defaults["price"]

        total_input_cost = ha * cost_ha
        total_yield_tons = ha * yield_ha
        gross_revenue = total_yield_tons * price_ton

        # CBZ Agro-Insurance levy (3.5% of crop value)
        insurance_cost = (gross_revenue * 0.035) if include_insurance else 0.0
        total_cost = total_input_cost + insurance_cost
        gross_profit = gross_revenue - total_cost

        roi = (gross_profit / total_cost * 100.0) if total_cost > 0 else 0.0
        break_even_yield = (total_cost / (ha * price_ton)) if (ha * price_ton) > 0 else 0.0
        break_even_price = (total_cost / total_yield_tons) if total_yield_tons > 0 else 0.0

        return {
            "crop": crop.capitalize(),
            "hectares": ha,
            "costPerHectare": round(cost_ha, 2),
            "expectedYieldPerHa": round(yield_ha, 2),
            "expectedPricePerTon": round(price_ton, 2),
            "totalYieldTons": round(total_yield_tons, 2),
            "totalInputCost": round(total_input_cost, 2),
            "insuranceCost": round(insurance_cost, 2),
            "totalOperatingCost": round(total_cost, 2),
            "totalGrossRevenue": round(gross_revenue, 2),
            "grossProfit": round(gross_profit, 2),
            "returnOnInvestment": round(roi, 1),
            "breakEvenYieldPerHa": round(break_even_yield, 2),
            "breakEvenPricePerTon": round(break_even_price, 2),
        }


class InvestmentPathwayService:
    RISK_PROFILES = {
        "conservative": {
            "rate": 0.075,
            "title": "Capital Preservation & Income",
            "desc": "Focus on high liquidity, money market unit trusts, and treasury assets.",
            "category": "unitTrusts",
        },
        "moderate": {
            "rate": 0.120,
            "title": "Balanced Wealth Creation",
            "desc": "Mix of fixed income, blue-chip equities, and real estate investment trusts.",
            "category": "institutional",
        },
        "aggressive": {
            "rate": 0.165,
            "title": "Long-Term High Capital Growth",
            "desc": "Substantial allocation to high-growth listed equities and offshore alternatives.",
            "category": "privateWealth",
        },
    }

    @classmethod
    def calculate(
        cls,
        initial_investment: float,
        monthly_contribution: float = 0.0,
        horizon_years: int = 5,
        risk_profile: str = "moderate",
    ) -> dict:
        """
        Datvest Investment Pathway Guide.
        Projects compounding investment returns and matches tailored Datvest funds.
        """
        initial = max(0.0, float(initial_investment))
        monthly = max(0.0, float(monthly_contribution))
        years = max(1, min(30, int(horizon_years or 5)))
        profile_key = risk_profile.lower().strip()
        profile = cls.RISK_PROFILES.get(profile_key, cls.RISK_PROFILES["moderate"])

        annual_rate = profile["rate"]
        r = annual_rate / 12.0
        n = years * 12

        # Future value of initial lump sum
        fv_initial = initial * math.pow(1.0 + r, n)

        # Future value of ordinary annuity (monthly contributions)
        if r > 0:
            fv_monthly = monthly * ((math.pow(1.0 + r, n) - 1.0) / r)
        else:
            fv_monthly = monthly * n

        total_projected_value = fv_initial + fv_monthly
        total_contributed = initial + (monthly * n)
        estimated_growth = total_projected_value - total_contributed

        # Yearly growth milestones for charts
        milestones = []
        for y in range(1, years + 1):
            my_n = y * 12
            my_fv_init = initial * math.pow(1.0 + r, my_n)
            my_fv_month = monthly * ((math.pow(1.0 + r, my_n) - 1.0) / r) if r > 0 else (monthly * my_n)
            my_contrib = initial + (monthly * my_n)
            my_tot = my_fv_init + my_fv_month
            milestones.append(
                {
                    "year": y,
                    "contributed": round(my_contrib, 2),
                    "projectedValue": round(my_tot, 2),
                    "growth": round(my_tot - my_contrib, 2),
                }
            )

        # Matched products from Datvest/Investments
        matched_products = []
        products = ProductItem.objects.filter(
            subsidiary_id="datvest", category=profile["category"], is_active=True
        )[:3]
        for p in products:
            matched_products.append(
                {
                    "name": p.name,
                    "description": p.description,
                    "pricing": p.pricing,
                    "icon": p.icon,
                }
            )

        return {
            "riskProfile": profile_key,
            "strategy": profile["title"],
            "strategyDescription": profile["desc"],
            "annualizedReturnPercent": round(annual_rate * 100.0, 1),
            "horizonYears": years,
            "totalContributed": round(total_contributed, 2),
            "projectedValue": round(total_projected_value, 2),
            "estimatedGrowth": round(estimated_growth, 2),
            "milestones": milestones,
            "recommendedFunds": matched_products,
        }
