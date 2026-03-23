package com.example.sunnyside.controller;

import com.example.sunnyside.model.Pricing;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {

    private final List<Pricing> pricingList = new CopyOnWriteArrayList<>();
    private final AtomicLong counter = new AtomicLong(1);

    public PricingController() {
        // Initialize with some default pricing options
        pricingList.add(new Pricing(counter.getAndIncrement(), "walk", "15 min", 15, 10.00));
        pricingList.add(new Pricing(counter.getAndIncrement(), "walk", "30 min", 30, 18.00));
        pricingList.add(new Pricing(counter.getAndIncrement(), "walk", "1 hour", 60, 30.00));
        pricingList.add(new Pricing(counter.getAndIncrement(), "sitting", "Half day (4 hours)", 240, 40.00));
        pricingList.add(new Pricing(counter.getAndIncrement(), "sitting", "Full day (8 hours)", 480, 70.00));
    }

    @GetMapping
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
}
