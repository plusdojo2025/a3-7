package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Repository.ProjectsRepository;

@RestController
public class ProjectController {
	
	@Autowired
    private ProjectsRepository projextRepository;
	
    @GetMapping("/project/")
    public List<Project> getMyPloject(HttpSession session) {
        return 
    }

}
