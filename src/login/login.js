import React, { useState } from "react";
import './login.css'; // CSS 파일 import

const LoginPopup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Google 로그인 처리 함수
    const handleGoogleLogin = async () => {
        try {
            const response = await fetch("/api/auth/google", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                alert("Google 로그인 성공: " + JSON.stringify(data));
            } else {
                throw new Error("Google 로그인 실패");
            }
        } catch (error) {
            console.error(error);
            alert("Google 로그인 중 오류가 발생했습니다.");
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                alert("로그인 성공: " + JSON.stringify(data));
            } else {
                const error = await response.json();
                alert("로그인 실패: " + error.message);
            }
        } catch (error) {
            console.error(error);
            alert("로그인 중 오류가 발생했습니다.");
        }
    };

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
                <button className="google-login" onClick={handleGoogleLogin}>
                    <img
                        src="google-icon.png"
                        alt="Google"
                        className="google-icon"
                    />
                    구글 로그인
                </button>
                <p className="separator">또는</p>
                {/* 이메일과 비밀번호 입력 */}
                <form className="login-form" onSubmit={handleEmailLogin}>
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">로그인</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;
