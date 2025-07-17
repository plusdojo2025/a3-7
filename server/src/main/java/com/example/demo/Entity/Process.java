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
@Table(name="processes")
public class Process {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "process_id")
	private Integer processId;
	@Column(name = "process_name")
	private String  processName;
	@Column(name = "project_id")
	private Integer projectId;
	private Integer complete;
}
