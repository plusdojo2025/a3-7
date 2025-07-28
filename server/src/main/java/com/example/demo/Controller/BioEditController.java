package com.example.demo.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.BiologyDetail;
import com.example.demo.Entity.Equipment;
import com.example.demo.Repository.BiologyDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;

@RestController
@RequestMapping("/api/biology/edit/")
public class BioEditController {

    @Autowired
    private BiologyDetailsRepository biologyDetailsRepository;
    
    @Autowired
    private EquipmentsRepository equipmentsRepository;

    /** 
     * 新規登録
     * 生体詳細を新規作成する
     */
    @PostMapping
    public String createBiology(
            @RequestParam("kind") String kind,
            @RequestParam("gender") String gender,
            @RequestParam("age") String age,
            @RequestParam("projectProcess") String projectProcess,
            @RequestParam("note") String note,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // 生体詳細エンティティの作成
            BiologyDetail detail = new BiologyDetail();
            detail.setKind(kind);
            detail.setGender(Integer.parseInt(gender));
            detail.setAge(Integer.parseInt(age));
            detail.setProcessId(Integer.parseInt(projectProcess));
            detail.setRemarks(note);
            if (image != null && !image.isEmpty()) {
                detail.setPicture(image.getBytes());
            }
            biologyDetailsRepository.save(detail);

            return "登録成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "登録失敗";
        }
    }

    /** 
     * 取得（biologyDetailIdで取得）
     * 直接生体詳細IDで取得する
     */
    @GetMapping("/{id}")
    public BiologyDetailResponse getBiology(@PathVariable Integer id) {
        Optional<BiologyDetail> opt = biologyDetailsRepository.findById(id);
        if (!opt.isPresent()) {
            throw new RuntimeException("データが存在しません");
        }
        BiologyDetail detail = opt.get();
        return new BiologyDetailResponse(
        		detail.getBiologyDetailId(),
                detail.getKind(),
                detail.getGender(),
                detail.getAge(),
                detail.getProcessId(),
                detail.getRemarks(),
                null // 画像のURLやBase64は別設計
        );
    }
    
    /** 
     * 取得（equipIdで取得）
     * 備品IDから生体詳細を取得する
     */
    @GetMapping("/equip/{equipId}")
    public BiologyDetailResponse getBiologyByEquipId(@PathVariable Integer equipId) {
        // まず備品情報を取得
        Optional<Equipment> equipOpt = equipmentsRepository.findById(equipId);
        if (!equipOpt.isPresent()) {
            throw new RuntimeException("備品データが存在しません");
        }
        
        Equipment equipment = equipOpt.get();
        
        // 備品種類が生体（equip_kind_id = 2）であることを確認
        if (equipment.getEquipKindId() == null || equipment.getEquipKindId() != 2) {
            throw new RuntimeException("指定されたIDは生体ではありません");
        }
        
        // 生体詳細IDを使用して生体詳細を取得
        Integer biologyDetailId = equipment.getEquipDetailId();
        if (biologyDetailId == null) {
            throw new RuntimeException("生体詳細IDが設定されていません");
        }
        
        Optional<BiologyDetail> opt = biologyDetailsRepository.findById(biologyDetailId);
        if (!opt.isPresent()) {
            throw new RuntimeException("生体詳細データが存在しません");
        }
        
        BiologyDetail detail = opt.get();
        
        // 画像URLを生成
        String imageUrl = null;
        if (detail.getPicture() != null && detail.getPicture().length > 0) {
            imageUrl = "/api/images/biology/" + detail.getBiologyDetailId();
        }
        
        // レスポンスに備品名も含める
        BiologyDetailResponse response = new BiologyDetailResponse(
            detail.getBiologyDetailId(),
            detail.getKind(),
            detail.getGender(),
            detail.getAge(),
            detail.getProcessId(),
            detail.getRemarks(),
            imageUrl
        );
        response.name = equipment.getEquipName(); // 備品名を追加
        
        return response;
    }

    /** 
     * 更新（biologyDetailIdで更新）
     * 直接生体詳細IDで更新する既存のメソッド
     */
    @PutMapping("/{id}")
    public String updateBiology(
            @PathVariable Integer id,
            @RequestParam("kind") String kind,
            @RequestParam("gender") String gender,
            @RequestParam("age") String age,
            @RequestParam("projectProcess") String projectProcess,
            @RequestParam("note") String note,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            Optional<BiologyDetail> opt = biologyDetailsRepository.findById(id);
            if (!opt.isPresent()) {
                return "更新失敗：データなし";
            }

            BiologyDetail detail = opt.get();
            detail.setKind(kind);
            detail.setGender(Integer.parseInt(gender));
            detail.setAge(Integer.parseInt(age));
            detail.setProcessId(Integer.parseInt(projectProcess));
            detail.setRemarks(note);
            if (image != null && !image.isEmpty()) {
                detail.setPicture(image.getBytes());
            }
            biologyDetailsRepository.save(detail);

            return "更新成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "更新失敗";
        }
    }
    
    /** 
     * 更新（equipIdで更新）
     * 備品IDから生体詳細を更新する
     */
    @PutMapping("/equip/{equipId}")
    public String updateBiologyByEquipId(
            @PathVariable Integer equipId,
            @RequestParam("kind") String kind,
            @RequestParam("gender") String gender,
            @RequestParam("age") String age,
            @RequestParam("projectProcess") String projectProcess,
            @RequestParam("note") String note,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // まず備品情報を取得
            Optional<Equipment> equipOpt = equipmentsRepository.findById(equipId);
            if (!equipOpt.isPresent()) {
                return "更新失敗：備品データなし";
            }
            
            Equipment equipment = equipOpt.get();
            
            // 備品名を更新（指定された場合）
            if (name != null && !name.trim().isEmpty()) {
                equipment.setEquipName(name);
                equipmentsRepository.save(equipment);
            }
            
            // 生体詳細を取得して更新
            Integer biologyDetailId = equipment.getEquipDetailId();
            Optional<BiologyDetail> opt = biologyDetailsRepository.findById(biologyDetailId);
            if (!opt.isPresent()) {
                return "更新失敗：生体詳細データなし";
            }

            BiologyDetail detail = opt.get();
            detail.setKind(kind);
            detail.setGender(Integer.parseInt(gender));
            detail.setAge(Integer.parseInt(age));
            detail.setProcessId(Integer.parseInt(projectProcess));
            detail.setRemarks(note);
            if (image != null && !image.isEmpty()) {
                detail.setPicture(image.getBytes());
            }
            biologyDetailsRepository.save(detail);

            return "更新成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "更新失敗";
        }
    }

    /** 
     * 削除（biologyDetailIdで削除）
     * 直接生体詳細IDで削除する既存のメソッド
     */
    @DeleteMapping("/{id}")
    public String deleteBiology(@PathVariable Integer id) {
        try {
            biologyDetailsRepository.deleteById(id);
            return "削除成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "削除失敗";
        }
    }
    
    /** 
     * 削除（equipIdで削除）
     * 備品IDから生体詳細を削除する
     */
    @DeleteMapping("/equip/{equipId}")
    public String deleteBiologyByEquipId(@PathVariable Integer equipId) {
        try {
            // まず備品情報を取得
            Optional<Equipment> equipOpt = equipmentsRepository.findById(equipId);
            if (!equipOpt.isPresent()) {
                return "削除失敗：備品データなし";
            }
            
            Equipment equipment = equipOpt.get();
            Integer biologyDetailId = equipment.getEquipDetailId();
            
            // 備品レコードを削除
            equipmentsRepository.deleteById(equipId);
            
            // 生体詳細レコードも削除
            if (biologyDetailId != null) {
                biologyDetailsRepository.deleteById(biologyDetailId);
            }
            
            return "削除成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "削除失敗";
        }
    }

    /** 
     * DTOレスポンスクラス
     * 生体詳細情報を返すためのレスポンスクラス
     */
    public static class BiologyDetailResponse {
        public int id;
        public String kind;
        public int gender;
        public int age;
        public int projectProcess;
        public String note;
        public String imageUrl;
        public String name; // 備品名を追加

        public BiologyDetailResponse(int id, String kind, int gender, int age, int projectProcess, String note, String imageUrl) {
            this.id = id;
            this.kind = kind;
            this.gender = gender;
            this.age = age;
            this.projectProcess = projectProcess;
            this.note = note;
            this.imageUrl = imageUrl;
        }
    }
}