package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;

@RestController
public class UsersController {
	// SpringがUserRepositoryを自動で注入
	@Autowired
    private UserRepository userRepository;

	// 全ユーザーを取得する
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 新規ユーザーを作成する
    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
    	// 受け取ったユーザー情報を保存して返す
        return userRepository.save(user);
    }
}
