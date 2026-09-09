from app.modules.risk.service import calculate_risk_index


def test_risk_result_always_includes_contributing_factors() -> None:
    result = calculate_risk_index(overdue_actions_score=82.0, gas_breach_score=78.0, inspection_gap_score=58.0)
    assert result.score > 0
    assert result.level in {'LOW','MEDIUM','HIGH'}
    assert len(result.contributing_factors) == 3


def test_risk_weights_are_canonical() -> None:
    result = calculate_risk_index(overdue_actions_score=82.0, gas_breach_score=78.0, inspection_gap_score=58.0)
    assert [f.weight for f in result.contributing_factors] == [0.40,0.35,0.25]


def test_high_score_maps_to_high_level() -> None:
    result = calculate_risk_index(overdue_actions_score=90.0, gas_breach_score=90.0, inspection_gap_score=90.0)
    assert result.level == 'HIGH'
