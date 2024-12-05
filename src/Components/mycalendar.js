import React, { useEffect, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MyCalendar = ({ user, diaryEntries, emotionData, setEmotionData, setDiaryEntries }) => {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [showPopup, setShowPopup] = React.useState(false);
  const [filteredDiaries, setFilteredDiaries] = React.useState([]);
  const [emotionRecords, setEmotionRecords] = React.useState({});
  const [formattedSelectedDate, setFormattedSelectedDate] = React.useState("");
  const [calendarEvents, setCalendarEvents] = React.useState([]); // 상태 초기화
  const navigate = useNavigate(); // 컴포넌트 내부에 추가


  useEffect(() => {
    // Fetch diary entries if not already loaded
    if (diaryEntries.length === 0) {
      const fetchDiaryData = async () => {
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
      };
      fetchDiaryData();
    }
  }, [user.username, diaryEntries, setDiaryEntries]);

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

  const handleDateClick = (info) => {
    const date = info.dateStr;
    setSelectedDate(date);

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    setFormattedSelectedDate(formattedDate);

    const diariesForDate = diaryEntries.filter((entry) =>
        entry.created_at.startsWith(date)
    );
    setFilteredDiaries(diariesForDate);

    if (diariesForDate.length > 0) {
      // Fetch emotion data for the first diary entry of the selected date
      const diaryId = diariesForDate[0].id;
      const fetchEmotionData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/diary-emotion/${diaryId}`);
          if (response.ok) {
            const result = await response.json();
            setEmotionRecords(result.data || {});
            setEmotionData((prev) => [...prev, result.data]); // Update shared emotion data
          } else {
            console.error("Failed to fetch emotion data");
          }
        } catch (error) {
          console.error("Error fetching emotion data:", error);
        }
      };
      fetchEmotionData();
    }

    setShowPopup(true);
  };

  const handleDelete = async (diaryId) => {
    if (!window.confirm("정말로 이 일기를 삭제하시겠습니까?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/diary/${diaryId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("일기가 삭제되었습니다!");
        setDiaryEntries((prev) => prev.filter((entry) => entry.id !== diaryId));
        setFilteredDiaries((prev) => prev.filter((entry) => entry.id !== diaryId));
        setShowPopup(false);
      } else {
        console.error("Failed to delete diary.");
      }
    } catch (error) {
      console.error("Error deleting diary:", error);
    }
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

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
    setFilteredDiaries([]);
    setEmotionRecords({});
  };

  return (
      <div className="calendar-container">
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            dateClick={handleDateClick}
        />
        {showPopup && (
            <div className="popup-overlay">
              <div className="popup">
                <button className="popup-close-btn" onClick={closePopup}>✕</button>
                <h2>{formattedSelectedDate}</h2>
                {filteredDiaries.length > 0 ? (
                    filteredDiaries.map((entry) => (
                        <div key={entry.id}>
                          <h3>{entry.title}</h3>
                          <p>{entry.content}</p>
                          <button onClick={() => navigate("/write", { state: { diaryId: entry.id } })}>
                            수정
                          </button>
                          <button onClick={() => handleDelete(entry.id)}>삭제</button>
                        </div>
                    ))
                ) : (
                    <p>No diaries found for this date.</p>
                )}
                <div className="popup-chart">
                  <Line data={chartData} />
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default MyCalendar;
