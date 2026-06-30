package com.calculator.engine;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ExpressionEvaluatorTest {

    private ExpressionEvaluator evaluator;

    @BeforeEach
    void setUp() {
        evaluator = new ExpressionEvaluator();
    }

    // Basic arithmetic
    @Test
    void testAddition() {
        assertEquals(5.0, evaluator.evaluate("2+3", "DEGREES"), 1e-10);
    }

    @Test
    void testSubtraction() {
        assertEquals(1.0, evaluator.evaluate("4-3", "DEGREES"), 1e-10);
    }

    @Test
    void testMultiplication() {
        assertEquals(12.0, evaluator.evaluate("3*4", "DEGREES"), 1e-10);
    }

    @Test
    void testDivision() {
        assertEquals(2.5, evaluator.evaluate("5/2", "DEGREES"), 1e-10);
    }

    @Test
    void testPower() {
        assertEquals(8.0, evaluator.evaluate("2^3", "DEGREES"), 1e-10);
    }

    @Test
    void testParentheses() {
        assertEquals(14.0, evaluator.evaluate("2*(3+4)", "DEGREES"), 1e-10);
    }

    // Trig in degrees
    @Test
    void testSinDegrees90() {
        assertEquals(1.0, evaluator.evaluate("sin(90)", "DEGREES"), 1e-10);
    }

    @Test
    void testCosDegrees0() {
        assertEquals(1.0, evaluator.evaluate("cos(0)", "DEGREES"), 1e-10);
    }

    @Test
    void testCosDegrees60() {
        assertEquals(0.5, evaluator.evaluate("cos(60)", "DEGREES"), 1e-10);
    }

    @Test
    void testTanDegrees45() {
        assertEquals(1.0, evaluator.evaluate("tan(45)", "DEGREES"), 1e-10);
    }

    @Test
    void testSinDegrees0() {
        assertEquals(0.0, evaluator.evaluate("sin(0)", "DEGREES"), 1e-10);
    }

    // Trig in radians
    @Test
    void testSinRadiansPiOver2() {
        assertEquals(1.0, evaluator.evaluate("sin(pi/2)", "RADIANS"), 1e-10);
    }

    @Test
    void testCosRadians0() {
        assertEquals(1.0, evaluator.evaluate("cos(0)", "RADIANS"), 1e-10);
    }

    @Test
    void testTanRadiansPiOver4() {
        assertEquals(1.0, evaluator.evaluate("tan(pi/4)", "RADIANS"), 1e-10);
    }

    // Log and ln
    @Test
    void testLog10() {
        assertEquals(2.0, evaluator.evaluate("log(100)", "DEGREES"), 1e-10);
    }

    @Test
    void testLog1() {
        assertEquals(0.0, evaluator.evaluate("log(1)", "DEGREES"), 1e-10);
    }

    @Test
    void testLnE() {
        assertEquals(1.0, evaluator.evaluate("ln(e)", "DEGREES"), 1e-10);
    }

    @Test
    void testLn1() {
        assertEquals(0.0, evaluator.evaluate("ln(1)", "DEGREES"), 1e-10);
    }

    @Test
    void testLogDomainError() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> evaluator.evaluate("log(0)", "DEGREES"));
        assertTrue(ex.getMessage().contains("log domain error"));
    }

    @Test
    void testLnNegativeDomainError() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> evaluator.evaluate("ln(-1)", "DEGREES"));
        assertTrue(ex.getMessage().contains("ln domain error"));
    }

    // Sqrt
    @Test
    void testSqrt4() {
        assertEquals(2.0, evaluator.evaluate("sqrt(4)", "DEGREES"), 1e-10);
    }

    @Test
    void testSqrt0() {
        assertEquals(0.0, evaluator.evaluate("sqrt(0)", "DEGREES"), 1e-10);
    }

    @Test
    void testSqrtNegativeDomainError() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> evaluator.evaluate("sqrt(-1)", "DEGREES"));
        assertTrue(ex.getMessage().contains("sqrt domain error"));
    }

    // Factorial
    @Test
    void testFactorial0() {
        assertEquals(1.0, evaluator.evaluate("factorial(0)", "DEGREES"), 1e-10);
    }

    @Test
    void testFactorial5() {
        assertEquals(120.0, evaluator.evaluate("factorial(5)", "DEGREES"), 1e-10);
    }

    @Test
    void testFactorial10() {
        assertEquals(3628800.0, evaluator.evaluate("factorial(10)", "DEGREES"), 1e-10);
    }

    @Test
    void testFactorialNegativeDomainError() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> evaluator.evaluate("factorial(-1)", "DEGREES"));
        assertTrue(ex.getMessage().contains("factorial domain error"));
    }

    // Constants
    @Test
    void testPiConstant() {
        assertEquals(Math.PI, evaluator.evaluate("pi", "DEGREES"), 1e-10);
    }

    @Test
    void testEConstant() {
        assertEquals(Math.E, evaluator.evaluate("e", "DEGREES"), 1e-10);
    }

    @Test
    void testPiInExpression() {
        assertEquals(0.0, evaluator.evaluate("sin(pi)", "RADIANS"), 1e-10);
    }

    // Division by zero
    @Test
    void testDivisionByZero() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> evaluator.evaluate("1/0", "DEGREES"));
        assertTrue(ex.getMessage().toLowerCase().contains("infinite") ||
                   ex.getMessage().toLowerCase().contains("division") ||
                   ex.getMessage().toLowerCase().contains("zero"));
    }

    // abs, exp, ceil, floor
    @Test
    void testAbs() {
        assertEquals(5.0, evaluator.evaluate("abs(-5)", "DEGREES"), 1e-10);
    }

    @Test
    void testExp() {
        assertEquals(Math.E, evaluator.evaluate("exp(1)", "DEGREES"), 1e-10);
    }

    @Test
    void testCeil() {
        assertEquals(3.0, evaluator.evaluate("ceil(2.1)", "DEGREES"), 1e-10);
    }

    @Test
    void testFloor() {
        assertEquals(2.0, evaluator.evaluate("floor(2.9)", "DEGREES"), 1e-10);
    }
}
