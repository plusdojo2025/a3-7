package com.example.demo.Controller;

import java.sql.Date;
import java.util.List;
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

import com.example.demo.Entity.EquipDetail;
import com.example.demo.Entity.Equipment;
import com.example.demo.Entity.Unit;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;
import com.example.demo.Repository.UnitsRepository;

@RestController
//@RequestMapping("/equipment/details/equip/")
@RequestMapping("/api/equipment/edit")
public class EquipEditController {

    @Autowired
    private EquipDetailsRepository equipDetailsRepository;
    @Autowired
    private UnitsRepository unitsRepository;
    @Autowired
    private EquipmentsRepository equipmentsRepository;

    /** 登録 */
    @PostMapping
    public String createEquipment(
            @RequestParam("itemName") String itemName,
            @RequestParam("quantity") String quantity,
            @RequestParam("unit") String unit,
            @RequestParam("expiryDate") String expiryDate,
            @RequestParam("location") String location,
            @RequestParam("judge") String judge,
            @RequestParam("note") String note,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // EquipDetailエンティティを作成
            EquipDetail detail = new EquipDetail();
            detail.setRemaining(Double.parseDouble(quantity));
            detail.setUnit(Integer.parseInt(unit));
            detail.setLimited(Date.valueOf(expiryDate));
            detail.setStorage(location);
            detail.setJudge(Double.parseDouble(judge));
            detail.setRemarks(note);
            if (image != null && !image.isEmpty()) {
                detail.setPicture(image.getBytes());
            }
            equipDetailsRepository.save(detail);

            // Equipmentエンティティを作成
            Equipment equipment = new Equipment();
            equipment.setEquipName(itemName);
            equipment.setEquipDetailId(detail.getEquipDetailId());
            equipmentsRepository.save(equipment);

            return "登録成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "登録失敗";
        }
    }

    /** 取得 */
    @GetMapping("/{id}")
    public EquipmentDetailResponse getEquipment(@PathVariable Integer id) {
        Optional<Equipment> eqOpt = equipmentsRepository.findById(id);
        if (!eqOpt.isPresent()) {
            throw new RuntimeException("Equipment not found");
        }
        Equipment equipment = eqOpt.get();

        Optional<EquipDetail> detailOpt = equipDetailsRepository.findById(equipment.getEquipDetailId());
        if (!detailOpt.isPresent()) {
            throw new RuntimeException("EquipDetail not found");
        }
        EquipDetail detail = detailOpt.get();
        
        // 画像URLを生成（画像が存在する場合のみ）
        String imageUrl = null;
        if (detail.getPicture() != null) {
            imageUrl = "/api/images/equipment/" + detail.getEquipDetailId();
        }

        // 画像はURLなどで配信する運用を想定
        return new EquipmentDetailResponse(
                equipment.getEquipId(),
                equipment.getEquipName(),
                detail.getRemaining(),
                detail.getUnit(),
                detail.getLimited().toString(),
                detail.getStorage(),
                detail.getJudge(),
                detail.getRemarks(),
//                null // 画像URLは別途設計
                imageUrl
        );
    }

    /** 更新 */
    @PutMapping("/{id}")
    public String updateEquipment(
            @PathVariable Integer id,
            @RequestParam("itemName") String itemName,
            @RequestParam("quantity") String quantity,
            @RequestParam("unit") String unit,
            @RequestParam("expiryDate") String expiryDate,
            @RequestParam("location") String location,
            @RequestParam("judge") String judge,
            @RequestParam("note") String note,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            Optional<Equipment> eqOpt = equipmentsRepository.findById(id);
            if (!eqOpt.isPresent()) return "更新失敗：Equipmentなし";
            Equipment equipment = eqOpt.get();
            equipment.setEquipName(itemName);
            equipmentsRepository.save(equipment);

            Optional<EquipDetail> detailOpt = equipDetailsRepository.findById(equipment.getEquipDetailId());
            if (!detailOpt.isPresent()) return "更新失敗：Detailなし";
            EquipDetail detail = detailOpt.get();
            detail.setRemaining(Double.parseDouble(quantity));
            detail.setUnit(Integer.parseInt(unit));
            detail.setLimited(Date.valueOf(expiryDate));
            detail.setStorage(location);
            detail.setJudge(Double.parseDouble(judge));
            detail.setRemarks(note);
            if (image != null && !image.isEmpty()) {
                detail.setPicture(image.getBytes());
            }
            equipDetailsRepository.save(detail);

            return "更新成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "更新失敗";
        }
    }

    /** 削除 */
    @DeleteMapping("/{id}")
    public String deleteEquipment(@PathVariable Integer id) {
        try {
            Optional<Equipment> eqOpt = equipmentsRepository.findById(id);
            if (!eqOpt.isPresent()) return "削除失敗：Equipmentなし";
            Equipment equipment = eqOpt.get();

            // detailも一緒に削除
            equipmentsRepository.deleteById(id);
            equipDetailsRepository.deleteById(equipment.getEquipDetailId());

            return "削除成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "削除失敗";
        }
    }

    /** レスポンスDTOクラス */
    public static class EquipmentDetailResponse {
        public Integer id;
        public String itemName;
        public double quantity;
        public int unit;
        public String expiryDate;
        public String location;
        public double judge;
        public String note;
        public String imageUrl;

        public EquipmentDetailResponse(Integer id, String itemName, double quantity, int unit, String expiryDate,
                                       String location, double judge, String note, String imageUrl) {
            this.id = id;
            this.itemName = itemName;
            this.quantity = quantity;
            this.unit = unit;
            this.expiryDate = expiryDate;
            this.location = location;
            this.judge = judge;
            this.note = note;
            this.imageUrl = imageUrl;
        }
    }
    
    @GetMapping("/get/units")
    public List<Unit> getUnit(){
    	return unitsRepository.findAll();
    }
    
    @GetMapping("/get/allDetails")
    public List<EquipDetail> getAllDetails(){
    	return equipDetailsRepository.findAll();
    }
}