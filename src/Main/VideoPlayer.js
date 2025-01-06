import React, { useEffect, useRef } from "react";
import videojs from "video.js"; // Import Video.js
import "video.js/dist/video-js.css"; // Import Video.js CSS

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null); // Ref for the video DOM element
  const playerRef = useRef(null); // Ref for the Video.js player instance

  useEffect(() => {
    if (!playerRef.current) {
      // Initialize Video.js player
      playerRef.current = videojs(videoRef.current, { liveui: true });
    }

    if (videoUrl) {
      // Set the source of the video player
      playerRef.current.src({ src: videoUrl, type: "application/x-mpegurl" });

      // Play the video
      playerRef.current.play().catch((err) => {
        console.error("Video playback failed:", err);
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose(); // Dispose of the Video.js player instance on unmount
        playerRef.current = null;
      }
    };
  }, [videoUrl]); // Re-run effect if videoUrl changes

  return (
    <div>
      <div data-vjs-player>
        <video
          ref={videoRef}
          id="live-video"
          className="video-js vjs-default-skin vjs-live vjs-liveui"
          width="640"
          height="360"
          controls
          muted
          src={videoRef}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
