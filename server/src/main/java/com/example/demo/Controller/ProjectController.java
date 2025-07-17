package com.example.demo.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Member;
import com.example.demo.Entity.Project;
import com.example.demo.Entity.User;
import com.example.demo.Repository.MembersRepository;
import com.example.demo.Repository.ProjectsRepository;

import jakarta.servlet.http.HttpSession;

@RestController
public class ProjectController {
	
	@Autowired
    private ProjectsRepository projectsRepository;
	private MembersRepository membersRepository;
	
    @GetMapping("/project/")
    public List<Project> getMyPloject(HttpSession session) {
    	User user = (User)session.getAttribute("User");
        List<Member> members = membersRepository.findByUserId(user.getUserId());
    
        List<Project> myProjects = new ArrayList<>();
        for(Member m: members) {
        	Project myProject = projectsRepository.findByProjectId(m.getProjectId());
        	myProjects.add(myProject);
        }
        
        return myProjects;
    
    }

}
