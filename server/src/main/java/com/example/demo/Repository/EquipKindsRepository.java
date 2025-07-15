package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.EquipKind;

public interface EquipKindsRepository extends JpaRepository<EquipKind, Integer> {

}
