package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Equipment;
import com.example.demo.Entity.Reflect;
import com.example.demo.Entity.ReflectTag;
import com.example.demo.Entity.Report;
import com.example.demo.Repository.EquipmentsRepository;
import com.example.demo.Repository.ReflectTagsRepository;
import com.example.demo.Repository.ReflectsRepository;
import com.example.demo.Repository.ReportsRepository;
@RestController
@RequestMapping("/api") 
@CrossOrigin(origins = "http://localhost:3001")
public class ReportController {
    //report
    @Autowired
    private ReportsRepository reportRepository;
  
    @PostMapping("/report")
    public Report saveReport(@RequestBody Report report) {
        return reportRepository.save(report);
    }
    @Autowired
    private EquipmentsRepository equipmentsRepository;
 
    @GetMapping("/equip")
    public List<Equipment> getAllEquipment() {
        return equipmentsRepository.findAll();
    }
    @PostMapping("/equip")
    public Equipment saveEquip(@RequestBody Equipment equip) {
        return equipmentsRepository.save(equip);
    }
    

    
    //reflect tag
    @Autowired
    private ReflectTagsRepository reflectTagRepository;
    @GetMapping("/reflectTag")
    public List<ReflectTag> getAllReflectTag() {
        return reflectTagRepository.findAll();
    }
    @PostMapping("/reflectTag")
    public ReflectTag saveReflectTag(@RequestBody ReflectTag reflectTag) {
        return reflectTagRepository.save(reflectTag);
    }
  //reflect
    @Autowired
    private ReflectsRepository reflectRepository;
    @PostMapping("/reflect")
    public Reflect addReflect(@RequestBody Reflect reflect) {
        return reflectRepository.save(reflect);
    }
 

    @GetMapping("/report/{id}")
    public Report getReport(@PathVariable Integer id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reportが見つかりません"));
    }

    // レポート更新（PUT）
    @PutMapping("/report/{id}")
    public Report updateReport(
            @PathVariable Integer id,
            @RequestBody Report updatedReport) {

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reportが見つかりません"));

        // 更新処理：日付は変更不可の場合は除外
        report.setEquipId(updatedReport.getEquipId());
        report.setProjectId(updatedReport.getProjectId()); // もし使うなら
        report.setComment(updatedReport.getComment());
        // createdAt は編集不可なら変更しない

        return reportRepository.save(report);
    }

  
}
