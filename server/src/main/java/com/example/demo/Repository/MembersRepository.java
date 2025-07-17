package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Member;

public interface MembersRepository extends JpaRepository<Member, Integer> {
	
	List<Member> findByUserId(Integer userId);
	Member findByUserIdAndProjectId(Integer userId, Integer projectId);
	List<Member> findByProjectIdAndAttend(Integer projectId, Integer attend);
}
