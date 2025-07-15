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
@Table(name="equipments")
public class Equipment {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer equip_id;
	private String  equip_name;
	private Integer equip_kind_id;
	private Integer equip_detail_id;
	private Integer project_id;
	

}
