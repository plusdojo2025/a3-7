package com.example.demo.Controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Member;
import com.example.demo.Entity.Process;
import com.example.demo.Entity.Project;
import com.example.demo.Entity.ProjectReport;
import com.example.demo.Entity.ProjectTag;
import com.example.demo.Entity.Reflect;
import com.example.demo.Entity.ReflectTag;
import com.example.demo.Entity.User;
import com.example.demo.Repository.MembersRepository;
import com.example.demo.Repository.ProcessesRepository;
import com.example.demo.Repository.ProjectReportRepository;
import com.example.demo.Repository.ProjectTagsRepository;
import com.example.demo.Repository.ProjectsRepository;
import com.example.demo.Repository.ReflectTagsRepository;
import com.example.demo.Repository.ReflectsRepository;
import com.example.demo.Repository.ReportsRepository;
import com.example.demo.Repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class ProjectController {
	
	@Autowired
    private ProjectsRepository projectsRepository;
	@Autowired
	private ProjectReportRepository projectReportRepository;
	@Autowired
	private ProjectTagsRepository projectTagsRepository;
	@Autowired
	private MembersRepository membersRepository;
    @Autowired
    private ReportsRepository reportRepository;
    @Autowired
    private ReflectsRepository reflectRepository;
    @Autowired
    private ReflectTagsRepository reflectTagRepository;
    @Autowired
    private ProcessesRepository processRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReflectTagsRepository reflectTagsRepository;
	
    
    @GetMapping("/projects/")
    public List<Project> getMyPloject(HttpSession session) {
 
    	Object obj =session.getAttribute("user");
    	Integer userId = 0;
    	
    	if (obj instanceof User) {
    	    User user = (User) obj;
    	    userId = user.getUserId();
    	    System.out.println("userId = " + userId);
    	}
        List<Member> members = membersRepository.findAllByUserIdAndAttend(userId, 1);
    
        List<Project> myProjects = new ArrayList<>();
        for(Member m: members) {
        	Project myProject = projectsRepository.findByProjectId(m.getProjectId());
        	myProjects.add(myProject);
        }
        

        // completeで昇順にソート
        myProjects.sort(Comparator.comparingInt(Project::getComplete));
        
        return myProjects;
    
    }
    
    @PostMapping("/projects/add/")
    public void addProject(@RequestBody Project newProject, HttpSession session) {
    	Object obj =session.getAttribute("user");
    	Integer userId = 0;
    	
    	if (obj instanceof User) {
    	    User user = (User) obj;
    	    userId = user.getUserId();
    	}
    	else {
    	    throw new IllegalStateException("ユーザー情報が確認できませんでした");
    	}
    	
    	// 新しいプロジェクトに complete = 0 をセット
        if (newProject.getComplete() == null) {
            newProject.setComplete(0);
        }
    	System.out.println(newProject); 
    	System.out.println(userId); 
    	Project addedProject = projectsRepository.save(newProject);
    	
    	Integer addedProjectId = addedProject.getProjectId();
    	System.out.println("addedProjectId:"+addedProjectId);
    	Member member = new Member();
    	member.setProjectId(addedProjectId);
    	member.setUserId(userId);
    	member.setAuthority(2);
    	member.setAttend(1);
    	membersRepository.save(member);
    	return;
    }
    
    //projectTag
    @GetMapping("/projectTags/")
    public List<ProjectTag> getProjectTags(){
    	return projectTagsRepository.findAll();
    }
    
    //reflectTag
    @GetMapping("/reflectTags/")
    public List<ReflectTag> getRefrectTags(){
		return reflectTagsRepository.findAll();
    }
    //プロジェクトのパラメータを取得
    @GetMapping("/project/{projectId}/")
    public Project getProjectData(@PathVariable int projectId) {
    	System.out.println("done");
    	return projectsRepository.findByProjectId(projectId);
    }
    
    
    //プロジェクトの詳細画面表示
    @GetMapping("/projectDetails/{projectId}/")
    public List<com.example.demo.Entity.Process> getProjectDtails(@PathVariable int projectId){
    	return processRepository.findByProjectId(projectId);
    }
    
    //プロジェクトの詳細画面表示時の反省取得
    @GetMapping("/getReflects/{projectId}/")
    public List<Reflect> getReflects(@PathVariable int projectId){
    	return reflectRepository.findByProjectId(projectId);
    }
    
    //プロジェクトの終了報告書を追加し公開状態にする
    @PostMapping("/closePublicProject/{projectId}/")
    public void closeProject(@PathVariable int projectId, @RequestBody ProjectReport newProjectReport) {
    	projectReportRepository.save(newProjectReport);
    	Project project = projectsRepository.findByProjectId(projectId);
    	project.setComplete(1);
    	project.setPrivacy(1);
    	projectsRepository.save(project);
    	return;
    }
    
    //プロジェクトの終了報告書を追加し非公開状態にする
    @PostMapping("/closeUnpublishProject/{projectId}/")
    public void updateProject(@PathVariable int projectId, @RequestBody ProjectReport newProjectReport) {
    	projectReportRepository.save(newProjectReport);
    	Project project = projectsRepository.findByProjectId(projectId);
    	project.setComplete(1);
    	project.setPrivacy(0);
    	projectsRepository.save(project);
    	}
    
        
    //プロジェクトに工程を追加
    @PostMapping("/addProcess/{projectId}/")
    public void addProcess(@PathVariable int projectId, @RequestBody Process newProcess) {
    	processRepository.save(newProcess);
    	return;
    }
    
    //プロジェクト画面で反省の情報を一部表示
    @GetMapping("/reflectSummary/{projectId}/")
    public List<Reflect> getReflectSummary(@PathVariable int projectId){
    	List<Reflect> allList = reflectRepository.findByProjectId(projectId);
    	
    	if (allList.isEmpty()) {
            return new ArrayList<>();
        }

        // reflectTagIdごとに件数をカウント
        Map<Integer, Long> countMap = allList.stream()
            .collect(Collectors.groupingBy(Reflect::getReflectTagId, Collectors.counting()));

        // 件数が最大のreflectTagIdを取得
        long maxCount = Collections.max(countMap.values());
        List<Integer> maxTagIds = countMap.entrySet().stream()
            .filter(entry -> entry.getValue() == maxCount)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        // 最大数のreflectTagIdに一致するReflectだけ抽出
        List<Reflect> result = allList.stream()
            .filter(reflect -> maxTagIds.contains(reflect.getReflectTagId()))
            .collect(Collectors.toList());

        return result;
    }
    
    //IDを使ってプロセスの情報を取得
    @GetMapping("/process/{processId}/")
    public Process getProcess(@PathVariable int processId) {
    	return processRepository.findByProcessId(processId);
    }
    
    //プロセスを終了状態に
    @GetMapping("/endProcess/{processId}/")
    public void endProcess(@PathVariable int processId) {
    	Process target = processRepository.findByProcessId(processId);
    	target.setComplete(1);
    	processRepository.save(target);
    	return;
    }
   
	// メンバー招待（承認待ちで保存）
    @PostMapping("/members/invite")
    public ResponseEntity<String> inviteMember(@RequestBody Member member) {
        Integer userId = member.getUserId();
        Integer projectId = member.getProjectId();

        // 既に存在するか確認
        List<Member> existing = membersRepository.findAllByUserId(userId).stream()
            .filter(m -> m.getProjectId().equals(projectId))
            .toList();

        if (!existing.isEmpty()) {
            Member existingMember = existing.get(0);  // 1件でもあればチェック

            switch (existingMember.getAttend()) {
                case 0:
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("すでに招待済みです（承認待ち）");
                case 1:
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("このユーザーはすでにプロジェクトに参加しています");
                case 2:
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("以前招待をキャンセルされています");
                default:
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("不明な参加状態です");
            }
        }

        // 新規招待を登録
        member.setAttend(0); // 招待中（承認待ち）
        membersRepository.save(member);
        return ResponseEntity.ok("メンバーを招待しました");
    }

	// メンバー承認
	@PostMapping("/members/approve")
	public String approveMember(@RequestBody Member member) {
	    System.out.println("📩 承認リクエスト: userId=" + member.getUserId() + ", projectId=" + member.getProjectId());
	    
	    Member m = membersRepository.findByUserIdAndProjectId(member.getUserId(), member.getProjectId());

	    if (m != null) {
	        m.setAttend(1); // 承認済み

	        // 権限がまだ未設定の場合は閲覧（1）にする
	        if (m.getAuthority() == null || m.getAuthority() == 0) {
	            m.setAuthority(0); // 閲覧権限をデフォルトで付与
	        }

	        membersRepository.save(m);
	        return "参加承認しました";
	    } else {
	        System.err.println("❌ 該当メンバーが見つかりません");
	        throw new IllegalStateException("該当メンバーが見つかりません");
	    }
	}
	
	// ユーザー名付きの承認済みメンバーを取得
	@GetMapping("/members/approved")
	public List<Map<String, Object>> getApprovedMembers(@RequestParam Integer projectId) {
	    List<Member> approvedMembers = membersRepository.findByProjectIdAndAttend(projectId, 1);
	    List<Map<String, Object>> result = new ArrayList<>();

	    for (Member member : approvedMembers) {
	        Map<String, Object> map = new HashMap<>();
	        map.put("userId", member.getUserId());
	        map.put("projectId", member.getProjectId());
	        map.put("authority", member.getAuthority());
	        map.put("attend", member.getAttend());

	        // Userテーブルから名前取得
	        Optional<User> userOpt = userRepository.findById(member.getUserId());
	        map.put("userName", userOpt.map(User::getName).orElse("不明なユーザー"));

	        result.add(map);
	    }

	    return result;
	}
	// 承認待ちメンバーを取得（管理画面などで使用）
	@GetMapping("/members/pending")
	public List<Member> getPendingMembers(@RequestParam("userId") Integer userId) {
	    System.out.println("🧪 getPendingMembers called with userId=" + userId);
	    List<Member> list = membersRepository.findAllByUserIdAndAttend(userId, 0);
	    System.out.println("🧪 Found " + list.size() + " pending invites");
	    return list;
	}
	// 招待キャンセルなども必要なら
	@PostMapping("/members/cancel")
	public String cancelInvitation(@RequestBody Member member) {
	    Member m = membersRepository.findByUserIdAndProjectId(member.getUserId(), member.getProjectId());
	    if (m != null) {
	    	m.setAttend(2);	        
	    	membersRepository.save(m);
	        return "招待をキャンセルしました";
	    } else {
	        return "該当メンバーが見つかりません";
	    }
	}
	
	@GetMapping("/member/authority")
	public ResponseEntity<Integer> getMemberAuthority(@RequestParam Integer projectId, HttpSession session){
		Object obj = session.getAttribute("user");
		if(!(obj instanceof User)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		}
		
		User user =(User) obj;
		Member member = membersRepository.findByUserIdAndProjectId(user.getUserId(), projectId);
		
		if(member == null || member.getAttend()!=1) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
		}
		
		return ResponseEntity.ok(member.getAuthority());
	}
	
	@Transactional
	@PostMapping("/members/updateAuthority")
	public String updateMemberAuthority(@RequestBody Map<String, Object> payload, HttpSession session) {
	    System.out.println("\n🔧 [updateAuthority] 受信した payload: " + payload);

	    Object obj = session.getAttribute("user");
	    if (!(obj instanceof User)) {
	        System.out.println("⚠️ セッションにユーザー情報が存在しません");
	        return "ログイン情報が見つかりません";
	    }

	    Integer userId = (Integer) payload.get("userId");
	    Integer projectId = (Integer) payload.get("projectId");
	    Integer authority = (Integer) payload.get("authority");

	    System.out.println("🧩 対象メンバー userId: " + userId);
	    System.out.println("🧩 対象プロジェクト projectId: " + projectId);
	    System.out.println("🧩 設定する authority: " + authority);

	    User currentUser = (User) obj;
	    System.out.println("👤 操作ユーザー: userId = " + currentUser.getUserId());

	    Member operator = membersRepository.findByUserIdAndProjectId(currentUser.getUserId(), projectId);

	    if (operator == null) {
	        System.out.println("❌ 操作ユーザーがプロジェクトメンバーではありません");
	        return "操作ユーザーがプロジェクトメンバーではありません";
	    }

	    System.out.println("✅ 操作ユーザーの権限: " + operator.getAuthority());

	    if (operator.getAuthority() != 2) {
	        System.out.println("❌ 操作ユーザーに管理権限がありません");
	        return "権限がありません";
	    }

	    Member target = membersRepository.findByUserIdAndProjectId(userId, projectId);

	    if (target == null) {
	        System.out.println("❌ 権限変更対象のメンバーが見つかりません");
	        return "対象メンバーが見つかりません";
	    }

	    if (target.getAttend() != 1) {
	        System.out.println("❌ 対象メンバーは未承認です（attend=" + target.getAttend() + "）");
	        return "対象メンバーは未承認です";
	    }

	    try {
	        System.out.println("🔄 JPQL による updateAuthority を実行します...");
	        membersRepository.updateAuthority(projectId, userId, authority);
	        System.out.println("✅ JPQL による authority 更新成功");
	    } catch (Exception e) {
	        System.err.println("⚠️ JPQL updateAuthority に失敗: " + e.getMessage());
	        System.out.println("💡 save によるフォールバックを実行します");

	        target.setAuthority(authority);
	        membersRepository.save(target);

	        System.out.println("✅ save による authority 更新成功");
	    }

	    System.out.println("🎉 権限更新処理が完了しました");
	    return "権限を更新しました";
	}



}
