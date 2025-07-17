package com.example.demo.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name="members")
public class Member {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "member_id")
	private Integer memberId;
	@Column(name = "project_id")
	private Integer projectId;
	@Column(name = "user_id")
	private Integer userId;
	private Integer authority;
	private Integer attend;
}

