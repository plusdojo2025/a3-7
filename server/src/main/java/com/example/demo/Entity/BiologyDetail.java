package com.example.demo.Entity;

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
@Table(name="biology_details")
public class BiologyDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "biology_detail_id")
    private int biologyDetailId;

    private String kind;

    private Integer gender;

    private Integer age;

    @Column(name = "process_id")
    private Integer processId;


    private String remarks;

    @Lob
    private byte[] picture; // バイナリで画像保存
}