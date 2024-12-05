import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/write.css"; // CSS 연결

const WriteDiary = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // 상태 초기화
    const { diaryId, date } = location.state || {};
    const selectedDate = date || new Date().toISOString().split("T")[0];
    const userName = localStorage.getItem("username"); // 로컬스토리지에서 사용자명 가져오기

    const [diaryTitle, setDiaryTitle] = useState(""); // 초기 상태 빈 문자열로 설정
    const [diaryContent, setDiaryContent] = useState(""); // 초기 상태 빈 문자열로 설정
    const [fixedDate, setFixedDate] = useState(null); // 수정 날짜
    const [isEditing, setIsEditing] = useState(!!diaryId); // 수정 모드 여부

    // 수정 모드에서 데이터 불러오기
    // 수정 모드에서 데이터 불러오기
    useEffect(() => {
        const fetchDiaryData = async () => {
            if (!diaryId) return;

            try {
                const response = await fetch(`http://localhost:8080/api/diary/${diaryId}`);
                if (response.ok) {
                    const data = await response.json();
                    setDiaryTitle(data.title || ""); // 기본값 제공
                    setDiaryContent(data.content || ""); // 기본값 제공
                    setFixedDate(data.fixed_date || null); // 수정 날짜 설정
                } else {
                    console.error("Failed to fetch diary data");
                }
            } catch (error) {
                console.error("Error fetching diary data:", error);
            }
        };

        fetchDiaryData();
    }, [diaryId]);

    const handleEmotionAnalysis = async (diaryId) => {
        try {
            console.log("Requesting emotion analysis for diary ID:", diaryId);
            const response = await fetch(`http://localhost:8080/api/diary-emotion/${diaryId}`, {
                method: "POST",
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Emotion analysis completed successfully:", result);

                // 부모 컴포넌트의 상태 업데이트
                setEmotionData((prevData) => [...prevData, result]);
            } else {
                const error = await response.json();
                console.error("Emotion analysis failed:", error.message);
            }
        } catch (error) {
            console.error("Error during emotion analysis:", error);
        }
    };


// 저장 버튼 핸들러
    const handleSave = async () => {
        if (!diaryTitle.trim() || !diaryContent.trim()) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            const endpoint = diaryId
                ? `http://localhost:8080/api/diary/${diaryId}` // 수정 요청
                : "http://localhost:8080/api/diary/post"; // 작성 요청

            const method = diaryId ? "PUT" : "POST"; // 수정 또는 작성 구분
            const body = diaryId
                ? JSON.stringify({
                    title: diaryTitle,
                    content: diaryContent,
                    username: userName, // user_id 추가
                })
                : JSON.stringify({
                    title: diaryTitle,
                    content: diaryContent,
                    username: userName,
                });

            console.log("Request Endpoint:", endpoint);
            console.log("Request Method:", method);
            console.log("Request Body:", body);

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            });

            if (response.ok) {
                alert(diaryId ? "일기가 수정되었습니다!" : "일기가 저장되었습니다!");
                navigate("/calendar", { state: { date: selectedDate } }); // 캘린더로 이동
            } else {
                const error = await response.json();
                alert(`저장 실패: ${error.message}`);
            }
        } catch (error) {
            console.error("일기 저장 중 오류 발생:", error);
            alert("요청 중 오류가 발생했습니다.");
        }
    };


    // 닫기 버튼 핸들러
    const handleClose = () => {
        navigate("/calendar", { state: { date: selectedDate } });
    };

    return (
        <div className="background">
            <div className="diary-popup">
                <div className="header">
                    <input
                        className="diary-title-input"
                        value={diaryTitle || ""} // 기본값 제공
                        onChange={(e) => setDiaryTitle(e.target.value)}
                        placeholder={isEditing ? "수정할 제목을 입력하세요" : "일기 제목을 입력하세요"}
                    />
                    <button className="close-button" onClick={handleClose}>
                        ✕
                    </button>
                </div>
                <textarea
                    className="diary-content"
                    value={diaryContent || ""} // 기본값 제공
                    onChange={(e) => setDiaryContent(e.target.value)}
                    placeholder={isEditing ? "수정할 내용을 입력하세요..." : "오늘의 일기를 작성해 보세요..."}
                ></textarea>
                {fixedDate && isEditing && (
                    <p className="fixed-date">
                        마지막 수정: {new Date(fixedDate).toLocaleString("ko-KR")}
                    </p>
                )}
                <button className="save-button" onClick={handleSave}>
                    {isEditing ? "수정하기" : "저장하기"}
                </button>
            </div>
        </div>
    );
};

export default WriteDiary;
