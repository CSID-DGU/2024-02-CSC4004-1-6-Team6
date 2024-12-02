import React, { useState, useEffect } from "react";
import "./EmotionManagement.css";

const EmotionManagement = () => {
    const [tips, setTips] = useState([]); // 감정 관리 팁 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    // API로부터 감정 관리 팁 데이터 가져오기
    useEffect(() => {
        const fetchTips = async () => {
            try {
                const response = await fetch("/api/emotion-tips"); // API 호출
                if (response.ok) {
                    const result = await response.json();
                    setTips(result); // 데이터 상태에 저장
                } else {
                    const error = await response.json();
                    alert(`팁 데이터 로드 실패: ${error.message}`);
                }
            } catch (error) {
                console.error("데이터 로드 중 오류 발생:", error);
                alert("서버와의 연결에 문제가 있습니다.");
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchTips();
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
