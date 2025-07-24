package com.example.demo.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.BiologyDetail;
import com.example.demo.Entity.EquipDetail;
import com.example.demo.Repository.BiologyDetailsRepository;
import com.example.demo.Repository.EquipDetailsRepository;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private EquipDetailsRepository equipDetailsRepository;
    
    @Autowired
    private BiologyDetailsRepository biologyDetailsRepository;

    /**
     * 備品画像の配信
     */
    @GetMapping("/equipment/{equipDetailId}")
    public ResponseEntity<byte[]> getEquipmentImage(@PathVariable Integer equipDetailId) {
        System.out.println("=== 画像取得リクエスト ===");
        System.out.println("equipDetailId: " + equipDetailId);
        
        try {
            Optional<EquipDetail> detailOpt = equipDetailsRepository.findById(equipDetailId);
            
            if (!detailOpt.isPresent()) {
                System.out.println("ERROR: EquipDetail が見つかりません: equipDetailId=" + equipDetailId);
                return ResponseEntity.notFound().build();
            }
            
            EquipDetail detail = detailOpt.get();
            System.out.println("EquipDetail取得成功");
            
            if (detail.getPicture() == null) {
                System.out.println("ERROR: 画像データがnull: equipDetailId=" + equipDetailId);
                return ResponseEntity.notFound().build();
            }
            
            byte[] imageData = detail.getPicture();
            System.out.println("画像データサイズ: " + imageData.length + " bytes");
            
            if (imageData.length == 0) {
                System.out.println("ERROR: 画像データサイズが0");
                return ResponseEntity.notFound().build();
            }
            
            HttpHeaders headers = new HttpHeaders();
            
            // 画像形式を自動判定
            if (imageData.length >= 4) {
                // PNGの場合
                if (imageData[0] == (byte)0x89 && imageData[1] == 0x50 && imageData[2] == 0x4E && imageData[3] == 0x47) {
                    headers.setContentType(MediaType.IMAGE_PNG);
                    System.out.println("画像形式: PNG");
                }
                // JPEGの場合
                else if (imageData[0] == (byte)0xFF && imageData[1] == (byte)0xD8) {
                    headers.setContentType(MediaType.IMAGE_JPEG);
                    System.out.println("画像形式: JPEG");
                }
                // GIFの場合
                else if (imageData[0] == 0x47 && imageData[1] == 0x49 && imageData[2] == 0x46) {
                    headers.setContentType(MediaType.IMAGE_GIF);
                    System.out.println("画像形式: GIF");
                }
                else {
                    headers.setContentType(MediaType.IMAGE_PNG); // PNGをデフォルトに
                    System.out.println("画像形式: 不明（デフォルトPNG）");
                }
            } else {
                headers.setContentType(MediaType.IMAGE_PNG);
                System.out.println("画像形式: データが小さすぎるためデフォルト");
            }
            
            headers.setContentLength(imageData.length);
            headers.setCacheControl("no-cache"); // キャッシュ無効化（デバッグ用）
            
            System.out.println("画像配信成功: " + imageData.length + " bytes");
            return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("画像取得エラー: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 生体画像の配信
     */
    @GetMapping("/biology/{biologyDetailId}")
    public ResponseEntity<byte[]> getBiologyImage(@PathVariable Integer biologyDetailId) {
        System.out.println("=== 生体画像取得リクエスト ===");
        System.out.println("biologyDetailId: " + biologyDetailId);
        
        Optional<BiologyDetail> detailOpt = biologyDetailsRepository.findById(biologyDetailId);
        
        if (!detailOpt.isPresent() || detailOpt.get().getPicture() == null) {
            System.out.println("生体画像が見つかりません");
            return ResponseEntity.notFound().build();
        }
        
        byte[] imageData = detailOpt.get().getPicture();
        System.out.println("生体画像データサイズ: " + imageData.length + " bytes");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // デフォルトでJPEG
        headers.setContentLength(imageData.length);
        
        return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
    }

    /**
     * テスト用エンドポイント
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("ImageController is working!");
    }
}