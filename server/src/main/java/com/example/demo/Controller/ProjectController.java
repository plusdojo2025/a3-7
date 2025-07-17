package com.example.demo.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Member;
import com.example.demo.Entity.Project;
import com.example.demo.Entity.ProjectTag;
import com.example.demo.Entity.Reflect;
import com.example.demo.Entity.ReflectTag;
import com.example.demo.Entity.Report;
import com.example.demo.Entity.User;
import com.example.demo.Repository.MembersRepository;
import com.example.demo.Repository.ProjectTagsRepository;
import com.example.demo.Repository.ProjectsRepository;
import com.example.demo.Repository.ReflectTagsRepository;
import com.example.demo.Repository.ReflectsRepository;
import com.example.demo.Repository.ReportsRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class ProjectController {
	
	@Autowired
    private ProjectsRepository projectsRepository;
	@Autowired
	private ProjectTagsRepository projectTagsRepository;
	@Autowired
	private MembersRepository membersRepository;
    @Autowired
    private ReportsRepository reportRepository;
    @Autowired
    private ReflectsRepository reflectRepository;
    @Autowired
    private ReflectTagsRepository reflectTagRepository;
	
    
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
    
    @PostMapping("/projects/add/")
    public void addProject(@RequestBody Project newProject, HttpSession session) {
    	Object obj =session.getAttribute("user");
    	Integer userId = 0;
    	
    	if (obj instanceof User) {
    	    User user = (User) obj;
    	    userId = user.getUserId();
    	}
    	else {
    	    throw new IllegalStateException("ユーザー情報が確認できませんでした");
    	}
    	
    	System.out.println(newProject); 
    	System.out.println(userId); 
    	Project addedProject = projectsRepository.save(newProject);
    	
    	Integer addedProjectId = addedProject.getProjectId();
    	System.out.println("addedProjectId:"+addedProjectId);
    	Member member = new Member();
    	member.setProjectId(addedProjectId);
    	member.setUserId(userId);
    	member.setAuthority(2);
    	member.setAttend(1);
    	membersRepository.save(member);
    	return;
    }
    
    //projectTag
    @GetMapping("/projectTags/")
    public List<ProjectTag> getProjectTags(){
    	return projectTagsRepository.findAll();
    }
    
    //report
    @PostMapping("/report")
    public Report saveReport(@RequestBody Report report) {
        return reportRepository.save(report);
    }
    //reflect
    @PostMapping("/reflect")
    public Reflect addReflect(@RequestBody Reflect reflect) {
        return reflectRepository.save(reflect);
    }
    //reflect tag
    @GetMapping
    public List<ReflectTag> getAllReflectTag() {
        return reflectTagRepository.findAll();
    }
    
 // メンバー招待（承認待ちで保存）
 	@PostMapping("/members/invite")
 	public Member inviteMember(@RequestBody Member member) {
 		member.setAttend(0); // 承認待ち
 		return membersRepository.save(member);
 	}

 	// メンバー承認
 	@PostMapping("/members/approve")
 	public String approveMember(@RequestBody Member member) {
 		Member m = membersRepository.findByUserIdAndProjectId(member.getUserId(), member.getProjectId());
 		if (m != null) {
 			m.setAttend(1); // 承認済み
 			membersRepository.save(m);
 			return "参加承認しました";
 		} else {
 			return "該当メンバーが見つかりません";
 		}
 	}

 	// プロジェクトに承認済みのメンバーだけを取得
 	@GetMapping("/members/approved")
 	public List<Member> getApprovedMembers(Integer projectId) {
 		return membersRepository.findByProjectIdAndAttend(projectId, 1);
 	}

}
