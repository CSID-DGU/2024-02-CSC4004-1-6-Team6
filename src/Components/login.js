import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // useNavigate import
import "../Styles/login.css"; // CSS 파일 import

const LoginPopup = ({ onLogin }) => { // onLogin 콜백 추가
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(true); // 팝업 표시 여부 상태
    const navigate = useNavigate(); // navigate 훅 사용

    // 로그인 API 호출
    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`로그인 성공: ${result.message}`);
                
                // onLogin 콜백 호출 및 사용자 정보 전달
                onLogin({
                    username: result.username, // 서버에서 반환된 사용자 이름
                    profilePicture: result.profilePicture || "https://via.placeholder.com/40", // 프로필 이미지
                });

                navigate("/calendar");
            } else {
                const error = await response.json();
                alert(`로그인 실패: ${error.message}`);
            }
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            alert("로그인 요청 중 오류가 발생했습니다.");
        }
    };

    // 팝업 닫기 핸들러
    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    if (!isPopupVisible) {
        return null; // 팝업이 숨겨지면 아무것도 렌더링하지 않음
    }

    return (
        <div className="background">
            <div className="login-popup">
                {/* 닫기 버튼 */}
                <button className="close-button" onClick={handleClosePopup}>
                    <img 
                        src="/login/close-icon.png" 
                        alt="닫기" 
                        className="close-icon"
                    />
                </button>

                {/* 프로필 아이콘 */}
                <div className="profile-icon">
                    <img
                        src="/login/profile-image.png"
                        alt="프로필 이미지"
                        className="profile-image"
                    />
                </div>
                
                {/* 아이디와 비밀번호 입력 */}
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <img
                            src="/login/image-icon.png"
                            alt="아이디"
                            className="input-icon"
                        />
                        <input
                            type="username"
                            placeholder="아이디"
                            className="input-field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <img
                            src="/login/password-icon.png"
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
                    <p>아직 계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;

