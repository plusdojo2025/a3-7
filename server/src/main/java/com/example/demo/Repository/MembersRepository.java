package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Entity.Member;

public interface MembersRepository extends JpaRepository<Member, Integer> {
	
	List<Member> findByUserId(Integer userId);
	Member findByUserIdAndProjectId(Integer userId, Integer projectId);
	List<Member> findByProjectIdAndAttend(Integer projectId, Integer attend);
	List<Member> findAllByUserId(Integer userId);
	List<Member> findAllByUserIdAndAttend(Integer userId,Integer attend);
	

	// 👇 追加：authority を更新するクエリ
	@Modifying
	@Transactional
	@Query("UPDATE Member m SET m.authority = :authority WHERE m.projectId = :projectId AND m.userId = :userId")
	void updateAuthority(@Param("projectId") Integer projectId,
	                     @Param("userId") Integer userId,
	                     @Param("authority") Integer authority);
}
