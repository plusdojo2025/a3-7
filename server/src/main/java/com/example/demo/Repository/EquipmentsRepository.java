package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Equipment;

public interface EquipmentsRepository extends JpaRepository<Equipment, Integer> {

	List<Equipment> findByEquipNameContaining(String keyword);
	
	 List<Equipment> findByProjectIdAndEquipNameContaining(Integer projectId, String keyword);
	 
	 List<Equipment> findByProjectId(Integer projectId);
}
