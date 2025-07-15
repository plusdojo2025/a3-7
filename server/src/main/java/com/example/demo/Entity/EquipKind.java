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
@Table(name="equip_kinds")
public class EquipKind {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer equip_kind_id;
	private String  equip_kind_name;

}
