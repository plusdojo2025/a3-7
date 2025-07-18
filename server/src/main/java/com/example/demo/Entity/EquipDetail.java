package com.example.demo.Entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class EquipDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer equipDitailId;

    private Date limited;

    private Double remaining;

    private Integer unit;

    private String remarks;

    private String storage;
    
    private Double judge;

    @Lob
    private Byte[] picture;

    @ManyToOne
    @JoinColumn(name = "equip_id", nullable = false)
    private Equipment equipment;
}