import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/login";
import MyCalendar from "./Components/mycalendar";
import MusicRecommendation from "./Components/MusicRecommendation";
import EmotionGraph from "./Components/EmotionGraph";
import EmotionManagement from "./Components/EmotionManagement";
import Write from "./Components/write";
import EditDelete from "./Components/edit_delete";
import Signup from "./Components/Signup";

function App() {
  const [user, setUser] = useState(null); // 사용자 정보 저장

  // 로그인 성공 시 사용자 정보를 설정하는 함수
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // 로그아웃 시 사용자 정보를 초기화하는 함수
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 및 회원가입 화면 */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/calendar" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />

        {/* 인증된 사용자만 접근 가능한 경로 */}
        {user ? (
          <>
            <Route
              path="/calendar"
              element={<MyCalendar user={user} onLogout={handleLogout} />}
            />
            <Route
              path="/recommendations"
              element={<MusicRecommendation user={user} />}
            />
            <Route
              path="/emotion-graph"
              element={<EmotionGraph />}
            />
            <Route
              path="/emotion-management"
              element={<EmotionManagement />}
            />
            <Route path="/write" element={<Write user={user} />} />
            <Route path="/edit-delete" element={<EditDelete user={user} />} />
          </>
        ) : (
          // 인증되지 않은 사용자가 접근하면 로그인 화면으로 리다이렉트
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
