package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.EquipDetail;

public interface EquipDetailsRepository extends JpaRepository<EquipDetail, Integer> {
}