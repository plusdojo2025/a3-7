package com.example.demo;

import java.util.Collections;

import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.servlet.SessionTrackingMode;

@Configuration
public class SpringConfig {
	@Bean
	protected ServletContextInitializer servletContextInitializer() {
		ServletContextInitializer initializer = servletContext -> {
			//セッションをクッキーのみで管理するよう変更する。
			//これを行わないと、標準ではURLにjsessionidというキーでセッション情報を載せてしまう。
			servletContext.setSessionTrackingModes(Collections.singleton(SessionTrackingMode.COOKIE));
		};
		return initializer;
	}
}
