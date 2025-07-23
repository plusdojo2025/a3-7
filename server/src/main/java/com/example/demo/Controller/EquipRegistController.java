package com.example.demo.Controller;

import java.io.IOException;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.EquipDetail;
import com.example.demo.Entity.Equipment;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipRegistController {

    private final EquipmentsRepository equipmentRepository;
    private final EquipDetailsRepository equipmentDetailRepository;

    public EquipRegistController(EquipmentsRepository equipmentRepository,
                                 EquipDetailsRepository equipmentDetailRepository) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentDetailRepository = equipmentDetailRepository;
    }

    @PostMapping(value = "/regist", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> registerEquipment(
        @RequestParam("equipName") String equipName,
        @RequestParam("limited") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate limited,
        @RequestParam("judge") String judgeStr,
        @RequestParam("remaining") String remainingStr,
        @RequestParam("unit") String unitStr,
        @RequestParam("storage") String storage,
        @RequestParam(value = "remarks", required = false) String remarks,
        @RequestParam(value = "picture", required = false) MultipartFile picture
    ) throws IOException {

        double remaining = Double.parseDouble(remainingStr);
        int unit = Integer.parseInt(unitStr);
        double judge = Double.parseDouble(judgeStr);

        //詳細を保存して equip_detail_id を取得
        EquipDetail detail = new EquipDetail();
        detail.setLimited(java.sql.Date.valueOf(limited));
        detail.setJudge(judge);
        detail.setRemaining(remaining);
        detail.setUnit(unit);
        detail.setStorage(storage);
        detail.setRemarks(remarks);

        if (picture != null && !picture.isEmpty()) {
            detail.setPicture(picture.getBytes());
        }

        EquipDetail savedDetail = equipmentDetailRepository.save(detail);

        //備品を保存（equip_detail_id、equip_kind_id、project_idも設定）
        Equipment equipment = new Equipment();
        equipment.setEquipName(equipName);
        equipment.setEquipDetailId(savedDetail.getEquipDitailId());
        equipment.setEquipKindId(0); //備品なので0、生物登録なら1にする
        equipment.setProjectId(1);   //必要に応じて動的に変更

        equipmentRepository.save(equipment);

        return ResponseEntity.ok("登録成功");
    }
}