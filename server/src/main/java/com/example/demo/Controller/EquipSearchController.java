package com.example.demo.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.EquipDetail;
import com.example.demo.Entity.Equipment;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;


@RestController
@RequestMapping("/api/equip")
public class EquipSearchController {

    @Autowired
    private EquipmentsRepository equipmentsRepo;

    @Autowired
    private EquipDetailsRepository detailsRepo;

    @GetMapping("/search")
    public List<EquipmentSearchResponse> searchEquipments(
            @RequestParam(name = "keyword", required = false) String keyword, // keywordをオプションに
            @RequestParam(name = "projectId", required = false) Integer projectId) { // projectIdをオプションで追加
        
        List<Equipment> list;
        
        // projectId が指定されている場合のフィルタリングロジック
        if (projectId != null) {
            // Equipmentエンティティに直接projectIdフィールドが存在する場合の処理
            if (keyword != null && !keyword.trim().isEmpty()) {
                // projectIdとkeywordの両方で検索
                list = equipmentsRepo.findByProjectIdAndEquipNameContaining(projectId, keyword);
            } else {
                // projectIdのみで検索（キーワードなし）
                list = equipmentsRepo.findByProjectId(projectId);
            }
        } else {
            // 全件またはキーワード検索
            if (keyword == null || keyword.trim().isEmpty()) {
                // キーワードが空の場合は全件取得
                list = equipmentsRepo.findAll();
            } else {
                // キーワード検索（projectIdなし）
                list = equipmentsRepo.findByEquipNameContaining(keyword);
            }
        }

        // 検索結果をレスポンス用DTOにマッピング
        return list.stream().map(equipment -> {
            EquipmentSearchResponse response = new EquipmentSearchResponse();
            response.equipId = equipment.getEquipId();
            response.equipName = equipment.getEquipName();
            response.type = "equip";
            
            // 画像URLを設定（画像が存在する場合のみ）
            if (equipment.getEquipDetailId() != null) {
                detailsRepo.findById(equipment.getEquipDetailId()).ifPresent(detail -> {
                    if (detail.getPicture() != null && detail.getPicture().length > 0) {
                        response.imageUrl = "/api/images/equipment/" + detail.getEquipDetailId();
                    }
                });
            }
            
            return response;
        }).collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<EquipmentSearchResponse> getAllEquipments() {

        return searchEquipments(null, null); 
    }
    
    @GetMapping("/alert/detail/")
    public List<EquipDetail> getAlertEquipmentsDetail(){
    	return detailsRepo.findByJudgeGreaterThanEqualRemainingOrLimitedBeforeToday();
    }
    
    @GetMapping("/{projectId}/{equipKindId}/")
    public List<Equipment> getAlertEquipments( @PathVariable int projectId, @PathVariable int equipKindId){
    	return equipmentsRepo.findByEquipKindIdAndProjectId(equipKindId, projectId);
    }

    /** レスポンス用DTOクラス */
    public static class EquipmentSearchResponse {
        public Integer equipId;
        public String equipName;
        public String type;
        public String imageUrl; // 画像URLを保持するフィールド
    }

}
    


