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
import com.example.demo.Entity.User;
import com.example.demo.Repository.MembersRepository;
import com.example.demo.Repository.ProjectsRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class ProjectController {

	@Autowired
	private ProjectsRepository projectsRepository;
	@Autowired
	private MembersRepository membersRepository;

	@GetMapping("/project/")
	public List<Project> getMyPloject(HttpSession session) {
		User user = (User) session.getAttribute("User");
		List<Member> members = membersRepository.findByUserId(user.getUserId());

		List<Project> myProjects = new ArrayList<>();
		for (Member m : members) {
			Project myProject = projectsRepository.findByProjectId(m.getProjectId());
			myProjects.add(myProject);
		}

		return myProjects;

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
