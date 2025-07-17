package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.Entity.Equipment;
import com.example.demo.Entity.Reflect;
import com.example.demo.Entity.ReflectTag;
import com.example.demo.Entity.Report;
import com.example.demo.Repository.EquipmentsRepository;
import com.example.demo.Repository.ReflectTagsRepository;
import com.example.demo.Repository.ReflectsRepository;
import com.example.demo.Repository.ReportsRepository;

public class ReportController {
    //report
    @Autowired
    private ReportsRepository reportRepository;

    @PostMapping("/report")
    public Report saveReport(@RequestBody Report report) {
        return reportRepository.save(report);
    }
    //reflect
    @Autowired
    private ReflectsRepository reflectRepository;
    @PostMapping("/reflect")
    public Reflect addReflect(@RequestBody Reflect reflect) {
        return reflectRepository.save(reflect);
    }
    //reflect tag
    @Autowired
    private ReflectTagsRepository reflectTagRepository;
    @GetMapping
    public List<ReflectTag> getAllReflectTag() {
        return reflectTagRepository.findAll();
    }
    
    @Autowired
    private EquipmentsRepository equipmentsRepository;
    
    @GetMapping("/report")
    public List<Equipment> getAllEquipment() {
        return equipmentsRepository.findAll();
    }
   
  
}
