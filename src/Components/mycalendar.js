import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Line } from "react-chartjs-2";
import "C:/Program Files/OSS-Project/react-calendar/src/Styles/mycalendar.css";

const MyCalendar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [emotionRecords, setEmotionRecords] = useState([]);
  const [formattedSelectedDate, setFormattedSelectedDate] = useState("");

  // 감정 데이터를 가져와 달력 이벤트로 변환
  useEffect(() => {
    async function fetchEmotionData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/emotions/");
        if (response.ok) {
          const data = await response.json(); // [{ date: "YYYY-MM-DD", emotion: "happiness" }]
          const events = data.map((item) => ({
            title: getSentimentEmoji(item.emotion),
            start: item.date,
          }));
          setCalendarEvents(events);
        } else {
          console.error("Failed to fetch emotion data");
        }
      } catch (error) {
        console.error("Error fetching emotion data:", error);
      }
    }

    fetchEmotionData();
  }, []);

  // 날짜 클릭 시 데이터 가져오기
  const handleDateClick = async (info) => {
    const dateStr = info.dateStr || info;
    setSelectedDate(dateStr);

    const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    setFormattedSelectedDate(formattedDate);

    setShowPopup(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/emotions/?date=${dateStr}`
      );
      if (response.ok) {
        const data = await response.json(); // { records: [{ sentiment: "...", ... }] }
        setEmotionRecords(data.records);
      } else {
        console.error("Failed to fetch emotion data for the selected date");
      }
    } catch (error) {
      console.error("Error fetching emotion data:", error);
    }
  };

  // 감정 데이터를 기반으로 그래프 데이터 생성
  const generateGraphData = () => {
    const emotionCount = emotionRecords.reduce((acc, record) => {
      const emotion = record.sentiment.toLowerCase();
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(emotionCount).map((emotion) => ({
      emotion,
      count: emotionCount[emotion],
    }));
  };

  const getSentimentEmoji = (emotion) => {
    const emotionMap = {
      happiness: "😊",
      sadness: "😢",
      anger: "😡",
      fear: "😨",
      surprise: "😲",
      disgust: "🤢",
      unknown: "🤔", // 알 수 없는 감정
    };

    return emotionMap[emotion.toLowerCase()] || emotionMap["unknown"];
  };

  const chartData = {
    labels: generateGraphData().map((point) => point.emotion),
    datasets: [
      {
        label: "Emotion Distribution",
        data: generateGraphData().map((point) => point.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setEmotionRecords([]);
  };

  return (
    <div className="calendar-container">
      <div className="nav-container">
        <button className="prev-btn" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
          &lt;
        </button>
        <h2 className="month-label">
          {currentDate.toLocaleDateString("en-US", { month: "long" })}
        </h2>
        <button className="next-btn" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
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
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="800px"
        events={calendarEvents}
        dateClick={(info) => handleDateClick(info)}
      />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="popup-close-btn" onClick={closePopup}>
              ✕
            </button>
            <h2 className="popup-date">{formattedSelectedDate}</h2>
            <div className="popup-content">
              {emotionRecords.length > 0 ? (
                emotionRecords.map((record, index) => (
                  <div key={index} className="emotion-record">
                    <span className="emotion-emoji">
                      {getSentimentEmoji(record.sentiment)}
                    </span>
                    <span>{record.title || "No title available"}</span>
                  </div>
                ))
              ) : (
                <p>No emotion records available</p>
              )}
            </div>
            <div className="popup-chart">
              {generateGraphData().length > 0 ? (
                <Line data={chartData} />
              ) : (
                <p>No graph data available</p>
              )}
            </div>
            <div className="popup-actions">
              <button
                className="recommend-button"
                onClick={() => navigate("/recommendations")}
              >
                음악 추천
              </button>
              <button
                className="diary-button"
                onClick={() =>
                  navigate("/diary", { state: { date: selectedDate } })
                }
              >
                일기 작성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;