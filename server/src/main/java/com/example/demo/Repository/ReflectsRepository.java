package com.example.demo.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Reflect;

public interface ReflectsRepository extends JpaRepository<Reflect, Integer> {
	
	List<Reflect> findByProcessId(Integer processId);
	List<Reflect> findByProjectId(Integer projectId);
	Optional<Reflect> findByProcessIdAndCreatedAt(Integer processId, LocalDate createdAt);

}
