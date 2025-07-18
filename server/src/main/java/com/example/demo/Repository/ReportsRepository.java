package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Report;

public interface ReportsRepository extends JpaRepository<Report, Integer> {
	
	List<Report> findByProcessId(Integer processId);

}
