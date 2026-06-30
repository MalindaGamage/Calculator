package com.calculator.model;

import java.time.Instant;

public class CalculationResponse {

    private String expression;
    private Double result;
    private String error;
    private String timestamp;

    public CalculationResponse() {
        this.timestamp = Instant.now().toString();
    }

    public CalculationResponse(String expression, Double result, String error) {
        this.expression = expression;
        this.result = result;
        this.error = error;
        this.timestamp = Instant.now().toString();
    }

    public static CalculationResponse success(String expression, double result) {
        return new CalculationResponse(expression, result, null);
    }

    public static CalculationResponse failure(String expression, String error) {
        return new CalculationResponse(expression, null, error);
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public Double getResult() {
        return result;
    }

    public void setResult(Double result) {
        this.result = result;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
