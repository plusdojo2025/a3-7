package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Project;
import com.example.demo.Entity.ProjectTag;
import com.example.demo.Repository.ProjectTagsRepository;
import com.example.demo.Repository.ProjectsRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SerachController {
	@Autowired
	private ProjectsRepository projectsRepository;
	
	@Autowired
	private ProjectTagsRepository projectTagRepository;
	
	// タグ一覧API
    @GetMapping("/project-tags")
    public List<ProjectTag> getAllTags() {
        return projectTagRepository.findAll();
    }
	//検索処理
    @GetMapping("/projects/search")
    public List<Project> searchProjects(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "tagId", required = false) Integer tagId) {

    	//検索条件ロジック
    	//１．titleとtagId両方
        if (title != null && !title.isEmpty() && tagId != null) {
            return projectsRepository.findByProjectNameContainingIgnoreCaseAndProjectTagId(title, tagId);
        } 
        //２．tagIdのみが指定
        else if (tagId != null) {
            return projectsRepository.findByProjectTagId(tagId);
        } 
        //３．titleのみが指定
        else if (title != null && !title.isEmpty()) {
            return projectsRepository.findByProjectNameContainingIgnoreCase(title);
        } 
        //４．どちらもなし（空リスト）
        else {
            return List.of(); 
        }
    }
}