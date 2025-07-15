package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Unit;

public interface UnitsRepository extends JpaRepository<Unit, Integer> {

}
