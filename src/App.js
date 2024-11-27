import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyCalendar from "./Components/mycalendar";
import MusicRecommendation from "./Components/MusicRecommendation";

function App() {
  // 사용자 정보 상태
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // API 호출로 사용자 정보를 가져오는 함수
  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/mysql/get-data/id`); // 유저 ID API 호출
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser({
        profilePicture: data.profilePicture || "https://via.placeholder.com/40",
        name: data.name || "Unknown User",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false); // 로딩 완료
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    console.log("Logout clicked!");
    setUser(null);
  };

  // 컴포넌트 마운트 시 사용자 데이터 로드
  useEffect(() => {
    fetchUser();
  }, []);

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
        {isLoading ? (
          <p style={{ color: "#FFF", textAlign: "center" }}>Loading...</p>
        ) : user ? (
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
                src={user.profilePicture}
                alt="User Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
              />
              <span style={{ color: "white" }}>{user.name}</span>
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

            {/* 라우팅 설정 */}
            <Routes>
              <Route
                path="/calendar"
                element={<MyCalendar onLogout={handleLogout} />}
              />
              <Route path="/recommendations" element={<MusicRecommendation />} />
            </Routes>
          </div>
        ) : (
          <p style={{ color: "#FFF", textAlign: "center" }}>
            No user data available. Please login again.
          </p>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
