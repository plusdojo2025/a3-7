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
	
	// 公開ステータスの値を定数として定義
    private static final Integer publicPrivacyStatus = 1;
	
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
    	//１．titleとtagId両方かつ公開
    	if (title != null && !title.isEmpty() && tagId != null) {
            return projectsRepository.findByProjectNameContainingIgnoreCaseAndProjectTagIdAndPrivacy(title, tagId, publicPrivacyStatus);
        }
        //２．tagIdのみが指定かつ公開
    	else if (tagId != null) {
            return projectsRepository.findByProjectTagIdAndPrivacy(tagId,publicPrivacyStatus);
        }
        //３．titleのみが指定かつ公開
    	else if (title != null && !title.isEmpty()) {
            return projectsRepository.findByProjectNameContainingIgnoreCaseAndPrivacy(title, publicPrivacyStatus);
        } 
        //４．どちらもなし（空リスト）
        else {
            return List.of(); 
        }
    }
}