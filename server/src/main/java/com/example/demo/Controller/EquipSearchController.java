package com.example.demo.Controller;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Equipment;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;

@RestController
@RequestMapping("/api/equip")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipSearchController {

    @Autowired
    private EquipmentsRepository equipmentsRepo;

    @Autowired
    private EquipDetailsRepository detailsRepo;

    @GetMapping("/search")
    public List<Equipment> searchEquipments(@RequestParam("keyword") String keyword) {
        List<Equipment> list = equipmentsRepo.findByEquipNameContaining(keyword);

        return list.stream().peek(e -> {
            e.setName(e.getEquipName());
            e.setType("equip");

            if (e.getEquipDetailId() != null) {
                detailsRepo.findById(e.getEquipDetailId()).ifPresent(detail -> {
                    byte[] imgBytes = detail.getPicture();
                    if (imgBytes != null && imgBytes.length > 0) {
                        String base64 = Base64.getEncoder().encodeToString(imgBytes);
                        e.setImage(base64);
                    } else {
                        e.setImage("");
                    }
                });
            } else {
                e.setImage("");
            }

        }).collect(Collectors.toList());
    }
}