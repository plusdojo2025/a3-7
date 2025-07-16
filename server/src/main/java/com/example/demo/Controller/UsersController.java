package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
public class UsersController {
	// SpringがUserRepositoryを自動で注入
	@Autowired
    private UserRepository userRepository;

	// 全ユーザーを取得する(Test用)
    @GetMapping("/users/")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    //ログイン処理
    @PostMapping("/login/")
    public Boolean login(@RequestBody User user, HttpSession session) {
    	boolean result = false;
    	User searchResult = userRepository.findByEmailAndPassword(user.getEmail(), user.getPassword());
    	
    	if(searchResult != null) {
    		System.out.println("検索成功: " + searchResult);
    		//ログイン状態の管理
    		session.setAttribute("user", searchResult);
    		result = true;
    	}
    	
    	return result;
    }

    // 新規ユーザーを作成する
    @PostMapping("/signup/")
    public Boolean createUser(@RequestBody User user) {
    	boolean result = false;
    	
    	//重複確認
    	User duplication = userRepository.findByEmail(user.getEmail());
    	if(duplication == null) {
    		//追加成功
    		User addUser = userRepository.save(user);
    		System.out.println("登録成功: " + addUser);
    		result = true;
    	}
    	
    	return result;
    }
    
    //ログイン状態の確認
    @GetMapping("/checkLogin/")
    public Boolean checkLogin(HttpSession session) {
    	 Object user = session.getAttribute("user");    	 
    	 return (user != null);
    }
    
    //ログアウト処理
    @PostMapping("/logout/")
    public void logout(HttpSession session) {
    	 session.invalidate();
    	 return;
    }
}
