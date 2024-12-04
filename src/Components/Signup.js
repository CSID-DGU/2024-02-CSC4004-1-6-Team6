import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동
import "../Styles/Signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
    });

    const navigate = useNavigate();

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 회원가입 API 호출
    const handleSignup = async (e) => {
        e.preventDefault();
        const { username, password, email, firstName, lastName, phoneNumber } = formData;

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber,
                }),
            });

            if (response.ok) {
                alert("회원가입 성공! 로그인 화면으로 이동합니다.");
                setFormData({ username: "", password: "", email: "", firstName: "", lastName: "", phoneNumber: "" }); // 입력값 초기화
                navigate("/"); // 로그인 화면으로 이동
            } else {
                const error = await response.json();
                alert(`회원가입 실패: ${error.message}`);
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error);
            alert("회원가입 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="background">
            <div className="login-popup">
                <h2 className="form-title">회원가입</h2>
                <form className="login-form" onSubmit={handleSignup}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="아이디"
                            className="input-field"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="성"
                            className="input-field"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="이름"
                            className="input-field"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="핸드폰 번호"
                            className="input-field"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="login-button">회원가입</button>
                </form>
                <p className="separator">
                    이미 계정이 있으신가요? <a href="/">로그인</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;