package com.example.demo.Entity;

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
	private Integer project_id;
	private String  user_id;
	private Integer authority;
	private Integer attend;
}

