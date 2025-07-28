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
import com.example.demo.Repository.BiologyDetailsRepository;
import com.example.demo.Repository.EquipDetailsRepository;
import com.example.demo.Repository.EquipmentsRepository;


@RestController
@RequestMapping("/api/equip")
public class EquipSearchController {

    @Autowired
    private EquipmentsRepository equipmentsRepo;

    @Autowired
    private EquipDetailsRepository detailsRepo;
    
    @Autowired
    private BiologyDetailsRepository biologyDetailsRepo;

    @GetMapping("/search")
    public List<EquipmentSearchResponse> searchEquipments(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "projectId", required = false) Integer projectId) {
        
        List<Equipment> list;
        
        // projectId が指定されている場合のフィルタリングロジック
        if (projectId != null) {
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
            response.equipDetailId = equipment.getEquipDetailId(); // 追加
            response.equipKindId = equipment.getEquipKindId(); // 追加
            
            // 備品種類によって画像URLを設定
            if (equipment.getEquipDetailId() != null) {
                if (equipment.getEquipKindId() != null && equipment.getEquipKindId() == 2) {
                    // 生物の場合
                    response.type = "生物";
                    biologyDetailsRepo.findById(equipment.getEquipDetailId()).ifPresent(bio -> {
                        if (bio.getPicture() != null && bio.getPicture().length > 0) {
                            response.imageUrl = "/api/images/biology/" + bio.getBiologyDetailId();
                        }
                    });
                } else {
                    // 備品の場合
                    response.type = "備品";
                    detailsRepo.findById(equipment.getEquipDetailId()).ifPresent(detail -> {
                        if (detail.getPicture() != null && detail.getPicture().length > 0) {
                            response.imageUrl = "/api/images/equipment/" + detail.getEquipDetailId();
                        }
                    });
                }
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
    public List<Equipment> getEquipmentsByProjectAndKind(@PathVariable int projectId, @PathVariable int equipKindId){
    	List<Equipment> equipments = equipmentsRepo.findByEquipKindIdAndProjectId(equipKindId, projectId);
    	
    	// 生物の場合、画像URLを設定（この部分は画像を含めたい場合のみ）
    	if (equipKindId == 2) {
    	    equipments.forEach(equip -> {
    	        if (equip.getEquipDetailId() != null) {
    	            biologyDetailsRepo.findById(equip.getEquipDetailId()).ifPresent(bio -> {
    	                if (bio.getPicture() != null && bio.getPicture().length > 0) {
    	                    // Transientフィールドを使用する場合
    	                    equip.setImage("/api/images/biology/" + bio.getBiologyDetailId());
    	                }
    	            });
    	        }
    	    });
    	}
    	
    	return equipments;
    }

    /** レスポンス用DTOクラス */
    public static class EquipmentSearchResponse {
        public Integer equipId;
        public String equipName;
        public String type;
        public String imageUrl;
        public Integer equipDetailId; // 追加
        public Integer equipKindId; // 追加
    }
}