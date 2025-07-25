package com.example.demo.Entity;

import java.time.LocalDate;

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
@Table(name="reflects")

public class Reflect {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "reflect_id")
	private Integer reflectId;
	@Column(name = "process_id")
	private Integer processId;
	@Column(name = "project_id")
	private Integer projectId;
	@Column(name = "reflect_tag_id")
	private Integer reflectTagId;
	private LocalDate createdAt;
    private String comment;
}
