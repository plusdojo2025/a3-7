package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.BiologyDetail;

public interface BiologyDetailsRepository extends JpaRepository<BiologyDetail, Integer> {

}
