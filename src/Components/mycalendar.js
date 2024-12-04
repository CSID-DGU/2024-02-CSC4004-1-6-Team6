import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Line } from "react-chartjs-2";
import "../Styles/mycalendar.css";

const MyCalendar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarKey, setCalendarKey] = useState(0);
  const [popupCalendarKey, setPopupCalendarKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState(location.state?.date || null);
  const [showPopup, setShowPopup] = useState(location.state?.showPopup || false);
  const [emotionRecords, setEmotionRecords] = useState({});
  const [formattedSelectedDate, setFormattedSelectedDate] = useState("");

  // 감정 데이터를 가져와 달력 이벤트로 변환
  useEffect(() => {
    async function fetchEmotionData() {
      try {
        // API 호출 시 username을 동적으로 삽입
        const response = await fetch(`/api/diary-emotion/all/${user.username}`);
        if (response.ok) {
          const data = await response.json();
          const events = data.map((item) => ({
            title: getEmotionEmojis({
              happiness: item.happiness,
              sadness: item.sadness,
              anger: item.anger,
              fear: item.fear,
              surprise: item.surprise,
              disgust: item.disgust,
            }),
            start: item.created_at.split("T")[0],
          }));
          setCalendarEvents(events);
        } else {
          console.error("Failed to fetch emotion data");
        }
      } catch (error) {
        console.error("Error fetching emotion data:", error);
      }
    }
  
    // user.username이 존재하면 실행
    if (user?.username) {
      fetchEmotionData();
    }
  }, [user.username]); // username이 바뀔 때만 재실행

  // 주요 감정을 분석하는 함수
  const analyzeEmotion = (emotions) => {
    const majorEmotion = Object.entries(emotions).reduce((max, current) =>
      current[1] > max[1] ? current : max
    )[0];
    return majorEmotion;
  };

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
      // 선택된 날짜로 감정 데이터 가져오기
      const response = await fetch(`/api/diary-emotion?date=${dateStr}`);
      if (response.ok) {
        const data = await response.json();
        setEmotionRecords({
          happiness: data.happiness,
          sadness: data.sadness,
          anger: data.anger,
          fear: data.fear,
          surprise: data.surprise,
          disgust: data.disgust,
        });
        const majorEmotion = analyzeEmotion(data);
      } 
      else {
        console.error("Failed to fetch emotion data for the selected date");
      }
    } catch (error) {
      console.error("Error fetching emotion data:", error);
    }
  };

  // 차트 데이터를 생성
  const chartData = useMemo(() => ({
    labels: ["Happiness", "Sadness", "Anger", "Fear", "Surprise", "Disgust"],
    datasets: [
      {
        label: "Emotion Levels",
        data: [
          emotionRecords.happiness || 0,
          emotionRecords.sadness || 0,
          emotionRecords.anger || 0,
          emotionRecords.fear || 0,
          emotionRecords.surprise || 0,
          emotionRecords.disgust || 0,
        ],
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
  }), [emotionRecords]);

  const getEmotionEmojis = (emotions) => {
    const emotionMap = {
      happiness: "😊",
      sadness: "😢",
      anger: "😡",
      fear: "😨",
      surprise: "😲",
      disgust: "🤢",
    };
  
    return Object.entries(emotions)
      .filter(([_, value]) => value > 0) // 값이 0보다 큰 경우만 이모지 반환
      .map(([emotion]) => emotionMap[emotion] || "🤔")
      .join(" ");
  };

  const handlePopupArrowClick = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "prev" ? -7 : 7));
    setSelectedDate(newDate.toISOString().split("T")[0]);
    setPopupCalendarKey((prevKey) => prevKey + 1);
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    setCalendarKey((prevKey) => prevKey + 1);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setEmotionRecords({});
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    setCalendarKey((prevKey) => prevKey + 1);
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
          <button
            className="emotion-graph-button"
            onClick={() =>
                navigate("/emotion-graph", {
                state: { date: selectedDate }})
            }
           >
            장기 감정 그래프
          </button>
          <img
            src={user?.profilePicture || "https://via.placeholder.com/30"}
            alt="Profile"
            className="profile-img"
          />
          <span>{user?.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}

      {/* 메인 캘린더 */}
      <FullCalendar
        key={calendarKey}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="800px"
        initialDate={currentDate}
        headerToolbar={false}
        events={calendarEvents} // 감정 데이터를 이벤트로 전달
        dateClick={(info) => handleDateClick(info)}
      />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="popup-close-btn" onClick={closePopup}>
              ✕
            </button>
            <h2 className="popup-date">{formattedSelectedDate}</h2>
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
                events={calendarEvents} // 팝업 캘린더에도 감정 데이터 적용
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
            <div className="popup-content">
              {emotionRecords && emotionRecords.length > 0 ? (
                <ul className="emotion-list">
                  {emotionRecords.map((record, index) => (
                    <li key={index} className="emotion-item">
                      {/* 감정 이모지 */}
                      <span className="emojis">
                        {Object.entries(record.emotions)
                          .map(([emotion, value]) => getEmotionEmojis({ [emotion]: value }))
                          .join(" ")
                        }
                      </span>
                      {/* 일기 제목 */}
                      <span className="diary-title">{record.title}</span>
                      {/* 일기 기록 시간 */}
                      <span className="diary-time">
                      {new Date(record.createdAt).toLocaleString()}
                      </span>
                   </li>
                 ))}
                </ul>
                ) : (
                <p>No emotion records available</p>
                 )}
            </div>
            <div className="popup-chart">
              <Line data={chartData} />
            </div>
            <div className="popup-actions">
              <button
                className="recommend-button"
                onClick={() => navigate("/recommendations", {state:{emotionType: majorEmotion} })}
              >
                음악 추천
              </button>
              <button
                className="diary-button"
                onClick={() =>
                  navigate("/write", { state: { date: selectedDate } })
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
