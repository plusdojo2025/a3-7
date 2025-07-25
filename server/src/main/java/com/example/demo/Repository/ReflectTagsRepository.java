package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.ReflectTag;

public interface ReflectTagsRepository extends JpaRepository<ReflectTag, Integer> {
	
}
