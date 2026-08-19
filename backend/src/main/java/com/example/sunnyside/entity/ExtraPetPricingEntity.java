package com.example.sunnyside.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "extra_pet_pricing")
public class ExtraPetPricingEntity {
    @Id
    private Long id = 1L; // single-row settings table

    private double walkExtraPetPrice;
    private double sittingExtraPetPrice;

    public ExtraPetPricingEntity() {}

    public ExtraPetPricingEntity(double walkExtraPetPrice, double sittingExtraPetPrice) {
        this.walkExtraPetPrice = walkExtraPetPrice;
        this.sittingExtraPetPrice = sittingExtraPetPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
