import React, { useState, useEffect } from "react";
import "C:/Program Files/OSS-Project/react-calendar/src/Styles/MusicRecommendation.css";

const MusicRecommendation = () => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch("/api/recommendations"); // 백엔드 API 호출
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return <p className="loading-message">Loading recommendations...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (tracks.length === 0) {
    return <p className="no-data-message">No recommendations available.</p>;
  }

  return (
    <div className="music-recommendation-container">
      <h1 className="title">Spotify Music Recommendations</h1>
      <ul className="track-list">
        {tracks.map((track) => (
          <li key={track.id} className="track-item">
            <h3>{track.name}</h3>
            <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
            <iframe
              src={`https://open.spotify.com/embed/track/${track.id}`}
              width="300"
              height="80"
              style={{border:"none"}}
              allowtransparency="true"
              allow="encrypted-media"
              title={track.name}
            ></iframe>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicRecommendation;
