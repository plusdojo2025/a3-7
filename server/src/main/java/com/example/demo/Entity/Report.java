package com.example.demo.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "reports",
uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "process_id", "created_at"}))

public class Report {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "report_id")
	private Integer reportId;
	@Column(name = "project_id")
	private Integer projectId;
	@Column(name = "process_id")
	private Integer processId;
	private LocalDate createdAt;
	@Column(name = "comment", length = 300)
	private String comment;
}
