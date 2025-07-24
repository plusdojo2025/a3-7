package com.example.demo.Entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "equip_details")
public class EquipDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equip_detail_id")
    private Integer equipDetailId;
    
    @Column(name = "remaining")
    private Double remaining;
    
    @Column(name = "limited")
    private Date limited;
    
    @Column(name = "judge")
    private Double judge;
    
    @Column(name = "storage")
    private String storage;
    
    @Column(name = "remarks")
    private String remarks;
    
    @Column(name = "unit")
    private Integer unit;
    
    @Lob
    @Column(name = "picture")
    private byte[] picture;

}