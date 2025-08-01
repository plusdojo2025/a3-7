package com.example.demo.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Equipment;
import com.example.demo.Entity.Project;
import com.example.demo.Entity.Reflect;
import com.example.demo.Entity.ReflectTag;
import com.example.demo.Entity.Report;
import com.example.demo.Repository.EquipmentsRepository;
import com.example.demo.Repository.ProcessesRepository;
import com.example.demo.Repository.ProjectsRepository;
import com.example.demo.Repository.ReflectTagsRepository;
import com.example.demo.Repository.ReflectsRepository;
import com.example.demo.Repository.ReportsRepository;

@RestController
@RequestMapping("/api") 
@CrossOrigin(origins = "http://localhost:3001")
public class ReportController {

    @Autowired
    private ReportsRepository reportRepository;

    @Autowired
    private EquipmentsRepository equipmentsRepository;

    @Autowired
    private ReflectTagsRepository reflectTagRepository;

    @Autowired
    private ReflectsRepository reflectRepository;
    @Autowired
    private ProjectsRepository projectRepository;
    @Autowired
    private ProcessesRepository processRepository;

    // Equipment一覧取得
    @GetMapping("/equip")
    public List<Equipment> getAllEquipment() {
        return equipmentsRepository.findAll();
    }
    //get equip id
    @GetMapping("/equip/{equipId}")
    public ResponseEntity<Equipment> getEquipProject(@PathVariable Integer equipId) {
        return equipmentsRepository.findById(equipId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
 // Project一覧取得

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Project> getReportProject(@PathVariable Integer projectId) {
        return projectRepository.findById(projectId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
  
    @GetMapping("/project")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Equipment登録
    @PostMapping("/equip")
    public Equipment saveEquip(@RequestBody Equipment equip) {
        return equipmentsRepository.save(equip);
    }

    // Report登録
    @PostMapping("/report")
    public Report saveReport(@RequestBody Report report) {
        return reportRepository.save(report);
    }

    // ReflectTag一覧取得
    @GetMapping("/reflectTag")
    public List<ReflectTag> getAllReflectTag() {
        return reflectTagRepository.findAll();
    }

    // ReflectTag登録
    @PostMapping("/addReflectTag")
    public ReflectTag saveReflectTag(@RequestBody ReflectTag reflectTag) {
        return reflectTagRepository.save(reflectTag);
    }
    //reflect tag id
    //get equip id
    @GetMapping("/reflect/{reflectTagId}")
    public ResponseEntity<ReflectTag> getreflectProject(@PathVariable Integer reflectTagId) {
        return reflectTagRepository.findById(reflectTagId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    // Reflect登録
    @PostMapping("/reflect")
    public Reflect addReflect(@RequestBody Reflect reflect) {
        return reflectRepository.save(reflect);
    }

    // Report取得
    @GetMapping("/report/{reportId}")
    public ResponseEntity<Report> getReport(@PathVariable Integer reportId) {
        return reportRepository.findById(reportId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Report更新
    @PutMapping("/report/{reportId}")
    public ResponseEntity<?> updateReport(@PathVariable Integer reportId, @RequestBody Report updatedReport) {
        Optional<Report> optionalReport = reportRepository.findById(reportId);
        if (optionalReport.isPresent()) {
            Report report = optionalReport.get();
            report.setProjectId(updatedReport.getProjectId());
            report.setProcessId(updatedReport.getProcessId());
            report.setCreatedAt(updatedReport.getCreatedAt());
            report.setComment(updatedReport.getComment());

            reportRepository.save(report);
            return ResponseEntity.ok(report);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Report not found");
        }
    }
    @GetMapping("/processes/{processId}")
    public ResponseEntity<com.example.demo.Entity.Process> getProcess(@PathVariable Integer processId) {
        return processRepository.findById(processId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/weekly-reports/createdAt")
    public ResponseEntity<?> getWeeklyReport(
            @RequestParam("createdAt") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAt,
            @RequestParam("processId") Integer processId) {

        return ResponseEntity.ok(
            reportRepository.findByProcessIdAndCreatedAt(processId, createdAt).orElse(null)
        );
    }
    
    @GetMapping("/reflect/createdAt")
    public ResponseEntity<?> getWeeklyReflect(
        @RequestParam("createdAt") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAt,
        @RequestParam("processId") Integer processId
    ) {
        List<Reflect> reflects = reflectRepository.findAllByProcessIdAndCreatedAt(processId, createdAt);

        // データがない場合でも200で空リストを返す
        return ResponseEntity.ok(reflects);
    }



}