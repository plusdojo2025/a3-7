package com.example.demo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class EquipmentController {

	@PostMapping("/equipment")
	public String registerEquipment(
	    @RequestParam("image") MultipartFile image,
	    @RequestParam("itemName") String itemName,
	    @RequestParam("quantity") String quantity,
	    @RequestParam("unit") String unit,
	    @RequestParam("expiryDate") String expiryDate,
	    @RequestParam("location") String location,
	    @RequestParam("alertTiming") String alertTiming,
	    @RequestParam("note") String note
	) {
	    System.out.println("備品名: " + itemName);
	    System.out.println("画像ファイル名: " + image.getOriginalFilename());
	    return "登録成功";
	}
	
	
	
	@PutMapping("/equipment/{id}")
	public String updateEquipment(
	    @PathVariable Long id,
	    @RequestParam(value = "image", required = false) MultipartFile image,
	    @RequestParam("itemName") String itemName,
	    @RequestParam("quantity") String quantity,
	    @RequestParam("unit") String unit,
	    @RequestParam("expiryDate") String expiryDate,
	    @RequestParam("location") String location,
	    @RequestParam("alertTiming") String alertTiming,
	    @RequestParam("note") String note
	) {
	    // 更新処理
	    return "更新成功";
	}
}
