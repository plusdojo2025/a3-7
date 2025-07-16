package com.example.demo.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.BiologyDetail;
import com.example.demo.Entity.EquipKind;
import com.example.demo.Repository.BiologyDetailsRepository;
import com.example.demo.Repository.EquipKindsRepository;

@RestController
@RequestMapping("/api/biology")
public class BioRegistController {

    @Autowired
    private BiologyDetailsRepository biologyDetailsRepository;

    @Autowired
    private EquipKindsRepository equipKindsRepository;

    /** 登録 */
    @PostMapping
    public String registerBiology(
            @RequestParam("kind") String kind,
            @RequestParam("name") String name,
            @RequestParam("gender") String gender,
            @RequestParam("age") String age,
            @RequestParam("projectProcess") String projectProcess,
            @RequestParam("note") String note,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // Reactのname（種別名）→DBのequip_kind_id
            Optional<EquipKind> kindOpt = equipKindsRepository.findAll()
                    .stream()
                    .filter(k -> k.getEquip_kind_name().equals(name))
                    .findFirst();

            if (!kindOpt.isPresent()) {
                return "登録失敗：指定された名前（種別）がマスタに存在しません";
            }

            int equipKindId = kindOpt.get().getEquip_kind_id();

            BiologyDetail biology = new BiologyDetail();
            biology.setKind(kind);
            biology.setGender(Integer.parseInt(gender));
            biology.setAge(Integer.parseInt(age));
            biology.setProcess_id(Integer.parseInt(projectProcess));
            biology.setRemarks(note);

            if (image != null && !image.isEmpty()) {
                biology.setPicture(image.getBytes());
            }

            // 保存
            biologyDetailsRepository.save(biology);

            return "登録成功";

        } catch (Exception e) {
            e.printStackTrace();
            return "登録失敗";
        }
    }
}