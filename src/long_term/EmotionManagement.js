import React from "react";
import "./EmotionManagement.css";

const EmotionManagement = () => {
    const tips = [
        "깊게 숨을 쉬며 마음을 안정시켜 보세요.",
        "운동을 통해 스트레스를 해소하세요.",
        "좋아하는 음악을 들으며 감정을 조절해 보세요.",
        "가까운 친구와 대화를 나눠 보세요.",
        "기록을 통해 자신의 감정을 관찰해 보세요.",
    ];

    return (
        <div className="management-popup">
            <h2 className="management-title">감정 관리 방법</h2>
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
