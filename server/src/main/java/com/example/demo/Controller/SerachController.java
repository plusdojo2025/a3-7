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
	public List<Project> searchProject (
			@RequestParam(value ="title", required = false) String title,
			@RequestParam(value ="tagId", required = false) Integer tagId
		) {
		
		List<Project> projects;
		
		// タグが選ばれていればタグIDからタグを取得
	    ProjectTag tag = null;
	    if (tagId != null) {
	        tag = projectTagRepository.findById(tagId).orElse(null);
	    }

	    // 条件に応じて検索パターンを分ける
	    if (tag != null && title != null && !title.isEmpty()) {
	        // タイトルとタグの両方で検索
	        projects = projectsRepository.findByProjectNameContainingIgnoreCaseAndTag(title, tag);
	    } else if (tag != null) {
	        // タグだけで検索
	        projects = projectsRepository.findByProjectTagId(1);
	    } else if (title != null && !title.isEmpty()) {
	        // タイトルだけで検索
	        projects = projectsRepository.findByProjectNameContainingIgnoreCase(title);
	    } else {
	        // 検索条件がない場合は空リスト（初期表示なし）
	        projects = List.of();
	    }

        return projects; 
	}
	
	
	//プロジェクト詳細取得

}