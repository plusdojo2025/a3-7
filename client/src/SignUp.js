import React from "react";
import axios from "axios";

export default class SignUp extends React.Component{

    render(){
        return( 
            <div className="SignUpForm">
                <form onSubmit={this.handleSignUp}>
                    <div>ここは新規登録画面です</div>
                </form>
            </div>
        )
    };
} 