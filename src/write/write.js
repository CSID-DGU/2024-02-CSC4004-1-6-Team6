import React, { useState } from 'react';
import './write.css'; // CSS 파일 연결

const Diary = () => {
    const [diaryContent, setDiaryContent] = useState(
        "오늘은 과제를 했다. 교수님은 학생들이 자기 수업만 듣는 줄 아신다. 화가 났다."
    );

    // 저장하기 버튼 핸들러 (API 연동)
    const handleSave = async () => {
        try {
            const response = await fetch('/api/mysql/insert-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
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
            console.error("일기 저장 중 오류 발생:", error);
            alert("일기 저장 요청 중 오류가 발생했습니다.");
        }
    };

    // 닫기 버튼 핸들러
    const handleClose = () => {
        alert('닫기 버튼 클릭!');
        // 추가 동작 필요 시 여기에 구현
    };

    return (
        <div className="background">
            <div className="diary-popup">
                <div className="header">
                    <button className="save-button" onClick={handleSave}>
                        저장하기
                    </button>
                    <h1 className="diary-title">나의 일기 3</h1>
                    <button className="close-button" onClick={handleClose}>
                        닫기
                    </button>
                </div>
                <textarea
                    className="diary-content"
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                    placeholder="오늘의 일기를 작성해 보세요..."
                ></textarea>
                <div className="diary-lines">
                    {Array(10)
                        .fill(null)
                        .map((_, index) => (
                            <div className="line" key={index}></div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Diary;
