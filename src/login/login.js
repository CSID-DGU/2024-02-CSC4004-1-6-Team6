import React, { useState } from "react";
import './login.css'; // CSS 파일 import

const LoginPopup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 로그인 API 호출
    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지

        try {
            const response = await fetch("/api/crud/user-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`로그인 성공: ${result.message}`);
            } else {
                const error = await response.json();
                alert(`로그인 실패: ${error.message}`);
            }
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            alert("로그인 요청 중 오류가 발생했습니다.");
        }
    };

    // Google 로그인 API 호출
    const handleGoogleLogin = async () => {
        try {
            const response = await fetch("/api/oauth/google-login", {
                method: "GET",
                credentials: "include", // 쿠키 포함
            });

            if (response.ok) {
                const result = await response.json();
                alert("Google 로그인 성공!");
            } else {
                alert("Google 로그인 실패.");
            }
        } catch (error) {
            console.error("Google 로그인 중 오류 발생:", error);
            alert("Google 로그인 요청 중 오류가 발생했습니다.");
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
                <form className="login-form" onSubmit={handleLogin}>
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
                            required
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
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">로그인</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;
