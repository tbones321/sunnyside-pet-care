package com.example.sunnyside.model;

public class ExtraPetPricing {
    private double walkExtraPetPrice;
    private double sittingExtraPetPrice;

    public ExtraPetPricing() {}

    public ExtraPetPricing(double walkExtraPetPrice, double sittingExtraPetPrice) {
        this.walkExtraPetPrice = walkExtraPetPrice;
        this.sittingExtraPetPrice = sittingExtraPetPrice;
    }

    public double getWalkExtraPetPrice() {
        return walkExtraPetPrice;
    }

    public void setWalkExtraPetPrice(double walkExtraPetPrice) {
        this.walkExtraPetPrice = walkExtraPetPrice;
    }

    public double getSittingExtraPetPrice() {
        return sittingExtraPetPrice;
    }

    public void setSittingExtraPetPrice(double sittingExtraPetPrice) {
        this.sittingExtraPetPrice = sittingExtraPetPrice;
    }
}
