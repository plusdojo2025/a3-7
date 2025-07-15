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
@Table(name="processes")
public class Process {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer process_id;
	private String  process_mame;
	private Integer project_id;
	private Integer complete;
}
