package com.example.sunnyside.repository;

import com.example.sunnyside.entity.ExtraPetPricingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExtraPetPricingRepository extends JpaRepository<ExtraPetPricingEntity, Long> {
}
