"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LocalTrack } from "./tracks";

export interface LocalPlayerApi {
  index: number;
  track: LocalTrack | null;
  playing: boolean;
  started: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  canSkip: boolean;
  play: () => void;
  toggle: () => void;
  select: (index: number) => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  prev: () => void;
}

export function useLocalPlayer(tracks: LocalTrack[]): LocalPlayerApi {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(70);

  const safeIndex = tracks.length
    ? Math.min(index, tracks.length - 1)
    : 0;
  const track = tracks[safeIndex] ?? null;

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onReset = () => {
      setCurrentTime(0);
      setDuration(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadstart", onReset);
    audio.addEventListener("emptied", onReset);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadstart", onReset);
      audio.removeEventListener("emptied", onReset);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (tracks.length === 0) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return;
    }
    audio.src = tracks[Math.min(index, tracks.length - 1)].src;
    audio.load();
  }, [tracks, index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(1, Math.max(0, volume / 100));
  }, [volume]);

  const next = useCallback(() => {
    setIndex((value) => (tracks.length > 0 ? (value + 1) % tracks.length : 0));
  }, [tracks.length]);

  const prev = useCallback(() => {
    setIndex((value) =>
      tracks.length > 0 ? (value - 1 + tracks.length) % tracks.length : 0,
    );
  }, [tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      if (tracks.length > 1) {
        next();
      } else {
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      }
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [tracks.length, next]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !started || tracks.length === 0) return;
    void audio.play().catch(() => {});
  }, [started, tracks, index]);

  const play = useCallback(() => {
    setStarted(true);
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    void audio.play().catch(() => {});
  }, [tracks.length]);

  const toggle = useCallback(() => {
    setStarted(true);
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;
    if (audio.paused) void audio.play().catch(() => {});
    else audio.pause();
  }, [tracks.length]);

  const select = useCallback((value: number) => setIndex(value), []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const setVolume = useCallback((value: number) => setVolumeState(value), []);

  return {
    index: safeIndex,
    track,
    playing,
    started,
    currentTime,
    duration,
    volume,
    canSkip: tracks.length > 1,
    play,
    toggle,
    select,
    seek,
    setVolume,
    next,
    prev,
  };
}
