import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 페이지 이동
import "../Styles/write.css"; // CSS 연결

const Diary = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // 전달받은 데이터 확인
    const { diaryId, initialTitle, initialContent, date } = location.state || {};
    const [diaryTitle, setDiaryTitle] = useState(initialTitle || "나의 일기");
    const [diaryContent, setDiaryContent] = useState(initialContent || "오늘의 일기를 작성하세요...");
    const selectedDate = date || new Date().toISOString().split("T")[0];

    // 저장하기 버튼 핸들러
    const handleSave = async () => {
        try {
            const response = await fetch("/api/diary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: diaryTitle,
                    content: diaryContent,
                    userId: user.id,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`일기가 저장되었습니다! ID: ${result.diaryId}`);
                navigate("/calendar", { state: { date: selectedDate, showPopup: true } });
            } else {
                const error = await response.json();
                alert(`저장 실패: ${error.message}`);
            }
        } catch (error) {
            console.error("일기 저장 중 오류 발생:", error);
            alert("일기 저장 요청 중 오류가 발생했습니다.");
        }
    };

    // 수정/삭제 버튼 핸들러
    const handleEditDelete = () => {
        navigate("/edit-delete", {
            state: {
                diaryId,
                initialTitle: diaryTitle,
                initialContent: diaryContent,
                date: selectedDate,
            },
        });
    };

    // 닫기 버튼 핸들러
    const handleClose = () => {
        navigate("/calendar", { state: { date: selectedDate, showPopup: true } });
    };

    return (
        <div className="background">
            <div className="diary-popup">
                <div className="header">
                    <button className="save-button" onClick={handleSave}>
                        저장하기
                    </button>
                    <input
                        className="diary-title-input"
                        value={diaryTitle}
                        onChange={(e) => setDiaryTitle(e.target.value)}
                        placeholder="일기 제목을 입력하세요"
                    />
                    <button className="close-button" onClick={handleClose}>
                        <img 
                            src="/login/close-icon.png" 
                            alt="닫기" 
                            className="close-icon"
                        />
                    </button>
                </div>
                <textarea
                    className="diary-content"
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                    placeholder="오늘의 일기를 작성해 보세요..."
                ></textarea>
                {diaryId && (
                    <button className="edit-delete-button" onClick={handleEditDelete}>
                        수정/삭제
                    </button>
                )}
            </div>
        </div>
    );
};

export default Diary;
