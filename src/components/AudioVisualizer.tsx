import React, { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioLevels?: number[];
  barCount?: number;
  colorClass?: string;
  compact?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  audioLevels,
  barCount = 36,
  compact = false,
}) => {
  const [syntheticHeights, setSyntheticHeights] = useState<number[]>([]);

  useEffect(() => {
    setSyntheticHeights(Array.from({ length: barCount }, () => 3));
  }, [barCount]);

  useEffect(() => {
    if (audioLevels && audioLevels.length > 0) return;

    if (!isRecording) {
      setSyntheticHeights(Array.from({ length: barCount }, () => 3));
      return;
    }

    const interval = setInterval(() => {
      setSyntheticHeights(
        Array.from({ length: barCount }, (_, i) => {
          const wave = Math.sin(i * 0.45 + Date.now() * 0.008) * 0.5 + 0.5;
          const jitter = Math.random() * 0.6 + 0.2;
          return Math.max(2, Math.round(wave * jitter * (compact ? 14 : 20)));
        })
      );
    }, 60);

    return () => clearInterval(interval);
  }, [isRecording, barCount, audioLevels, compact]);

  const activeHeights =
    audioLevels && audioLevels.length === barCount
      ? audioLevels.map((v) => Math.max(2, Math.min(compact ? 14 : 22, Math.round(v * 0.35))))
      : syntheticHeights;

  return (
    <div
      className={`flex items-center justify-center gap-[3px] ${
        compact ? 'h-5 px-1' : 'h-8 px-3 py-1 rounded-lg border border-border bg-background'
      }`}
    >
      {activeHeights.map((height, idx) => (
        <div
          key={idx}
          className="w-[2px] rounded-full bg-gradient-to-t from-[#A55534] to-[#C68C6E] transition-all duration-75"
          style={{
            height: `${isRecording ? height : 2}px`,
            opacity: isRecording ? (height > 6 ? 0.9 : 0.45) : 0.25,
          }}
        />
      ))}
    </div>
  );
};
