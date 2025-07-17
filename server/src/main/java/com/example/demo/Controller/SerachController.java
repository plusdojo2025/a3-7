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

        if (title != null && !title.isEmpty() && tagId != null) {
            return projectsRepository.findByProjectNameContainingIgnoreCaseAndProjectTagId(title, tagId);
        } else if (tagId != null) {
            return projectsRepository.findByProjectTagId(tagId);
        } else if (title != null && !title.isEmpty()) {
            return projectsRepository.findByProjectNameContainingIgnoreCase(title);
        } else {
            return List.of(); // 条件がないときは空リスト
        }
    }
	
	//プロジェクト詳細取得

}