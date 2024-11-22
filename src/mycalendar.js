import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Line } from "react-chartjs-2"; // Chart.js를 사용한 라인 차트
import "C:/Program Files/OSS-Project/react-calendar/src/mycalendar.css";

const MyCalendar = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [currentDate, setCurrentDate] = useState(new Date()); // 오늘 날짜 기준으로 초기화
  const [calendarKey, setCalendarKey] = useState(0); // 캘린더 강제 리렌더링
  const [popupCalendarKey, setPopupCalendarKey] = useState(0); // 팝업 캘린더 강제 리렌더링
  const [user, setUser] = useState(null); // 사용자 정보를 저장
  const [selectedDate, setSelectedDate] = useState(null); // 날짜 상태 추가
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 추가
  const [emotionRecords, setEmotionRecords] = useState([]); // 감정 분석 기록
  const [formattedSelectedDate, setFormattedSelectedDate] = useState(""); // 날짜 텍스트 저장
  const [emotionGraphData, setEmotionGraphData] = useState([]); // 감정 그래프 데이터 상태

  // 사용자 정보 로드
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          navigate("/login"); // 인증되지 않은 경우 로그인 페이지로 이동
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        navigate("/login");
      }
    }
    fetchUserInfo();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null); // 사용자 상태 초기화
        navigate("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    setCalendarKey((prevKey) => prevKey + 1); // key 변경으로 강제 리렌더링
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    setCalendarKey((prevKey) => prevKey + 1); // key 변경으로 강제 리렌더링
  };

  const handleDateClick = async (info) => {
    const dateStr = info.dateStr || info;
    setSelectedDate(dateStr);

    // 날짜 형식 변경: November 6th
    const dateObj = new Date(dateStr);
    const options = { month: "long", day: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    const daySuffix = ["th", "st", "nd", "rd"][
      (dateObj.getDate() % 10 > 3 || [11, 12, 13].includes(dateObj.getDate()))
        ? 0
        : dateObj.getDate() % 10
    ];
    setFormattedSelectedDate(`${formattedDate}${daySuffix}`);

    setShowPopup(true);

    // 감정 기록과 그래프 데이터 API 요청
    try {
      const [recordsResponse, graphResponse] = await Promise.all([
        fetch(`/api/emotions?date=${dateStr}`),
        fetch(`/api/emotions/graph?date=${dateStr}`),
      ]);

      if (recordsResponse.ok && graphResponse.ok) {
        const recordsData = await recordsResponse.json();
        const graphData = await graphResponse.json();

        setEmotionRecords(recordsData.records);
        setEmotionGraphData(graphData.graph); // 감정 그래프 데이터 저장
      } else {
        console.error("Failed to fetch emotion data");
      }
    } catch (error) {
      console.error("Error fetching emotion data:", error);
    }
  };

   // 차트 데이터 설정
   const chartData = {
    labels: emotionGraphData.map((point) => point.time), // 시간 레이블
    datasets: [
      {
        label: "감정 변화",
        data: emotionGraphData.map((point) => point.value), // 감정 값
        fill: false,
        borderColor: "#4A90E2",
        tension: 0.1,
      },
    ],
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setEmotionRecords([]);
  };

  const handlePopupArrowClick = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    setSelectedDate(newDate.toISOString().split("T")[0]);
    setPopupCalendarKey((prevKey) => prevKey + 1); // 캘린더 강제 리렌더링
  };

  return (
    <div className="calendar-container">
      {/* 네비게이션 */}
      <div className="nav-container">
        <button className="prev-btn" onClick={handlePrev}>
          &lt;
        </button>
        <h2 className="month-label">
          {currentDate.toLocaleString("en-US", { month: "long" })}
        </h2>
        <button className="next-btn" onClick={handleNext}>
          &gt;
        </button>
      </div>

      {/* 상단 바 */}
      {user && (
        <div className="top-bar">
          <img
            src={user.profilePicture || "https://via.placeholder.com/30"}
            alt="Profile"
            className="profile-img"
          />
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* FullCalendar */}
      <FullCalendar
        key={calendarKey}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="800px"
        initialDate={currentDate}
        headerToolbar={false}
        dateClick={(info) => handleDateClick(info)}
      />

      {/* 팝업 */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            {/* 닫기 버튼 */}
            <button className="popup-close-btn" onClick={closePopup}>
              ✕
            </button>

            {/* 미니 캘린더 */}
            <div className="popup-mini-calendar">
              <button
                className="popup-arrow popup-arrow-left"
                onClick={() => handlePopupArrowClick("prev")}
              >
                &lt;
              </button>
              <FullCalendar
                key={popupCalendarKey}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridWeek"
                initialDate={selectedDate}
                headerToolbar={false}
                height="auto"
                contentHeight="120px"
                selectable={true}
                dateClick={(info) => handleDateClick(info.dateStr)}
              />
              <button
                className="popup-arrow popup-arrow-right"
                onClick={() => handlePopupArrowClick("next")}
              >
                &gt;
              </button>
            </div>

            {/* 날짜 텍스트 */}
            <h2 className="popup-date">{formattedSelectedDate}</h2>

            {/* 감정 분석 기록 */}
            <div className="popup-content">
              {emotionRecords.length > 0 ? (
                emotionRecords.map((record, index) => (
                  <p key={index}>
                    <span style={{ color: record.color }}>●</span> {record.text}{" "}
                    ...... {record.time}
                  </p>
                ))
              ) : (
                <p>No records available for this date</p>
              )}
            </div>
            {/*감정 그래프*/}
            <div className="popup-chart">
              {emotionGraphData.length > 0 ?(
                <Line data = {chartData} />
              ) : (
                <p>No graph data available</p>
              )}
            </div>

            {/* 컨텐츠 추천 버튼*/}
            <div className="popup-content-recommend-button">
              <button
                className="recommend-button"
                onClick={() => console.log("Content Recommendation Clicked")}
              >
              컨텐츠 추천
               </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default MyCalendar;