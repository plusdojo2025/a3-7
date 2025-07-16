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
@Table(name="biology_details")
public class BiologyDetail {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int biology_detail_id;
	private String kind;
	private int gender;
	private int age;
	private int process_id;
	private String remarks;
	private byte[] picture; 
}
