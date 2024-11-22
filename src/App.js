import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyCalendar from "./mycalendar";

function App() {
  // 더미 사용자 정보로 상태 초기화
  const [user, setUser] = useState({
    profilePicture: "https://via.placeholder.com/40",
    name: "Dummy User",
  });

  // 로그아웃 핸들러
  const handleLogout = () => {
    console.log("Logout clicked!");
    setUser(null); // 사용자 상태 초기화
  };

  return (
    <BrowserRouter>
      <div
        style={{
          backgroundColor: "#676D63",
          height: "100vh",
          margin: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {user ? (
          <div style={{ position: "relative", width: "100%", maxWidth: "1200px" }}>
            {/* 사용자 정보 및 로그아웃 버튼 */}
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 20,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={user.profilePicture} // 더미 프로필 사진
                alt="User Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
              />
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: "#676D63",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>

            {/* 캘린더 컴포넌트 */}
            <MyCalendar onLogout={handleLogout} />
          </div>
        ) : (
          <p style={{ color: "#FFF", textAlign: "center" }}>Loading...</p>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
