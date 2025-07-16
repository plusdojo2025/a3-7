package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Project;
import com.example.demo.Entity.ProjectTag;

public interface ProjectsRepository extends JpaRepository<Project, Integer>{
	
	List<Project> findByProjectNameContainingIgnoreCase(String name);
	List<Project> findByProjectNameContainingIgnoreCaseAndTag(String name, ProjectTag tag);
	List<Project> findByTag(ProjectTag tag);

}
