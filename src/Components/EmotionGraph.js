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
    const { date } = location.state || {}; // MyCalendar에서 넘어온 데이터
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmotionData = async () => {
            try {
                // 날짜 기반으로 백엔드에서 데이터 가져오기
                const response = await fetch(`/api/diary-emotion/?date=${date}`);
                if (response.ok) {
                    const result = await response.json();
                    const formattedData = Object.entries(result).map(
                        ([emotion, value]) => ({
                            emotion, // 감정 이름
                            value, // 감정 값
                        })
                    );
                    setData(formattedData);
                } else {
                    const error = await response.json();
                    setError(error.message);
                }
            } catch (error) {
                setError("데이터 로드 중 오류 발생");
            } finally {
                setLoading(false);
            }
        };

        if (date) {
            fetchEmotionData();
        } else {
            setError("날짜가 선택되지 않았습니다.");
            setLoading(false);
        }
    }, [date]);

     // 주요 감정을 분석하는 함수
     const analyzeEmotion = () => {
        if (!data || data.length === 0) return "unknown";

        // 감정 합계를 계산
        const emotionSums = data.reduce((acc, record) => {
            Object.entries(record.emotions).forEach(([emotion, value]) => {
                acc[emotion] = (acc[emotion] || 0) + value;
            });
            return acc;
        }, {});

        // 가장 높은 감정을 결정
        const majorEmotion = Object.entries(emotionSums).reduce((max, entry) =>
            entry[1] > max[1] ? entry : max
        )[0];

        return majorEmotion; // 주요 감정 반환
    };

    // 감정 관리로 이동
    const handleEmotionManagement = () => {
        const majorEmotion = analyzeEmotion(); // 주요 감정 분석
        navigate("/emotion-management", { state: { emotionType: majorEmotion } }); // 주요 감정 전달
    };

    // 닫기 버튼 핸들러
    const handleClose = () => {
        navigate("/calendar"); // MyCalendar로 돌아가기
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
                {date ? `${date}의 감정 그래프` : "장기적 감정 그래프"}
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