package com.example.sunnyside.repository;

import com.example.sunnyside.entity.PricingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PricingRepository extends JpaRepository<PricingEntity, Long> {
}
