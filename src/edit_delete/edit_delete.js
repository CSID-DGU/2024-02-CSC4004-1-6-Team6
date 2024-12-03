import React, { useState, useEffect } from "react";
import "./edit_delete.css";

const DiaryEditor = () => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [diaryContent, setDiaryContent] = useState(
        "오늘은 과제를 했다. 교수님은 학생들이 자기 수업만 듣는 줄 아신다. 화가 났다."
    );

    // 현재 날짜와 시간 설정
    useEffect(() => {
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD 형식
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const formattedTime = `${hours < 12 ? "오전" : "오후"} ${
            hours % 12 || 12
        }:${minutes.toString().padStart(2, "0")}`;

        setDate(formattedDate);
        setTime(formattedTime);
    }, []);

    // 일기 내용 업데이트
    const handleContentChange = (e) => {
        setDiaryContent(e.target.value);
    };

    // 저장 버튼 클릭 핸들러 (API 연동)
    const handleSave = async () => {
        if (diaryContent.trim() === "") {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            const response = await fetch("/api/mysql/insert-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date,
                    time,
                    content: diaryContent,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`일기가 저장되었습니다! ID: ${result.id}`);
            } else {
                const error = await response.json();
                alert(`저장 실패: ${error.message}`);
            }
        } catch (error) {
            console.error("일기 저장 오류 발생:", error);
            alert("일기 저장 요청 중 오류가 발생했습니다.");
        }
    };

    // 삭제 버튼 클릭 핸들러 (API 연동)
    const handleDelete = async () => {
        if (window.confirm("정말로 이 일기를 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`/api/mysql/delete-data/${date}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("일기가 삭제되었습니다.");
                    setDiaryContent(""); // 로컬 상태 초기화
                } else {
                    const error = await response.json();
                    alert(`삭제 실패: ${error.message}`);
                }
            } catch (error) {
                console.error("일기 삭제 오류 발생:", error);
                alert("일기 삭제 요청 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="diary-popup">
            {/* 날짜 및 시간 */}
            <div className="header">
                <div className="date-time">
                    <p className="date">{date}</p>
                    <p className="time">{time}</p>
                </div>
                <button className="delete-button" onClick={handleDelete}>
                    삭제
                </button>
            </div>

            {/* 일기 수정 본문 */}
            <textarea
                className="diary-content"
                value={diaryContent}
                onChange={handleContentChange}
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
