import React from "react";
import './index.css'; // CSS 파일 import

const LoginPopup = () => {
    return (
        <div className="background">
            <div className="login-popup">
                {/* 프로필 아이콘 */}
                <div className="profile-icon">
                    <img
                        src="profile-image.png"
                        alt="프로필 이미지"
                        className="profile-image"
                    />
                </div>
                {/* Google 로그인 버튼 */}
                <button className="google-login">
                    <img
                        src="google-icon.png"
                        alt="Google"
                        className="google-icon"
                    />
                    구글 로그인
                </button>
                <p className="separator">또는</p>
                {/* 이메일과 비밀번호 입력 */}
                <form className="login-form">
                    <div className="input-group">
                        <img
                            src="email-icon.png"
                            alt="이메일"
                            className="input-icon"
                        />
                        <input
                            type="email"
                            placeholder="이메일"
                            className="input-field"
                        />
                    </div>
                    <div className="input-group">
                        <img
                            src="password-icon.png"
                            alt="비밀번호"
                            className="input-icon"
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="login-button">로그인</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;
