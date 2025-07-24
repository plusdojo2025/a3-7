package com.example.demo.Controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.EquipDetail;
import com.example.demo.Entity.Equipment;
import com.example.demo.Entity.Unit;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;
import com.example.demo.Repository.UnitsRepository;

@RestController
@RequestMapping("/api/equipment")
public class EquipRegistController {

    @Autowired
    private EquipmentsRepository equipmentRepository;
    @Autowired
    private UnitsRepository unitsRepository;
    @Autowired
    private EquipDetailsRepository equipmentDetailRepository;

    @PostMapping(value = "/regist", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> registerEquipment(
        @RequestParam("equipName") String equipName,
        @RequestParam("limited") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate limited,
        @RequestParam("judge") String judgeStr,
        @RequestParam("remaining") String remainingStr,
        @RequestParam("unit") String unitStr,
        @RequestParam("storage") String storage,
        @RequestParam(value = "remarks", required = false) String remarks,
        @RequestParam(value = "picture", required = false) MultipartFile picture,
        @RequestParam("projectId") Integer projectId
    ) {
        try {
            System.out.println("=== 備品登録開始 ===");
            System.out.println("equipName: " + equipName);
            System.out.println("limited: " + limited);
            System.out.println("judgeStr: " + judgeStr);
            System.out.println("remainingStr: " + remainingStr);
            System.out.println("unitStr: " + unitStr);
            System.out.println("storage: " + storage);
            System.out.println("remarks: " + remarks);
            System.out.println("projectId: " + projectId);
            
            // パラメータの検証
            if (equipName == null || equipName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("備品名が空です");
            }
            if (limited == null) {
                return ResponseEntity.badRequest().body("期限が設定されていません");
            }
            
            // 数値変換の前にnullチェック
            if (remainingStr == null || remainingStr.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("残量が設定されていません");
            }
            if (unitStr == null || unitStr.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("単位が設定されていません");
            }
            if (judgeStr == null || judgeStr.trim().isEmpty()) {
                judgeStr = "10"; // デフォルト値
            }
            if (projectId == null) {
                return ResponseEntity.badRequest().body("プロジェクトIDが指定されていません");
            }

            double remaining = Double.parseDouble(remainingStr);
            int unit = Integer.parseInt(unitStr);
            double judge = Double.parseDouble(judgeStr);

            System.out.println("変換後 - remaining: " + remaining + ", unit: " + unit + ", judge: " + judge);

            // 詳細を保存してequip_detail_idを取得
            EquipDetail detail = new EquipDetail();
            detail.setLimited(java.sql.Date.valueOf(limited));
            detail.setJudge(judge);
            detail.setRemaining(remaining);
            detail.setUnit(unit);
            detail.setStorage(storage);
            detail.setRemarks(remarks);

            if (picture != null && !picture.isEmpty()) {
                System.out.println("画像ファイル名: " + picture.getOriginalFilename());
                System.out.println("画像サイズ: " + picture.getSize() + " bytes");
                detail.setPicture(picture.getBytes());
            } else {
                System.out.println("画像はアップロードされていません");
            }

            System.out.println("EquipDetail保存前");
            EquipDetail savedDetail = equipmentDetailRepository.save(detail);
            System.out.println("EquipDetail保存完了 ID: " + savedDetail.getEquipDetailId());

            // 備品を保存（equip_detail_id、equip_kind_id、project_idも設定）
            Equipment equipment = new Equipment();
            equipment.setEquipName(equipName);
            equipment.setEquipDetailId(savedDetail.getEquipDetailId());
            equipment.setEquipKindId(1); // 備品種類ID（data.sqlから1='道具'）
            equipment.setProjectId(projectId);

            System.out.println("Equipment保存前");
            Equipment savedEquipment = equipmentRepository.save(equipment);
            System.out.println("Equipment保存完了 ID: " + savedEquipment.getEquipId());

            return ResponseEntity.ok("登録成功");
        } catch (IOException e) {
            System.err.println("画像処理エラー: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("画像の処理に失敗しました: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.err.println("数値変換エラー: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("数値の形式が正しくありません: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("予期しないエラー: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("登録に失敗しました: " + e.getMessage());
        }
    }
    @GetMapping("/get/units")
    public List<Unit> getUnit(){
    	return unitsRepository.findAll();
    	}

}