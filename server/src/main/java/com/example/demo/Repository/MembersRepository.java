package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Member;

public interface MembersRepository extends JpaRepository<Member, Integer> {
	
}
