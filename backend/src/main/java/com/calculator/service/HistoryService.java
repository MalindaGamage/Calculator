package com.calculator.service;

import com.calculator.model.CalculationResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class HistoryService {

    private static final int MAX_HISTORY_SIZE = 20;

    private final CopyOnWriteArrayList<CalculationResponse> history = new CopyOnWriteArrayList<>();

    public void add(CalculationResponse response) {
        if (history.size() >= MAX_HISTORY_SIZE) {
            history.remove(0);
        }
        history.add(response);
    }

    public List<CalculationResponse> getAll() {
        return new ArrayList<>(history);
    }

    public void clear() {
        history.clear();
    }
}
