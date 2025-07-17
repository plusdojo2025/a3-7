package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.ProjectTag;

public interface ProjectTagsRepository extends JpaRepository<ProjectTag, Integer> {
	
	ProjectTag findByProjectTagName(String name);

}
