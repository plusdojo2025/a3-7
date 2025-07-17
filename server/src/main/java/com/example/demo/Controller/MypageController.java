package com.example.demo.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;

import jakarta.servlet.http.HttpSession;


@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MypageController {
	
    @Autowired
    private UserRepository userRepository;

	@GetMapping("/getLoginUser")
	public User getLoginUser(HttpSession session) {
	    User loginUser = (User) session.getAttribute("user");

	    if (loginUser != null) {
	        return new User(
	            loginUser.getUserId(),
	            loginUser.getEmail(),
	            "********",
	            loginUser.getCompanyCode(),
	            loginUser.getName()
	        );
	    } else {
	        return null;
	    }
	}
	
	@PostMapping("/mypage/update/")
	public boolean updateUser(@RequestBody Map<String, String> payload, HttpSession session) {
	    User loginUser = (User) session.getAttribute("user");
	    if (loginUser == null) return false;

	    String name = payload.get("name");
	    String password = payload.get("password");
	    String newPassword = payload.get("newPassword");

	    if (!loginUser.getPassword().equals(password)) {
	        return false; // パスワード不一致
	    }

	    // 更新処理
	    loginUser.setName(name);
	    loginUser.setPassword(newPassword);
	    // 保存処理
	    userRepository.save(loginUser);
	    return true;
	}

}
