package com.example.demo.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "equipments")
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equip_id")
    private Integer equipId;

    @Column(name = "equip_name")
    private String equipName;

    @Column(name = "equip_kind_id")
    private Integer equipKindId;

    @Column(name = "equip_detail_id")
    private Integer equipDetailId;

    @Column(name = "project_id")
    private Integer projectId;

    @Transient
    private String image;

    @Transient
    private String type = "equip";

    @Transient
    private String name; 
}
