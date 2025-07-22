package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
 

    @GetMapping("/report/{reportId}")
    public Report getReport(@PathVariable("reportId") Integer reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    @PostMapping("/report/{reportId}")
    public Report updateReport(@PathVariable("reportId") Integer reportId, @RequestBody Report updatedReport) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Update fields
        report.setEquipId(updatedReport.getEquipId());
        report.setProjectId(updatedReport.getProjectId());
        report.setProcessId(updatedReport.getProcessId());
        report.setCreatedAt(updatedReport.getCreatedAt());
        report.setComment(updatedReport.getComment());

        return reportRepository.save(report);
    }}
  

