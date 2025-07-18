package com.example.demo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 全てのエンドポイントに適用
                .allowedOrigins("http://localhost:3000") // Reactアプリのオリジン
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 必要なHTTPメソッドを許可
                .allowedHeaders("*") // 全ヘッダー許可
                .allowCredentials(true); // Cookie送信などを許可（必要なら）
    }
}
