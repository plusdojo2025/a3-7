package com.example.demo.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Report;

public interface ReportsRepository extends JpaRepository<Report, Integer> {
	
	List<Report> findByProcessId(Integer processId);

	Optional<Report> findByProcessIdAndCreatedAt(Integer processId, LocalDate createdAt);

}
