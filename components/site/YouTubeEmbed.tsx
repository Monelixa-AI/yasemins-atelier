"use client";

import { useState, useCallback } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export default function YouTubeEmbed({
  videoId,
  title = "YouTube Video",
}: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const handlePlay = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
      {!isLoaded ? (
        <button
          onClick={handlePlay}
          className="group relative w-full h-full cursor-pointer"
          aria-label={`${title} videosunu oynat`}
        >
          {/* Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Koyu overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

          {/* Oynat butonu */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 group-hover:bg-red-500 rounded-full flex items-center justify-center transition-colors shadow-lg">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-7 h-7 sm:w-9 sm:h-9 ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Video basligi */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="font-body text-sm text-white truncate">{title}</p>
            </div>
          )}
        </button>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      )}
    </div>
  );
}
