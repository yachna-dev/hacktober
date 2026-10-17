"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  destroy: () => void;
}

interface YTState {
  PLAYING: number;
  PAUSED: number;
  ENDED: number;
  BUFFERING: number;
  CUED: number;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId?: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: () => void;
      };
    },
  ) => YTPlayer;
  PlayerState: YTState;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_SRC = "https://www.youtube.com/iframe_api";

export interface YouTubePlayerApi {
  ready: boolean;
  playing: boolean;
  started: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
}

export function useYouTubePlayer(
  containerRef: RefObject<HTMLDivElement | null>,
  videoId: string,
  trackCount: number,
  onEnded: () => void,
  onNext: () => void,
): YouTubePlayerApi {
  const playerRef = useRef<YTPlayer | null>(null);
  const endedRef = useRef(onEnded);
  const nextRef = useRef(onNext);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(70);

  useEffect(() => {
    endedRef.current = onEnded;
    nextRef.current = onNext;
  });

  useEffect(() => {
    let cancelled = false;

    const create = () => {
      if (cancelled || !containerRef.current || playerRef.current || !window.YT) {
        return;
      }
      const yt = window.YT;
      playerRef.current = new yt.Player(containerRef.current, {
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (event) => {
            const state = window.YT?.PlayerState;
            if (!state) return;
            if (event.data === state.PLAYING) setPlaying(true);
            else if (event.data === state.PAUSED) setPlaying(false);
            else if (event.data === state.ENDED) {
              setPlaying(false);
              if (trackCount > 1) nextRef.current();
              else endedRef.current();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      create();
    } else {
      if (!document.getElementById("yt-iframe-api")) {
        const script = document.createElement("script");
        script.id = "yt-iframe-api";
        script.src = API_SRC;
        document.head.appendChild(script);
      }
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        create();
      };
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [trackCount, containerRef]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !ready) return;
    if (started) {
      player.loadVideoById(videoId);
    } else {
      player.cueVideoById(videoId);
    }
  }, [ready, videoId, started]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime() || 0);
      setDuration(player.getDuration() || 0);
    }, 300);
    return () => window.clearInterval(id);
  }, [ready]);

  useEffect(() => {
    playerRef.current?.setVolume(Math.round(volume));
  }, [volume, ready]);

  const play = useCallback(() => {
    if (!started) {
      setStarted(true);
      return;
    }
    playerRef.current?.playVideo();
  }, [started]);

  const toggle = useCallback(() => {
    if (!started) {
      setStarted(true);
      return;
    }
    if (playing) playerRef.current?.pauseVideo();
    else playerRef.current?.playVideo();
  }, [started, playing]);

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
  }, []);

  return {
    ready,
    playing,
    started,
    currentTime,
    duration,
    volume,
    play,
    toggle,
    seek,
    setVolume,
  };
}
