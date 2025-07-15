package com.example.demo.Entity;

import java.sql.Date;

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
@Table(name="equip_details")
public class EquipDetail {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer equip_ditail_id;
	private double remaining;
	private Date limited;
	private double judge;
	private String storage;
	private String remarks;
	private int unit;
	private byte[] picture;

}
