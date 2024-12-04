import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/EmotionManagement.css";

const EmotionManagement = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { emotionType } = location.state || {}; // EmotionGraph에서 전달된 주요 감정

    // 감정별 고정 팁
    const emotionTips = {
        happiness: [
            "행복한 감정을 더 오래 지속하려면 감사의 마음을 표현해 보세요.",
            "자신의 성과를 축하하며 자신감을 높이세요.",
        ],
        sadness: [
            "슬픈 감정은 자연스러운 감정입니다. 충분히 느껴보세요.",
            "신뢰할 수 있는 사람에게 마음을 열고 대화를 나눠 보세요.",
        ],
        anger: [
            "화가 날 땐 천천히 심호흡을 하며 마음을 안정시키세요.",
            "운동이나 산책으로 에너지를 발산해 보세요.",
        ],
        fear: [
            "두려운 감정을 기록하며 그 이유를 찾아보세요.",
            "신뢰할 수 있는 사람과 이야기하며 위안을 얻으세요.",
        ],
        surprise: [
            "놀라움을 즐기며 긍정적인 면을 찾아보세요.",
            "새로운 경험을 일기나 사진으로 남겨보세요.",
        ],
        disgust: [
            "혐오감을 느낀 원인을 파악하고 거리를 두세요.",
            "편안한 장소에서 심호흡을 하며 안정감을 되찾으세요.",
        ],
        unknown: ["모든 감정을 존중하며 자기 자신을 돌보세요."],
    };

    // 선택한 감정에 대한 팁 가져오기
    const tips = emotionTips[emotionType] || emotionTips["unknown"];

    return (
        <div className="management-popup">
            <div className="management-header">
                <h2 className="management-title">감정 관리 방법</h2>
                <button className="close-button" onClick={() => navigate(-1)}>
                    닫기
                </button>
            </div>
            {emotionType && (
                <p className="emotion-type">주요 감정: {emotionType.charAt(0).toUpperCase() + emotionType.slice(1)}</p>
            )}
            <ul className="management-tips">
                {tips.map((tip, index) => (
                    <li key={index} className="tip-item">
                        {index + 1}. {tip}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmotionManagement;