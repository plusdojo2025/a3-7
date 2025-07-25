package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.Entity.EquipDetail;

public interface EquipDetailsRepository extends JpaRepository<EquipDetail, Integer> {

	@Query("SELECT e FROM EquipDetail e WHERE e.judge >= e.remaining OR e.limited < CURRENT_DATE")
    List<EquipDetail> findByJudgeGreaterThanEqualRemainingOrLimitedBeforeToday();
}