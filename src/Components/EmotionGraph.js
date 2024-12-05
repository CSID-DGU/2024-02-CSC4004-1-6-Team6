import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import "../Styles/EmotionGraph.css";

const EmotionGraph = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { diaryId } = location.state || {}; // MyCalendar에서 넘어온 diaryId 전달
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 주요 감정을 계산하는 함수
    const analyzeEmotion = (emotionData) => {
        if (!emotionData) return "unknown";

        const majorEmotion = Object.entries(emotionData).reduce((max, current) =>
            current[1] > max[1] ? current : max
        )[0];

        console.log("Major emotion analyzed:", majorEmotion); // 로그 추가
        return majorEmotion; // 주요 감정 반환
    };

    // 감정 데이터 가져오기 함수
    const fetchEmotionData = async (url, errorMessage) => {
        try {
            console.log("Fetching emotion data from URL:", url); // 로그 추가
            const response = await fetch(url);
            if (response.ok) {
                const jsonData = await response.json();
                console.log("Fetched data:", jsonData); // 로그 추가
                return jsonData;
            } else {
                const error = await response.json();
                console.error("API responded with error:", error); // 로그 추가
                throw new Error(error.message || errorMessage);
            }
        } catch (err) {
            console.error("Error during fetch:", err.message); // 로그 추가
            throw new Error(err.message || errorMessage);
        }
    };

    useEffect(() => {
        const loadEmotionData = async () => {
            if (!diaryId) {
                console.warn("No diary ID provided."); // 로그 추가
                setError("일기 ID가 제공되지 않았습니다.");
                setLoading(false);
                return;
            }

            console.log("Loading emotion data for diary ID:", diaryId); // 로그 추가
            try {
                const result = await fetchEmotionData(
                    `http://localhost:8080/api/diary-emotion/${diaryId}`,
                    "감정 데이터를 불러오는 중 오류가 발생했습니다."
                );

                console.log("Formatting emotion data for graph:", result); // 로그 추가
                const formattedData = [
                    { emotion: "happiness", value: result.happiness },
                    { emotion: "sadness", value: result.sadness },
                    { emotion: "anger", value: result.anger },
                    { emotion: "fear", value: result.fear },
                    { emotion: "surprise", value: result.surprise },
                    { emotion: "disgust", value: result.disgust },
                ];
                setData(formattedData);
                console.log("Formatted data set to state:", formattedData); // 로그 추가
            } catch (err) {
                console.error("Error while loading emotion data:", err.message); // 로그 추가
                setError(err.message);
            } finally {
                setLoading(false);
                console.log("Loading state set to false."); // 로그 추가
            }
        };

        loadEmotionData();
    }, [diaryId]);

    // 감정 관리로 이동
    const handleEmotionManagement = () => {
        console.log("Analyzing major emotion from data:", data); // 로그 추가
        const majorEmotion = analyzeEmotion(
            data.reduce((acc, { emotion, value }) => ({ ...acc, [emotion]: value }), {})
        );
        console.log("Navigating to emotion management page with major emotion:", majorEmotion); // 로그 추가
        navigate("/emotion-management", { state: { emotionType: majorEmotion } });
    };

    // 닫기 버튼 핸들러
    const handleClose = () => {
        console.log("Navigating back to calendar."); // 로그 추가
        navigate("/calendar");
    };

    return (
        <div className="graph-popup">
            <div className="graph-header">
                <button className="emotion-management-btn" onClick={handleEmotionManagement}>
                    감정 관리 팁
                </button>
                <button className="close-button" onClick={handleClose}>
                    닫기
                </button>
            </div>
            <h2 className="graph-title">
                {diaryId ? `${diaryId}의 감정 그래프` : "장기적 감정 그래프"}
            </h2>
            {loading ? (
                <p>데이터를 불러오는 중입니다...</p>
            ) : error ? (
                <p>오류: {error}</p>
            ) : data.length === 0 ? (
                <p>표시할 데이터가 없습니다.</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey="emotion" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default EmotionGraph;
