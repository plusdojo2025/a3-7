package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Equipment;

public interface EquipmentsRepository extends JpaRepository<Equipment, Integer> {
}