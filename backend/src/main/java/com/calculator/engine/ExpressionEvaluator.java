package com.calculator.engine;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;
import net.objecthunter.exp4j.function.Function;
import org.springframework.stereotype.Component;

@Component
public class ExpressionEvaluator {

    private static final double DEG_TO_RAD = Math.PI / 180.0;

    public double evaluate(String expression, String angleMode) {
        if (expression == null || expression.isBlank()) {
            throw new IllegalArgumentException("Expression must not be empty.");
        }

        boolean useDegrees = !"RADIANS".equalsIgnoreCase(angleMode);

        // Custom functions
        Function sinFunc = new Function("sin", 1) {
            @Override
            public double apply(double... args) {
                double angle = useDegrees ? args[0] * DEG_TO_RAD : args[0];
                return Math.sin(angle);
            }
        };

        Function cosFunc = new Function("cos", 1) {
            @Override
            public double apply(double... args) {
                double angle = useDegrees ? args[0] * DEG_TO_RAD : args[0];
                return Math.cos(angle);
            }
        };

        Function tanFunc = new Function("tan", 1) {
            @Override
            public double apply(double... args) {
                double angle = useDegrees ? args[0] * DEG_TO_RAD : args[0];
                double cosVal = Math.cos(angle);
                if (Math.abs(cosVal) < 1e-15) {
                    throw new IllegalArgumentException("tan is undefined at this angle (division by zero).");
                }
                return Math.tan(angle);
            }
        };

        Function asinFunc = new Function("asin", 1) {
            @Override
            public double apply(double... args) {
                if (args[0] < -1 || args[0] > 1) {
                    throw new IllegalArgumentException("asin domain error: input must be in [-1, 1].");
                }
                double result = Math.asin(args[0]);
                return useDegrees ? result / DEG_TO_RAD : result;
            }
        };

        Function acosFunc = new Function("acos", 1) {
            @Override
            public double apply(double... args) {
                if (args[0] < -1 || args[0] > 1) {
                    throw new IllegalArgumentException("acos domain error: input must be in [-1, 1].");
                }
                double result = Math.acos(args[0]);
                return useDegrees ? result / DEG_TO_RAD : result;
            }
        };

        Function atanFunc = new Function("atan", 1) {
            @Override
            public double apply(double... args) {
                double result = Math.atan(args[0]);
                return useDegrees ? result / DEG_TO_RAD : result;
            }
        };

        Function sinhFunc = new Function("sinh", 1) {
            @Override
            public double apply(double... args) {
                return Math.sinh(args[0]);
            }
        };

        Function coshFunc = new Function("cosh", 1) {
            @Override
            public double apply(double... args) {
                return Math.cosh(args[0]);
            }
        };

        Function tanhFunc = new Function("tanh", 1) {
            @Override
            public double apply(double... args) {
                return Math.tanh(args[0]);
            }
        };

        Function logFunc = new Function("log", 1) {
            @Override
            public double apply(double... args) {
                if (args[0] <= 0) {
                    throw new IllegalArgumentException("log domain error: input must be positive.");
                }
                return Math.log10(args[0]);
            }
        };

        Function lnFunc = new Function("ln", 1) {
            @Override
            public double apply(double... args) {
                if (args[0] <= 0) {
                    throw new IllegalArgumentException("ln domain error: input must be positive.");
                }
                return Math.log(args[0]);
            }
        };

        Function sqrtFunc = new Function("sqrt", 1) {
            @Override
            public double apply(double... args) {
                if (args[0] < 0) {
                    throw new IllegalArgumentException("sqrt domain error: input must be non-negative.");
                }
                return Math.sqrt(args[0]);
            }
        };

        Function absFunc = new Function("abs", 1) {
            @Override
            public double apply(double... args) {
                return Math.abs(args[0]);
            }
        };

        Function expFunc = new Function("exp", 1) {
            @Override
            public double apply(double... args) {
                return Math.exp(args[0]);
            }
        };

        Function ceilFunc = new Function("ceil", 1) {
            @Override
            public double apply(double... args) {
                return Math.ceil(args[0]);
            }
        };

        Function floorFunc = new Function("floor", 1) {
            @Override
            public double apply(double... args) {
                return Math.floor(args[0]);
            }
        };

        Function factorialFunc = new Function("factorial", 1) {
            @Override
            public double apply(double... args) {
                double n = args[0];
                if (n < 0 || n != Math.floor(n)) {
                    throw new IllegalArgumentException(
                            "factorial domain error: input must be a non-negative integer.");
                }
                if (n > 170) {
                    throw new IllegalArgumentException(
                            "factorial domain error: input too large (max 170).");
                }
                long result = 1;
                for (long i = 2; i <= (long) n; i++) {
                    result *= i;
                }
                return (double) result;
            }
        };

        Expression expr;
        try {
            expr = new ExpressionBuilder(expression)
                    .functions(sinFunc, cosFunc, tanFunc, asinFunc, acosFunc, atanFunc,
                               sinhFunc, coshFunc, tanhFunc, logFunc, lnFunc, sqrtFunc,
                               absFunc, expFunc, ceilFunc, floorFunc, factorialFunc)
                    .variables("pi", "e")
                    .build()
                    .setVariable("pi", Math.PI)
                    .setVariable("e", Math.E);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid expression: " + ex.getMessage());
        }

        if (!expr.validate().isValid()) {
            String errors = String.join("; ", expr.validate().getErrors());
            throw new IllegalArgumentException("Expression validation failed: " + errors);
        }

        double result;
        try {
            result = expr.evaluate();
        } catch (IllegalArgumentException ex) {
            // rethrow domain errors from custom functions
            throw ex;
        } catch (ArithmeticException ex) {
            throw new IllegalArgumentException("Arithmetic error: " + ex.getMessage());
        } catch (Exception ex) {
            throw new IllegalArgumentException("Evaluation error: " + ex.getMessage());
        }

        if (Double.isNaN(result)) {
            throw new IllegalArgumentException("Result is not a number (NaN). Check your expression for domain errors.");
        }
        if (Double.isInfinite(result)) {
            throw new IllegalArgumentException("Result is infinite. Possible division by zero or overflow.");
        }

        return result;
    }
}
