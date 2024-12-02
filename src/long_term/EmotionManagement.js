import React, { useState, useEffect } from "react";
import "./EmotionManagement.css";

const EmotionManagement = () => {
    const [tips, setTips] = useState([]); // 감정 관리 팁 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    // 감정 관리 팁 가져오기
    useEffect(() => {
        const fetchEmotionTips = async () => {
            try {
                const response = await fetch("/api/gpt/summarize-text", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: "감정 관리 방법을 생성해 주세요.",
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    setTips(result.tips || []); // 결과에서 팁 데이터 저장
                } else {
                    const error = await response.json();
                    alert(`팁 로드 실패: ${error.message}`);
                }
            } catch (error) {
                console.error("팁 로드 오류 발생:", error);
                alert("감정 관리 팁을 가져오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmotionTips();
    }, []);

    return (
        <div className="management-popup">
            <h2 className="management-title">감정 관리 방법</h2>
            {loading ? (
                <p>데이터를 불러오는 중입니다...</p>
            ) : tips.length === 0 ? (
                <p>표시할 팁이 없습니다.</p>
            ) : (
                <ul className="management-tips">
                    {tips.map((tip, index) => (
                        <li key={index} className="tip-item">
                            {index + 1}. {tip}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmotionManagement;
