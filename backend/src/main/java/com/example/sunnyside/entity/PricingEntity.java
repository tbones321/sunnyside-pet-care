package com.example.sunnyside.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pricing")
public class PricingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceType;
    private String durationLabel;
    private int durationMinutes;
    private double price;

    public PricingEntity() {}

    public PricingEntity(String serviceType, String durationLabel, int durationMinutes, double price) {
        this.serviceType = serviceType;
        this.durationLabel = durationLabel;
        this.durationMinutes = durationMinutes;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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
