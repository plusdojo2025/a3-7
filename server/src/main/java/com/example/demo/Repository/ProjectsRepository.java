package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Project;

public interface ProjectsRepository extends JpaRepository<Project, Integer>{
	
	    //プロジェクト名で検索し、かつ privacyが１ (公開) のプロジェクト
		List<Project> findByProjectNameContainingIgnoreCaseAndPrivacy(String name, Integer privacy);

	    //プロジェクト名とタグID両方で検索し、かつ privacyが１ (公開) のプロジェクト
		List<Project> findByProjectNameContainingIgnoreCaseAndProjectTagIdAndPrivacy(String name, Integer tagId, Integer privacy);
	    
	    //タグIDで検索し、かつ privacyが１ (公開) のプロジェクト
		List<Project> findByProjectTagIdAndPrivacy(Integer tagId, Integer privacy);

		Project findByProjectId(Integer projectId);
		
}