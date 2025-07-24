package com.example.demo.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Equipment;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;

@RestController
@RequestMapping("/api/equip")
public class EquipSearchController {

    @Autowired
    private EquipmentsRepository equipmentsRepo;

    @Autowired
    private EquipDetailsRepository detailsRepo;

    @GetMapping("/search")
    public List<EquipmentSearchResponse> searchEquipments(@RequestParam("keyword") String keyword) {
//        List<Equipment> list = equipmentsRepo.findByEquipNameContaining(keyword);
    	List<Equipment> list;
        
        if (keyword == null || keyword.trim().isEmpty()) {
            // キーワードが空の場合は全件取得
            list = equipmentsRepo.findAll();
        } else {
            // キーワード検索
            list = equipmentsRepo.findByEquipNameContaining(keyword);
        }

//        return list.stream().peek(e -> {
//            e.setName(e.getEquipName());
//            e.setType("equip");
//
//            if (e.getEquipDetailId() != null) {
//                detailsRepo.findById(e.getEquipDetailId()).ifPresent(detail -> {
//                    byte[] imgBytes = detail.getPicture();
//                    if (imgBytes != null && imgBytes.length > 0) {
//                        String base64 = Base64.getEncoder().encodeToString(imgBytes);
//                        e.setImage(base64);
//                    } else {
//                        e.setImage("");
//                    }
//                });
//            } else {
//                e.setImage("");
//            }
//
//        }).collect(Collectors.toList());
//    }
    	
        return list.stream().map(equipment -> {
            EquipmentSearchResponse response = new EquipmentSearchResponse();
            response.equipId = equipment.getEquipId();
            response.equipName = equipment.getEquipName();
            response.type = "equip";
            
            // 画像URLを設定（画像が存在する場合のみ）
            if (equipment.getEquipDetailId() != null) {
                detailsRepo.findById(equipment.getEquipDetailId()).ifPresent(detail -> {
                    if (detail.getPicture() != null && detail.getPicture().length > 0) {
                        response.imageUrl = "/api/images/equipment/" + detail.getEquipDetailId();
                    }
                });
            }
            
            return response;
        }).collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<EquipmentSearchResponse> getAllEquipments() {
        return searchEquipments(""); // 全件取得
    }

    /** レスポンス用DTOクラス */
    public static class EquipmentSearchResponse {
        public Integer equipId;
        public String equipName;
        public String type;
        public String imageUrl;
    }
}