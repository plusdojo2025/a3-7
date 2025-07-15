package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Report;

public interface ReportsRepository extends JpaRepository<Report, Integer> {

}
