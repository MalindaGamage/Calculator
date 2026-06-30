package com.calculator.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CalculationRequest {

    @NotBlank(message = "Expression must not be blank")
    @Size(max = 500, message = "Expression must not exceed 500 characters")
    private String expression;

    private String angleMode = "DEGREES";

    public CalculationRequest() {
    }

    public CalculationRequest(String expression, String angleMode) {
        this.expression = expression;
        this.angleMode = angleMode;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getAngleMode() {
        return angleMode;
    }

    public void setAngleMode(String angleMode) {
        this.angleMode = (angleMode != null) ? angleMode : "DEGREES";
    }
}
