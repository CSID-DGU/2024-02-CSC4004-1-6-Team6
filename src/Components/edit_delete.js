import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation 추가
import "../Styles/edit_delete.css";

const DiaryEditor = ({ diaryData, user }) => {
    const location = useLocation(); // Write.js에서 전달된 데이터 가져오기
    const navigate = useNavigate();
    const { diaryId, initialTitle, initialContent, date } = location.state || {};
    const [diaryTitle, setDiaryTitle] = useState(diaryData?.title || "나의 일기");
    const [diaryContent, setDiaryContent] = useState(diaryData?.content || "");

    // 날짜와 시간 설정
    const [createdAt, setCreatedAt] = useState(
        diaryData?.created_at || new Date().toISOString()
    );

    useEffect(() => {
        // location.state에서 데이터가 업데이트되면 상태 초기화
        if (initialTitle) setDiaryTitle(initialTitle);
        if (initialContent) setDiaryContent(initialContent);
        if (date) setCreatedAt(date);
    }, [initialTitle, initialContent, date]);

    // 일기 저장 핸들러
    const handleSave = async () => {
        if (diaryContent.trim() === "" || diaryTitle.trim() === "") {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            const response = await fetch(`/api/diary/${diaryId}`, {
                method: "PUT", // 수정 요청
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
                alert("일기가 수정되었습니다!");
                navigate("/calendar", { state: { date, showPopup: true } }); // 캘린더로 이동
            } else {
                const error = await response.json();
                alert(`수정 실패: ${error.message}`);
            }
        } catch (error) {
            console.error("일기 수정 중 오류 발생:", error);
            alert("요청 중 오류가 발생했습니다.");
        }
    };

    // 일기 삭제 핸들러
    const handleDelete = async () => {
        if (!diaryId) {
            alert("삭제할 일기가 존재하지 않습니다.");
            return;
        }

        if (!window.confirm("정말로 이 일기를 삭제하시겠습니까?")) {
            return;
        }

        try {
            const response = await fetch(`/api/diary/${diaryId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("일기가 삭제되었습니다!");
                window.location.reload(); // 새로고침으로 상태 초기화
            } else {
                const error = await response.json();
                alert(`삭제 실패: ${error.message}`);
            }
        } catch (error) {
            console.error("일기 삭제 중 오류 발생:", error);
            alert("삭제 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="diary-popup">
            {/* 날짜 및 시간 */}
            <div className="header">
                <div className="date-time">
                    <p className="date">{new Date(createdAt).toLocaleDateString()}</p>
                    <p className="time">{new Date(createdAt).toLocaleTimeString()}</p>
                </div>
                <button className="delete-button" onClick={handleDelete}>
                    삭제
                </button>
            </div>

            {/* 제목 입력 */}
            <input
                className="diary-title-input"
                value={diaryTitle}
                onChange={(e) => setDiaryTitle(e.target.value)}
                placeholder="일기 제목을 입력하세요"
            />

            {/* 일기 수정 본문 */}
            <textarea
                className="diary-content"
                value={diaryContent}
                onChange={(e) => setDiaryContent(e.target.value)}
                placeholder="일기를 작성하세요..."
            ></textarea>

            {/* 저장 버튼 */}
            <button className="save-button" onClick={handleSave}>
                저장
            </button>
        </div>
    );
};

export default DiaryEditor;

