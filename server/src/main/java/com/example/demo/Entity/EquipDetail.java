package com.example.demo.Entity;

import java.sql.Date;

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
    private Integer equipDitailId;

    private Date limited;

    private Double remaining;

    private Integer unit;

    private String remarks;

    private String storage;
    
    private Double judge;

    @Lob
    private byte[] picture;
/*
    @ManyToOne
    @JoinColumn(name = "equip_id", nullable = false)
    private Equipment equipment;
*/
}