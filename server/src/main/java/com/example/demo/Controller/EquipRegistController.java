package com.example.demo.Controller;

import java.io.IOException;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.EquipDetail;
import com.example.demo.Entity.Equipment;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;

@RestController
@RequestMapping("/api/equipment")
public class EquipRegistController {

    private final EquipmentsRepository equipmentRepository;
    private final EquipDetailsRepository equipmentDetailRepository;

    public EquipRegistController(EquipmentsRepository equipmentRepository,
                                 EquipDetailsRepository equipmentDetailRepository) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentDetailRepository = equipmentDetailRepository;
    }

    @PostMapping("/regist")
    public ResponseEntity<String> registerEquipment(
            @RequestPart("equipName") String equipName,
            @RequestPart("judge") Double judge,
            @RequestPart(value = "limited", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate limited,
            @RequestPart("remaining") Double remaining,
            @RequestPart("unit") Integer unit,
            @RequestPart(value = "remarks", required = false) String remarks,
            @RequestPart(value = "storage", required = false) String storage,
            @RequestPart(value = "picture", required = false) MultipartFile picture
    ) throws IOException {

        // ① equipments に登録
        Equipment equipment = new Equipment();
        equipment.setEquipName(equipName);
        Equipment savedEquip = equipmentRepository.save(equipment);

        // ② equip_details に登録
        EquipDetail detail = new EquipDetail();
        detail.setEquipDitailId(savedEquip.getEquipId());
        detail.setJudge(judge);
        detail.setLimited(limited != null ? java.sql.Date.valueOf(limited) : null);
        detail.setRemaining(remaining);
        detail.setUnit(unit);
        detail.setRemarks(remarks);
        detail.setStorage(storage);

        if (picture != null && !picture.isEmpty()) {
            detail.setPicture(picture.getBytes());
        }

        equipmentDetailRepository.save(detail);

        return ResponseEntity.ok("登録成功");
    }
}