package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Process;

public interface ProcessesRepository extends JpaRepository<Process, Integer> {
	


}
