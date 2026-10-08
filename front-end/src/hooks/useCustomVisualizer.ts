import {type AgentState, type TrackReferenceOrPlaceholder} from '@livekit/components-react';
import {type LocalAudioTrack, type RemoteAudioTrack} from 'livekit-client';
import {useEffect, useRef, useState} from 'react';

export interface FrequencyBands {
  intensity: number; // Overall volume (0.0 - 1.0)
  bass: number; // Low frequencies (20Hz - 250Hz)
  mids: number; // Mid frequencies (250Hz - 2kHz)
  treble: number; // High frequencies (2kHz - 8kHz)
  speed: number; // Target rotation / motion speed multiplier
}

function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}

export function useCustomVisualizer(
  state: AgentState = 'connecting',
  audioTrack?: LocalAudioTrack | RemoteAudioTrack | TrackReferenceOrPlaceholder,
): FrequencyBands {
  const bandsRef = useRef<FrequencyBands>({
    intensity: 0,
    bass: 0,
    mids: 0,
    treble: 0,
    speed: 0.5,
  });

  const [bands, setBands] = useState<FrequencyBands>({
    intensity: 0,
    bass: 0,
    mids: 0,
    treble: 0,
    speed: 0.5,
  });

  // Target speed according to LiveKit Agent State
  useEffect(() => {
    let targetSpeed = 0.5;
    switch (state) {
      case 'thinking':
        targetSpeed = 2.8;
        break;
      case 'speaking':
        targetSpeed = 1.4;
        break;
      case 'listening':
        targetSpeed = 0.8;
        break;
      default:
        targetSpeed = 0.4;
        break;
    }
    bandsRef.current.speed = targetSpeed;
  }, [state]);

  // Audio Analyzer setup extracting 3 frequency bands
  useEffect(() => {
    const actualTrack = (audioTrack as TrackReferenceOrPlaceholder)?.publication?.track ?? audioTrack;
    const mediaStreamTrack = (actualTrack as LocalAudioTrack | RemoteAudioTrack)?.mediaStreamTrack;

    if (!mediaStreamTrack) {
      bandsRef.current = {intensity: 0, bass: 0, mids: 0, treble: 0, speed: bandsRef.current.speed};
      setBands(bandsRef.current);
      return;
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationFrameId: number;

    const analyze = () => {
      analyser.getByteFrequencyData(dataArray);

      // Split FFT spectrum into Bass, Mids, and Treble ranges
      const bassBins = dataArray.slice(0, Math.floor(bufferLength * 0.15));
      const midBins = dataArray.slice(Math.floor(bufferLength * 0.15), Math.floor(bufferLength * 0.6));
      const trebleBins = dataArray.slice(Math.floor(bufferLength * 0.6));

      const avg = (arr: Uint8Array) => arr.reduce((sum, val) => sum + val, 0) / (arr.length || 1);

      const rawBass = Math.min(1.0, avg(bassBins) / 200);
      const rawMids = Math.min(1.0, avg(midBins) / 160);
      const rawTreble = Math.min(1.0, avg(trebleBins) / 120);
      const rawIntensity = Math.min(1.0, avg(dataArray) / 140);

      // Lerp for smooth state transitions at 60 FPS
      const current = bandsRef.current;
      current.bass = lerp(current.bass, rawBass, 0.2);
      current.mids = lerp(current.mids, rawMids, 0.2);
      current.treble = lerp(current.treble, rawTreble, 0.25);
      current.intensity = lerp(current.intensity, rawIntensity, 0.2);

      setBands({...current});
      animationFrameId = requestAnimationFrame(analyze);
    };

    analyze();

    return () => {
      cancelAnimationFrame(animationFrameId);
      source.disconnect();
      audioContext.close();
    };
  }, [audioTrack]);

  return bands;
}
