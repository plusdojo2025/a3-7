package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Process;

public interface ProcessesRepository extends JpaRepository<Process, Integer> {
	
	List<Process> findByProjectId(Integer projectId);
	
}
