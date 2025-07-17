package com.example.demo.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.example.demo.Repository.BiologyDetailsRepository;

@RestController
@RequestMapping("/api/biology/edit")
@CrossOrigin // 必要なら
public class BioEditController {

    @Autowired
    private BiologyDetailsRepository biologyDetailsRepository;

    /** 登録 */
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
            BiologyDetail detail = new BiologyDetail();
            detail.setKind(kind);
            detail.setGender(Integer.parseInt(gender));
            detail.setAge(Integer.parseInt(age));
            detail.setProcess_id(Integer.parseInt(projectProcess));
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

    /** 取得 */
    @GetMapping("/{id}")
    public BiologyDetailResponse getBiology(@PathVariable Integer id) {
        Optional<BiologyDetail> opt = biologyDetailsRepository.findById(id);
        if (!opt.isPresent()) {
            throw new RuntimeException("データが存在しません");
        }
        BiologyDetail detail = opt.get();
        return new BiologyDetailResponse(
                detail.getBiology_detail_id(),
                detail.getKind(),
                detail.getGender(),
                detail.getAge(),
                detail.getProcess_id(),
                detail.getRemarks(),
                null // 画像のURLやBase64は別設計
        );
    }

    /** 更新 */
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
            detail.setProcess_id(Integer.parseInt(projectProcess));
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

    /** 削除 */
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

    /** DTOレスポンスクラス */
    public static class BiologyDetailResponse {
        public int id;
        public String kind;
        public int gender;
        public int age;
        public int projectProcess;
        public String note;
        public String imageUrl;

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