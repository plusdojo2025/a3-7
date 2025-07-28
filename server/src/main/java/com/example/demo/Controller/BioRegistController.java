package com.example.demo.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Entity.BiologyDetail;
import com.example.demo.Entity.Equipment;
import com.example.demo.Entity.Process;
import com.example.demo.Repository.BiologyDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;
import com.example.demo.Repository.ProcessesRepository;

@RestController
@RequestMapping("/api/biology/")
public class BioRegistController {

    @Autowired
    private EquipmentsRepository equipmentsRepository;

    @Autowired
    private BiologyDetailsRepository biologyDetailsRepository;
    
    @Autowired
    private ProcessesRepository processesRepository;
    
    /**
     * プロジェクトIDから実験工程リストを取得
     */
    @GetMapping("/processes/{projectId}")
    public ResponseEntity<List<Process>> getProcessByProjectId(@PathVariable Integer projectId) {
    	try {
    		List<Process> process = processesRepository.findByProjectId(projectId);
    		return ResponseEntity.ok(process);
    	}
    	catch (Exception e) {
    		e.printStackTrace();
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    	}
    }

    /**
     * 生体の新規登録
     * 生体詳細テーブルと備品管理テーブルの両方に登録する
     */
    @PostMapping("/")
    public ResponseEntity<?> registerBiology(
            @RequestParam("kind") String kind,
            @RequestParam("name") String name,
            @RequestParam("gender") Integer gender,
            @RequestParam("age") Integer age,
            @RequestParam("projectProcess") Integer projectProcess,
            @RequestParam("note") String note,
            @RequestParam("projectId") Integer projectId,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // 生体詳細エンティティの作成
            BiologyDetail bio = new BiologyDetail();
            bio.setKind(kind);
            bio.setGender(gender);
            bio.setAge(age);
            bio.setProcessId(projectProcess);
            bio.setRemarks(note);

            // 画像がある場合は設定
            if (image != null && !image.isEmpty()) {
                bio.setPicture(image.getBytes());
            }

            // 生物詳細を保存
            BiologyDetail savedBio = biologyDetailsRepository.save(bio);

            // 備品管理テーブルにも登録
            Equipment equipment = new Equipment();
            equipment.setEquipName(name);
            equipment.setEquipDetailId(savedBio.getBiologyDetailId());
            equipment.setProjectId(projectId);
            equipment.setEquipKindId(2); // 生体で固定（最初から設定）

            // 一度だけ保存
            equipmentsRepository.save(equipment);
            
            return ResponseEntity.ok("登録完了！");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("画像の読み込みに失敗しました");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("登録に失敗しました");
        }
    }
}