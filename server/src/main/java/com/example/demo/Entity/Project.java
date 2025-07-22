package com.example.demo.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name="project")
public class Project {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "project_id")
	private Integer projectId;
	@Column(name = "project_name", length=100)
	private String  projectName;
	private Integer privacy;
	
	@Column(name = "project_tag_id")
	private Integer projectTagId;
	
	@ManyToOne
    @JoinColumn(name = "tag_id") 
    private ProjectTag tag;
	
	@Column(columnDefinition = "int default 0")
	private Integer complete;
}
