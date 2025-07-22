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
@Table(name="project_reports")
public class ProjectReport {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "project_report_id")
	private Integer projectReportId;
	
	private String createdAt;
	
	
	@Column(name = "report", columnDefinition = "TEXT", nullable = false)
	private String report;
	
	@Column(name = "project_id", unique = true)
	private Integer projectId;

}
