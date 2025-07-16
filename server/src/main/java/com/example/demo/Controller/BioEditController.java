package com.example.demo.Controller;

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

import com.example.demo.Entity.BiologyDetail;
import com.example.demo.Repository.BiologyDetailsRepository;

@RestController
@RequestMapping("/api/biology")
public class BioEditController {

    @Autowired
    private BiologyDetailsRepository biologyDetailsRepository;

    /**
     * 1. GET 詳細取得
     */
    @GetMapping("/{id}")
    public BiologyDetail getBiologyDetail(@PathVariable Integer id) {
        return biologyDetailsRepository.findById(id).orElse(null);
    }

    /**
     * 2. PUT 更新
     */
    @PutMapping("/{id}")
    public String updateBiologyDetail(
            @PathVariable Integer id,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("kind") String kind,
            @RequestParam("gender") String gender,
            @RequestParam("age") String age,
            @RequestParam("projectProcess") String projectProcess,
            @RequestParam("note") String note
    ) {
        try {
            Optional<BiologyDetail> biologyOpt = biologyDetailsRepository.findById(id);
            if (!biologyOpt.isPresent()) {
                return "指定IDのデータが存在しません";
            }

            BiologyDetail biology = biologyOpt.get();

            // React → Entityフィールド変換
            biology.setKind(kind);
            biology.setGender(Integer.parseInt(gender));
            biology.setAge(Integer.parseInt(age));
            biology.setProcess_id(Integer.parseInt(projectProcess));
            biology.setRemarks(note);

            if (image != null && !image.isEmpty()) {
                biology.setPicture(image.getBytes());
            }

            biologyDetailsRepository.save(biology);
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
    public String deleteBiologyDetail(@PathVariable Integer id) {
        try {
            biologyDetailsRepository.deleteById(id);
            return "削除成功";
        } catch (Exception e) {
            e.printStackTrace();
            return "削除失敗";
        }
    }
}