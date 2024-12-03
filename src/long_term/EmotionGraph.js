import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import "./EmotionGraph.css";

const EmotionGraph = () => {
    const [data, setData] = useState([]); // 감정 데이터 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    // 감정 데이터 가져오기
    useEffect(() => {
        const fetchEmotionData = async () => {
            try {
                const response = await fetch("/api/mysql/get-data/1"); // 백엔드 API 호출
                if (response.ok) {
                    const result = await response.json();
                    // 백엔드에서 받은 데이터 가공
                    const formattedData = result.map((item) => ({
                        date: item.date, // 날짜 (예: "11-01")
                        emotion: item.emotion, // 감정 점수
                    }));
                    setData(formattedData);
                } else {
                    const error = await response.json();
                    alert(`데이터 로드 실패: ${error.message}`);
                }
            } catch (error) {
                console.error("데이터 로드 중 오류 발생:", error);
                alert("감정 데이터를 가져오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmotionData();
    }, []);

    return (
        <div className="graph-popup">
            <h2 className="graph-title">장기적 감정 그래프</h2>
            {loading ? (
                <p>데이터를 불러오는 중입니다...</p>
            ) : data.length === 0 ? (
                <p>표시할 데이터가 없습니다.</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="emotion"
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
