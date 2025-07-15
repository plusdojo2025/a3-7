package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Project;

public interface ProjectsRepository extends JpaRepository<Project, Integer>{

}
