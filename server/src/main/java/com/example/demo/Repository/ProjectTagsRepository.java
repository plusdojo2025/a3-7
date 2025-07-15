package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.ProjectTags;

public interface ProjectTagsRepository extends JpaRepository<ProjectTags, Integer> {

}
