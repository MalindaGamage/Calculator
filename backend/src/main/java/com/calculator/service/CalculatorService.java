package com.calculator.service;

import com.calculator.engine.ExpressionEvaluator;
import com.calculator.model.CalculationRequest;
import com.calculator.model.CalculationResponse;
import org.springframework.stereotype.Service;

@Service
public class CalculatorService {

    private final ExpressionEvaluator expressionEvaluator;

    public CalculatorService(ExpressionEvaluator expressionEvaluator) {
        this.expressionEvaluator = expressionEvaluator;
    }

    public CalculationResponse calculate(CalculationRequest request) {
        String expression = request.getExpression().trim();
        String angleMode = request.getAngleMode();

        try {
            double result = expressionEvaluator.evaluate(expression, angleMode);
            return CalculationResponse.success(expression, result);
        } catch (IllegalArgumentException ex) {
            return CalculationResponse.failure(expression, ex.getMessage());
        }
    }
}
