from django.urls import path
from calculators.views import (
    InvestmentPathwayView,
    SeasonalBudgetView,
    StandAffordabilityView,
)

app_name = "calculators"

urlpatterns = [
    path("stand-affordability/", StandAffordabilityView.as_view(), name="stand-affordability"),
    path("seasonal-budget/", SeasonalBudgetView.as_view(), name="seasonal-budget"),
    path("investment-pathway/", InvestmentPathwayView.as_view(), name="investment-pathway"),
]
