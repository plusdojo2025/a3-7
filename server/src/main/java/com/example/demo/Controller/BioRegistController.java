package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.BiologyDetail;
import com.example.demo.Repository.BiologyDetailsRepository;

@RestController
public class BioRegistController {

    @Autowired
    private BiologyDetailsRepository biologyDetailsRepository;

    @PostMapping("/api/biology")
    public String registerBiology(
        @RequestParam(value = "image", required = false) MultipartFile image,
        @RequestParam("kind") String kind,
        @RequestParam("gender") String gender,
        @RequestParam("age") String age,
        @RequestParam("projectProcess") String projectProcess,
        @RequestParam(value = "note", required = false) String note
    ) {
        try {
            BiologyDetail biology = new BiologyDetail();

            // React → Entity マッピング
            biology.setKind(kind);
            biology.setGender(Integer.parseInt(gender));
            biology.setAge(Integer.parseInt(age));
            biology.setProcess_id(Integer.parseInt(projectProcess));
            biology.setRemarks(note);

            if (image != null && !image.isEmpty()) {
                biology.setPicture(image.getBytes());
            }

            biologyDetailsRepository.save(biology);

            return "登録成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "登録失敗";
        }
    }
}