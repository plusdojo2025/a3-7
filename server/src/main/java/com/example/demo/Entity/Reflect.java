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
@Table(name="reflects")

public class Reflect {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer reflectId;
	private Integer processId;
	private Integer projectId;
	private Integer reflectTagId;
	private String createdAt;
    private String comment;
}
