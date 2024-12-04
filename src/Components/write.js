import React, { useState, useEffect } from "react";
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
    const [diariesByDate, setDiariesByDate] = useState([]);
    const userName = localStorage.getItem("username"); // 로컬스토리지에서 사용자명 가져오기

    // 저장하기 버튼 핸들러
    const handleSave = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/diary/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: diaryTitle,
                    content: diaryContent,
                    username: userName,
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

    // 특정 날짜의 일기 조회
    const fetchDiaryByDate = async (date) => {
        try {
            const response = await fetch(`http://localhost:8080/api/diary/${userName}`);
            if (response.ok) {
                const diaries = await response.json();
                // `created_at` 값을 사용해 날짜 필터링
                const filteredDiaries = diaries.filter((diary) =>
                    diary.created_at.split("T")[0] === date
                );
                setDiariesByDate(filteredDiaries);
            } else {
                console.error("일기 조회 실패");
            }
        } catch (error) {
            console.error("일기 조회 중 오류 발생:", error);
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

    // 날짜 기반 데이터 조회
    useEffect(() => {
        if (selectedDate) {
            fetchDiaryByDate(selectedDate);
        }
    }, [selectedDate]);

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

                {/* 특정 날짜의 일기 표시 */}
                {diariesByDate.length > 0 && (
                    <div className="diaries-by-date">
                        <h3>선택한 날짜의 일기:</h3>
                        <ul>
                            {diariesByDate.map((diary) => (
                                <li key={diary.id}>
                                    <strong>{diary.title}</strong> - {diary.content}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Diary;
