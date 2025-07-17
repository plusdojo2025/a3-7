package com.example.demo.Controller;

import java.sql.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.EquipDetail;
import com.example.demo.Entity.EquipKind;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipKindsRepository;

@RestController
@RequestMapping("/api/equipment/")
public class EquipRegistController {

    @Autowired
    private EquipDetailsRepository equipDetailsRepository;

    @Autowired
    private EquipKindsRepository equipKindsRepository;

    /** 登録 */
    @PostMapping
    public String registerEquipment(
            @RequestParam("itemName") String itemName,
            @RequestParam("quantity") String quantity,
            @RequestParam("unit") String unit,
            @RequestParam("expiryDate") String expiryDate,
            @RequestParam("location") String location,
            @RequestParam("alertTiming") String alertTiming,
            @RequestParam("note") String note,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // itemName -> EquipKindのID取得
            Optional<EquipKind> kindOpt = equipKindsRepository.findAll()
                    .stream()
                    .filter(k -> k.getEquip_kind_name().equals(itemName))
                    .findFirst();

            if (!kindOpt.isPresent()) {
                return "登録失敗：指定された備品名が種別マスタに存在しません";
            }
            int equipKindId = kindOpt.get().getEquip_kind_id();

            EquipDetail equip = new EquipDetail();

            equip.setUnit(equipKindId); // ReactのitemName→DBのunit(=equip_kind_id)

            equip.setRemaining(Double.parseDouble(quantity));
            equip.setLimited(Date.valueOf(expiryDate));
            equip.setJudge(Double.parseDouble(alertTiming.replace("%", "")));
            equip.setStorage(location);
            equip.setRemarks(note);

            if (image != null && !image.isEmpty()) {
                equip.setPicture(image.getBytes());
            }

            equipDetailsRepository.save(equip);
            return "登録成功";

        } catch (Exception e) {
            e.printStackTrace();
            return "登録失敗";
        }
    }
}
