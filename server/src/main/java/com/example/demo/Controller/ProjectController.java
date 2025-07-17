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
	@Autowired
	private MembersRepository membersRepository;
	
    @GetMapping("/projects/")
    public List<Project> getMyPloject(HttpSession session) {
 
    	Object obj =session.getAttribute("user");
    	Integer userId = 0;
    	
    	if (obj instanceof User) {
    	    User user = (User) obj;
    	    userId = user.getUserId();
    	    System.out.println("userId = " + userId);
    	}
        List<Member> members = membersRepository.findAllByUserId(userId);
    
        List<Project> myProjects = new ArrayList<>();
        for(Member m: members) {
        	Project myProject = projectsRepository.findByProjectId(m.getProjectId());
        	myProjects.add(myProject);
        }
        
        return myProjects;
    
    }

}
