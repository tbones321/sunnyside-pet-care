package com.example.sunnyside.controller;

import com.example.sunnyside.model.ExtraPetPricing;
import com.example.sunnyside.model.Pricing;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping(path = {"/api/pricing", "/api/pricing/"})
public class PricingController {

    private final List<Pricing> pricingList = new CopyOnWriteArrayList<>();
    private final AtomicLong counter = new AtomicLong(1);
    private volatile double walkExtraPetPrice = 10.0;
    private volatile double sittingExtraPetPrice = 20.0;

    public PricingController() {
        // Initialize with some default pricing options
        pricingList.add(new Pricing(counter.getAndIncrement(), "walk", "15 min", 15, 10.00));
        pricingList.add(new Pricing(counter.getAndIncrement(), "walk", "30 min", 30, 18.00));
        pricingList.add(new Pricing(counter.getAndIncrement(), "walk", "1 hour", 60, 30.00));
        pricingList.add(new Pricing(counter.getAndIncrement(), "sitting", "Half day (4 hours)", 240, 40.00));
        pricingList.add(new Pricing(counter.getAndIncrement(), "sitting", "Full day (8 hours)", 480, 70.00));
    }

    @GetMapping({"/", ""})
    public List<Pricing> getAllPricing() {
        return pricingList;
    }

    @PostMapping
    public ResponseEntity<Pricing> createPricing(@RequestBody Pricing pricing) {
        pricing.setId(counter.getAndIncrement());
        pricingList.add(pricing);
        return ResponseEntity.ok(pricing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pricing> updatePricing(@PathVariable long id, @RequestBody Pricing updatedPricing) {
        Pricing existing = pricingList.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);

        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        existing.setServiceType(updatedPricing.getServiceType());
        existing.setDurationLabel(updatedPricing.getDurationLabel());
        existing.setDurationMinutes(updatedPricing.getDurationMinutes());
        existing.setPrice(updatedPricing.getPrice());

        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePricing(@PathVariable long id) {
        boolean removed = pricingList.removeIf(p -> p.getId() == id);
        if (removed) {
            return ResponseEntity.ok().body("Pricing option deleted");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/extra-pet")
    public ExtraPetPricing getExtraPetPricing() {
        return new ExtraPetPricing(walkExtraPetPrice, sittingExtraPetPrice);
    }

    // Alternate public endpoint in case hyphenated path causes issues in some environments/tools
    @GetMapping("/extra")
    public ExtraPetPricing getExtraPetPricingAlt() {
        return new ExtraPetPricing(walkExtraPetPrice, sittingExtraPetPrice);
    }

    @PutMapping("/extra-pet")
    public ResponseEntity<ExtraPetPricing> updateExtraPetPricing(@RequestBody ExtraPetPricing updatedPricing) {
        this.walkExtraPetPrice = updatedPricing.getWalkExtraPetPrice();
        this.sittingExtraPetPrice = updatedPricing.getSittingExtraPetPrice();
        return ResponseEntity.ok(new ExtraPetPricing(walkExtraPetPrice, sittingExtraPetPrice));
    }
}
