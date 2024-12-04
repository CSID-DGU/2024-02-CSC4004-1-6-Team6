import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Line } from "react-chartjs-2";
import "../Styles/mycalendar.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MyCalendar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(location.state?.date || null);
  const [showPopup, setShowPopup] = useState(location.state?.showPopup || false);
  const [emotionRecords, setEmotionRecords] = useState({});
  const [formattedSelectedDate, setFormattedSelectedDate] = useState("");
  const [majorEmotion, setMajorEmotion] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [filteredDiaries, setFilteredDiaries] = useState([]);

  useEffect(() => {
    async function fetchDiaryData() {
      try {
        const response = await fetch(`http://localhost:8080/api/diary/${user.username}`);
        if (response.ok) {
          const data = await response.json();
          setDiaryEntries(data.data || []);
        } else {
          console.error("Failed to fetch diary data");
        }
      } catch (error) {
        console.error("Error fetching diary data:", error);
      }
    }

    fetchDiaryData();
  }, [user.username]);

  useEffect(() => {
    async function fetchEmotionData() {
      try {
        const response = await fetch(`http://localhost:8080/api/diary-emotion/all/${user.username}`);
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

    fetchEmotionData();
  }, [user.username]);

  const analyzeEmotion = (emotions) => {
    const entries = Object.entries(emotions);
    const maxEntry = entries.reduce((max, current) =>
        current[1] > max[1] ? current : max
    );
    return maxEntry[1] > 0 ? maxEntry[0] : "Neutral";
  };

  const handleDateClick = (info) => {
    const dateStr = info.dateStr;
    setSelectedDate(dateStr);

    const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    setFormattedSelectedDate(formattedDate);

    const diariesForDate = diaryEntries.filter((entry) =>
        entry.created_at.startsWith(dateStr)
    );
    setFilteredDiaries(diariesForDate);

    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setEmotionRecords({});
    setFilteredDiaries([]);
  };

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
        .filter(([_, value]) => value > 0)
        .map(([emotion]) => emotionMap[emotion] || "🤔")
        .join(" ");
  };

  return (
      <div className="calendar-container">
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
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

                {/* Display Diaries */}
                <div className="popup-diaries">
                  {filteredDiaries.length > 0 ? (
                      <ul>
                        {filteredDiaries.map((entry, index) => (
                            <li key={index}>
                              <h3>{entry.title}</h3>
                              <p>{entry.content}</p>
                            </li>
                        ))}
                      </ul>
                  ) : (
                      <p>No diaries found for this date.</p>
                  )}
                </div>

                {/* Emotion Records */}
                <div className="popup-content">
                  {Object.keys(emotionRecords).length > 0 ? (
                      <ul>
                        {Object.entries(emotionRecords).map(([emotion, value]) => (
                            <li key={emotion}>
                              <span>{emotion}</span>: {(value || 0).toFixed(2)}
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
                  <button onClick={() => navigate("/recommendations")}>
                    음악 추천
                  </button>
                  <button onClick={() => navigate("/write", { state: { date: selectedDate } })}>
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
