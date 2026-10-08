'use client';

import { useTrackFrequencies } from '@/hooks/useTrackFrequencies';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-react';
import { FlowerVisualizer, type AgentState } from './FlowerVisualizer';

const SIZES = {icon: 28, sm: 72, md: 160, lg: 320, xl: 700} as const;

// LiveKit has more states than the garden: connecting/initializing read as "thinking", the rest as "idle".
const toGardenState = (s?: string): AgentState =>
  s === 'speaking' || s === 'thinking' || s === 'listening'
    ? s
    : s === 'connecting' || s === 'initializing' || s === 'pre-connect-buffering'
      ? 'thinking' // like LiveKit's aura
      : 'idle';

export interface AgentAudioVisualizerCustomProps {
  size?: keyof typeof SIZES | 'fill';
  /** `state` from useVoiceAssistant() */
  state?: string;
  /** `audioTrack` from useVoiceAssistant(): the agent's voice */
  audioTrack?: TrackReferenceOrPlaceholder;
  /** 0..1: how much the petals sway and reach (default .5) */
  complexity?: number;
  /** Optional: drive the petals from your own analyser (used by the mic demo) */
  getFrequencies?: () => Uint8Array | null;
  className?: string;
}

// @/components/ui/AgentCustomVisualizer.tsx

export function AgentAudioVisualizerCustom({
  size = 'xl',
  state = 'idle',
  audioTrack,
  complexity = 0.5,
  getFrequencies,
  className,
}: AgentAudioVisualizerCustomProps) {
  const fromTrack = useTrackFrequencies(audioTrack?.publication?.track?.mediaStreamTrack);

  return (
    <div
      className={`relative w-full aspect-square max-w-70 sm:max-w-100 md:max-w-125 lg:max-w-175 ${className ?? ''}`}
    >
      <FlowerVisualizer
        state={toGardenState(state)}
        getFrequencies={getFrequencies ?? fromTrack}
        complexity={complexity}
      />
    </div>
  );
}
