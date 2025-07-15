package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Reports;

public interface ReportsRepository extends JpaRepository<Reports, Integer> {

}
