package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Process;
import com.example.demo.Entity.Project;
import com.example.demo.Entity.ProjectReport;
import com.example.demo.Entity.Reflect;
import com.example.demo.Entity.Report;
import com.example.demo.Repository.ProcessesRepository;
import com.example.demo.Repository.ProjectReportRepository;
import com.example.demo.Repository.ProjectsRepository;
import com.example.demo.Repository.ReflectsRepository;
import com.example.demo.Repository.ReportsRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ViewProjectController {
	
	@Autowired
	private ProjectsRepository projectsRepository;
	
	@Autowired
	private ProjectReportRepository projectReportRepository;
	
	@Autowired
	private ProcessesRepository processesRepository;
	
	@Autowired
	private ReportsRepository reportRepository;
	
	@Autowired
	private ReflectsRepository reflectsRepository;
	
	
	//プロジェクト詳細取得
	@GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer projectId) {
        return projectsRepository.findById(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
	
	//工程一覧取得
	@GetMapping("/{projectId}/process")
	public List<Process> getProcessByProjectId(@PathVariable Integer projectId) {
		return processesRepository.findByProjectId(projectId);
	}
	
	//報告書取得
	@GetMapping("/{projectId}/project-report")
	public List<ProjectReport> getProjectReportByProjectId(@PathVariable Integer projectId) {
		return projectReportRepository.findByProjectId(projectId);
	}
	
	//日報取得
	@GetMapping("/process/{processId}/report")
	public List<Report> getReportByProcessId(@PathVariable Integer processId) {
		return reportRepository.findByProcessId(processId);
	}
	
	//反省取得
	@GetMapping("/process/{processId}/reflect")
	public List<Reflect> getReflectByProcessId(@PathVariable Integer processId) {
		return reflectsRepository.findByProcessId(processId);
	}


}