import React, { useState, useEffect } from "react";

const MusicRecommendation = () => {
  const [playlist, setPlaylist] = useState(null); // 생성된 플레이리스트 정보
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

  // 백엔드에서 플레이리스트 정보 가져오기
  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const response = await fetch("/api/spotify/create-playlist"); // 백엔드에서 생성된 플레이리스트 가져오기
        if (response.ok) {
          const data = await response.json();
          setPlaylist(data); // 백엔드에서 반환된 플레이리스트 정보 저장
        } else {
          console.error("Failed to fetch playlist");
          alert("추천 플레이리스트를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlaylist();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Spotify 추천 음악</h1>

      {/* 로딩 중 */}
      {isLoading && <p>추천 플레이리스트를 불러오는 중입니다...</p>}

      {/* 플레이리스트 표시 */}
      {playlist && (
        <div>
          <h2>추천 플레이리스트: {playlist.name}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {playlist.tracks.map((track) => (
              <div
                key={track.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  width: "100%",
                }}
              >
                <img
                  src={track.albumArt}
                  alt={track.name}
                  style={{ width: "50px", height: "50px" }}
                />
                <div>
                  <p style={{ margin: 0 }}>{track.name}</p>
                  <p style={{ fontSize: "12px", color: "gray", margin: 0 }}>
                    {track.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 플레이리스트가 없을 때 */}
      {!playlist && !isLoading && (
        <p>추천받을 플레이리스트가 없습니다. 일기를 먼저 작성해주세요.</p>
      )}
    </div>
  );
};

export default MusicRecommendation;
