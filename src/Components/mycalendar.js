import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Line } from "react-chartjs-2"; // Chart.js를 사용한 라인 차트
import "C:/Program Files/OSS-Project/react-calendar/src/Styles/mycalendar.css";

const MyCalendar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarKey, setCalendarKey] = useState(0);
  const [popupCalendarKey, setPopupCalendarKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [emotionRecords, setEmotionRecords] = useState([]);
  const [formattedSelectedDate, setFormattedSelectedDate] = useState("");
  const [emotionGraphData, setEmotionGraphData] = useState([]);

  const handleMusicRecommendation = () => {
    navigate("/recommendations");
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    setCalendarKey((prevKey) => prevKey + 1);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    setCalendarKey((prevKey) => prevKey + 1);
  };

  const handleDateClick = async (info) => {
    const dateStr = info.dateStr || info;
    setSelectedDate(dateStr);

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
        setEmotionGraphData(graphData.graph);
      } else {
        console.error("Failed to fetch emotion data");
      }
    } catch (error) {
      console.error("Error fetching emotion data:", error);
    }
  };

  // 감정에 따라 적절한 이모지를 반환하는 함수
const getSentimentEmoji = (emotion) => {
  switch (emotion.toLowerCase()) {
    case "happiness":
      return "😊"; // 기쁨
    case "sadness":
      return "😢"; // 슬픔
    case "anger":
      return "😡"; // 분노
    case "fear":
      return "😨"; // 두려움
    case "surprise":
      return "😲"; // 놀람
    case "disgust":
      return "🤢"; // 혐오감
    default:
      return "🤔"; // 기타 또는 알 수 없는 상태
  }
  };

  const chartData = {
    labels: emotionGraphData.map((point) => point.time),
    datasets: [
      {
        label: "Emotion Trends",
        data: emotionGraphData.map((point) => point.value),
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
    setPopupCalendarKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="calendar-container">
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

      {user && (
        <div className="top-bar">
          <img
            src={user.profilePicture || "https://via.placeholder.com/30"}
            alt="Profile"
            className="profile-img"
          />
          <span>{user.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}

      <FullCalendar
        key={calendarKey}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="800px"
        initialDate={currentDate}
        headerToolbar={false}
        dateClick={(info) => handleDateClick(info)}
      />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="popup-close-btn" onClick={closePopup}>
              ✕
            </button>

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

            <h2 className="popup-date">{formattedSelectedDate}</h2>

            <div className="popup-content">
              {emotionRecords.length > 0 ? (
                emotionRecords.map((record, index) => (
                  <div key={index} className="emotion-record">
                    {/* 이모지 */}
                    <span className="emotion-emoji">{getSentimentEmoji(record.sentiment)}</span>
                    {/* 제목 */}
                    <span className="emotion-title">{record.title || "나의 일기"}</span>
                    {/* 시간 */}
                    <span className="emotion-time">{record.time}</span>
                  </div>
                ))
              ) : (
                <p>No records available for this date</p>
              )}
            </div>

            <div className="popup-chart">
              {emotionGraphData.length > 0 ? (
                <Line data={chartData} />
              ) : (
                <p>No graph data available</p>
              )}
            </div>

            <div className="popup-content-recommend-button">
              <button
                className="recommend-button"
                onClick={handleMusicRecommendation}
              >
                음악 추천
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
