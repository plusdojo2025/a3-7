package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Project;

public interface ProjectsRepository extends JpaRepository<Project, Integer>{
	
	List<Project> findByProjectNameContainingIgnoreCase(String name);

	List<Project> findByProjectNameContainingIgnoreCaseAndProjectTagId(String name, Integer tagId);
	List<Project> findByProjectTagId(Integer tagId);

	Project findByProjectId(Integer projectId);

}