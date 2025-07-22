package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Reflect;

public interface ReflectsRepository extends JpaRepository<Reflect, Integer> {
	
	List<Reflect> findByProcessId(Integer processId);
	List<Reflect> findByProjectId(Integer projectId);

}
