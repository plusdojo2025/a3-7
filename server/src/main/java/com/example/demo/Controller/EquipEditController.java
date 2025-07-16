package com.example.demo.Controller;

import java.sql.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.EquipDetail;
import com.example.demo.Repository.EquipDetailsRepository;

@RestController
@RequestMapping("/api/equipment")
public class EquipEditController {

    @Autowired
    private EquipDetailsRepository equipDetailsRepository;

    /**
     * 1. GET 詳細取得
     */
    @GetMapping("/{id}")
    public EquipDetail getEquipment(@PathVariable Integer id) {
        Optional<EquipDetail> equipOpt = equipDetailsRepository.findById(id);
        return equipOpt.orElse(null);
    }

    /**
     * 2. PUT 更新
     */
    @PutMapping("/{id}")
    public String updateEquipment(
            @PathVariable Integer id,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("quantity") String quantity,
            @RequestParam("unit") String unit,
            @RequestParam("expiryDate") String expiryDate,
            @RequestParam("location") String location,
            @RequestParam("alertTiming") String alertTiming,
            @RequestParam("note") String note
    ) {
        try {
            Optional<EquipDetail> equipOpt = equipDetailsRepository.findById(id);
            if (!equipOpt.isPresent()) {
                return "指定IDのデータが存在しません";
            }

            EquipDetail equip = equipOpt.get();

            // React → Entityフィールド変換
            equip.setRemaining(Double.parseDouble(quantity));
            equip.setUnit(Integer.parseInt(unit));
            equip.setLimited(Date.valueOf(expiryDate));
            equip.setStorage(location);
            equip.setJudge(Double.parseDouble(alertTiming.replace("%", "")));
            equip.setRemarks(note);

            if (image != null && !image.isEmpty()) {
                equip.setPicture(image.getBytes());
            }

            equipDetailsRepository.save(equip);

            return "更新成功";

        } catch (Exception e) {
            e.printStackTrace();
            return "更新失敗";
        }
    }

    /**
     * 3. DELETE 削除
     */
    @DeleteMapping("/{id}")
    public String deleteEquipment(@PathVariable Integer id) {
        try {
            equipDetailsRepository.deleteById(id);
            return "削除成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "削除失敗";
        }
    }
}