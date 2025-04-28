import { useRef, useState, useEffect } from "react";

interface VideoPreviewProps {
  videoUrl: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Update the video source when videoUrl changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.load(); // Reload the video to apply the new source
    }
  }, [videoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-[370px] p-4 mt-5 relative w-full max-w-2xl rounded-lg overflow-hidden shadow-lg border border-gray-900 bg-black">
        <video
          ref={videoRef}
          className="w-full h-auto rounded cursor-pointer"
          onClick={togglePlay}
          controls={true}
          muted
          disablePictureInPicture
          disableRemotePlayback
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload noplaybackrate"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play Button Overlay (Shows only when video is paused) */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition duration-300"
          >
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 4l12 6-12 6V4z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;