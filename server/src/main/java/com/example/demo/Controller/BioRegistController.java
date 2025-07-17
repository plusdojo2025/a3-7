package com.example.demo.Controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.BiologyDetail;
import com.example.demo.Repository.BiologyDetailsRepository;

@RestController
@RequestMapping("/api/biology/")
public class BioRegistController {

    @Autowired
    private BiologyDetailsRepository biologyDetailsRepository;

    @PostMapping("/")
    public ResponseEntity<?> registerBiology(
            @RequestParam("kind") String kind,
            @RequestParam("name") String name,
            @RequestParam("gender") Integer gender,
            @RequestParam("age") Integer age,
            @RequestParam("projectProcess") Integer projectProcess,
            @RequestParam("note") String note,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            BiologyDetail bio = new BiologyDetail();
            bio.setKind(kind);
            bio.setName(name);
            bio.setGender(gender);
            bio.setAge(age);
            bio.setProcessId(projectProcess); 
            bio.setRemarks(note);
            bio.setEquipId(1);

            if (image != null && !image.isEmpty()) {
                bio.setPicture(image.getBytes());
            }

            biologyDetailsRepository.save(bio);
            return ResponseEntity.ok("登録完了！");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("画像の読み込みに失敗しました");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("登録に失敗しました");
        }
    }
    
}