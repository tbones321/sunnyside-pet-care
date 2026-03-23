package com.example.sunnyside.model;

public class Pricing {
    private long id;
    private String serviceType; // "walk" or "sitting"
    private String durationLabel; // e.g., "15 min", "30 min", "1 hour"
    private int durationMinutes;
    private double price;

    public Pricing() {}

    public Pricing(long id, String serviceType, String durationLabel, int durationMinutes, double price) {
        this.id = id;
        this.serviceType = serviceType;
        this.durationLabel = durationLabel;
        this.durationMinutes = durationMinutes;
        this.price = price;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getDurationLabel() {
        return durationLabel;
    }

    public void setDurationLabel(String durationLabel) {
        this.durationLabel = durationLabel;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
