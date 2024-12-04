import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Styles/musicrecommendation.css";

const MusicRecommendation = () => {
  const location = useLocation();
  const { emotionType } = location.state || {};
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

  // Spotify Access Token 가져오기
  const fetchSpotifyToken = async () => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
        },
        body: "grant_type=client_credentials",
      });

      if (response.ok) {
        const data = await response.json();
        return data.access_token;
      } else {
        throw new Error("Failed to fetch Spotify token");
      }
    } catch (error) {
      console.error("Error fetching Spotify token:", error);
      setError("Spotify 인증에 실패했습니다.");
      return null;
    }
  };

  // Spotify 추천 음악 가져오기
  const fetchRecommendations = async (token, genre) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTracks(data.tracks);
      } else {
        throw new Error("Failed to fetch Spotify recommendations");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("추천 음악을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getMusicRecommendations = async () => {
      if (!emotionType) {
        setError("주요 감정 데이터가 없습니다.");
        setLoading(false);
        return;
      }

      const genreMap = {
        happiness: "happy",
        sadness: "sad",
        anger: "angry",
        fear: "ambient",
        surprise: "upbeat",
        disgust: "calm",
      };

      const genre = genreMap[emotionType] || "pop"; // 기본 장르: pop
      const token = await fetchSpotifyToken();

      if (token) {
        await fetchRecommendations(token, genre);
      }
    };

    getMusicRecommendations();
  }, [emotionType]);

  if (loading) {
    return <p className="loading-message">추천 음악을 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="music-recommendation-container">
      <h1 className="title">Spotify 추천 음악</h1>

      {tracks.length > 0 ? (
        <ul className="track-list">
          {tracks.map((track) => (
            <li key={track.id} className="track-item">
              <img
                src={track.album.images[0]?.url || ""}
                alt={track.name}
                className="track-album-art"
              />
              <h3>{track.name}</h3>
              <p>{track.artists[0]?.name}</p>
              {/* Spotify 웹 플레이어 삽입 */}
              <iframe
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="300"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
                allowTransparency="true"
                title={track.name}
              ></iframe>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data-message">추천받을 음악이 없습니다.</p>
      )}
    </div>
  );
};

export default MusicRecommendation;

