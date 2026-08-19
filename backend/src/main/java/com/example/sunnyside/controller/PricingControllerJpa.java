package com.example.sunnyside.controller;

import com.example.sunnyside.entity.ExtraPetPricingEntity;
import com.example.sunnyside.entity.PricingEntity;
import com.example.sunnyside.model.ExtraPetPricing;
import com.example.sunnyside.model.Pricing;
import com.example.sunnyside.repository.ExtraPetPricingRepository;
import com.example.sunnyside.repository.PricingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = {"/api/pricing", "/api/pricing/"})
public class PricingControllerJpa {

    private final PricingRepository pricingRepository;
    private final ExtraPetPricingRepository extraPetRepo;

    public PricingControllerJpa(PricingRepository pricingRepository, ExtraPetPricingRepository extraPetRepo) {
        this.pricingRepository = pricingRepository;
        this.extraPetRepo = extraPetRepo;
    }

    @PostConstruct
    public void seedDefaults() {
        if (pricingRepository.count() == 0) {
            pricingRepository.save(new PricingEntity("walk", "15 min", 15, 10.00));
            pricingRepository.save(new PricingEntity("walk", "30 min", 30, 18.00));
            pricingRepository.save(new PricingEntity("walk", "1 hour", 60, 30.00));
            pricingRepository.save(new PricingEntity("sitting", "Half day (4 hours)", 240, 40.00));
            pricingRepository.save(new PricingEntity("sitting", "Full day (8 hours)", 480, 70.00));
        }

        if (extraPetRepo.count() == 0) {
            ExtraPetPricingEntity e = new ExtraPetPricingEntity(10.0, 20.0);
            e.setId(1L);
            extraPetRepo.save(e);
        }
    }

    @GetMapping({"/", ""})
    public List<Pricing> getAllPricing() {
        return pricingRepository.findAll().stream()
                .map(pe -> new Pricing(pe.getId(), pe.getServiceType(), pe.getDurationLabel(), pe.getDurationMinutes(), pe.getPrice()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Pricing> createPricing(@RequestBody Pricing pricing) {
        PricingEntity pe = new PricingEntity(pricing.getServiceType(), pricing.getDurationLabel(), pricing.getDurationMinutes(), pricing.getPrice());
        PricingEntity saved = pricingRepository.save(pe);
        Pricing dto = new Pricing(saved.getId(), saved.getServiceType(), saved.getDurationLabel(), saved.getDurationMinutes(), saved.getPrice());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pricing> updatePricing(@PathVariable long id, @RequestBody Pricing updatedPricing) {
        return pricingRepository.findById(id)
                .map(existing -> {
                    existing.setServiceType(updatedPricing.getServiceType());
                    existing.setDurationLabel(updatedPricing.getDurationLabel());
                    existing.setDurationMinutes(updatedPricing.getDurationMinutes());
                    existing.setPrice(updatedPricing.getPrice());
                    PricingEntity saved = pricingRepository.save(existing);
                    Pricing dto = new Pricing(saved.getId(), saved.getServiceType(), saved.getDurationLabel(), saved.getDurationMinutes(), saved.getPrice());
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePricing(@PathVariable long id) {
        if (pricingRepository.existsById(id)) {
            pricingRepository.deleteById(id);
            return ResponseEntity.ok().body("Pricing option deleted");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/extra-pet")
    public ExtraPetPricing getExtraPetPricing() {
        return extraPetRepo.findById(1L)
                .map(e -> new ExtraPetPricing(e.getWalkExtraPetPrice(), e.getSittingExtraPetPrice()))
                .orElseGet(() -> new ExtraPetPricing(10.0, 20.0));
    }

    @GetMapping("/extra")
    public ExtraPetPricing getExtraPetPricingAlt() {
        return getExtraPetPricing();
    }

    @PutMapping("/extra-pet")
    public ResponseEntity<ExtraPetPricing> updateExtraPetPricing(@RequestBody ExtraPetPricing updatedPricing) {
        ExtraPetPricingEntity e = extraPetRepo.findById(1L).orElseGet(() -> {
            ExtraPetPricingEntity ne = new ExtraPetPricingEntity();
            ne.setId(1L);
            return ne;
        });
        e.setWalkExtraPetPrice(updatedPricing.getWalkExtraPetPrice());
        e.setSittingExtraPetPrice(updatedPricing.getSittingExtraPetPrice());
        ExtraPetPricingEntity saved = extraPetRepo.save(e);
        return ResponseEntity.ok(new ExtraPetPricing(saved.getWalkExtraPetPrice(), saved.getSittingExtraPetPrice()));
    }
}
