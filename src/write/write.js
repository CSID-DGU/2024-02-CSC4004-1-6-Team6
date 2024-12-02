import React, { useState } from 'react';
import './write.css'; // CSS 파일 연결

const Diary = () => {
    const [diaryContent, setDiaryContent] = useState("오늘은 과제를 했다. 교수님은 학생들이 자기 수업만 듣는 줄 아신다. 화가 났다."); // 일기 내용

    // 일기 저장 API 호출
    const handleSave = async () => {
        try {
            const response = await fetch('/api/diary/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: diaryContent }),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`일기가 저장되었습니다! ID: ${result.id}`);
            } else {
                const error = await response.json();
                alert(`일기 저장 실패: ${error.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('일기 저장 중 오류가 발생했습니다.');
        }
    };

    // 닫기 버튼 동작
    const handleClose = () => {
        // 필요시 컴포넌트를 닫거나 다른 페이지로 이동
        alert('닫기 버튼 클릭!');
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
                />
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
