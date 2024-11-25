import React from 'react';
import './index.css'; // CSS 파일 연결

const Diary = () => {
    const handleSave = () => {
        alert('일기가 저장되었습니다!'); // 저장하기 버튼 클릭 핸들러
    };

    const handleClose = () => {
        alert('닫기 버튼 클릭!'); // 닫기 버튼 클릭 핸들러
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
                <p className="diary-content">
                    오늘은 과제를 했다. 교수님은 학생들이 자기 수업만 듣는 줄 아신다. 화가 났다.
                </p>
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
