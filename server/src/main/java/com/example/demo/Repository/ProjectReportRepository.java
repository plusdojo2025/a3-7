package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.ProjectReport;

public interface ProjectReportRepository extends JpaRepository<ProjectReport, Integer> {
	
	List<ProjectReport> findByProjectId(Integer projectId);
}
