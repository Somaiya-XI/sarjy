'use client';
import {useCallback, useEffect, useRef} from 'react';

/** Stable getFrequencies() backed by an AnalyserNode on a MediaStreamTrack (the agent's voice). */
export function useTrackFrequencies(track: MediaStreamTrack | undefined | null) {
  const analyser = useRef<AnalyserNode | null>(null);
  const buf = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!track) return;
    const ac = new AudioContext();
    const node = ac.createAnalyser();
    node.fftSize = 512;
    node.smoothingTimeConstant = 0.8;
    const src = ac.createMediaStreamSource(new MediaStream([track]));
    src.connect(node); // analysis only; playback stays with LiveKit's audio renderer
    analyser.current = node;
    buf.current = new Uint8Array(node.frequencyBinCount);
    ac.resume().catch(() => {});
    return () => {
      analyser.current = null;
      buf.current = null;
      src.disconnect();
      ac.close().catch(() => {});
    };
  }, [track]);

  return useCallback(() => {
    const a = analyser.current,
      b = buf.current;
    if (!a || !b) return null;
    a.getByteFrequencyData(b as Uint8Array<ArrayBuffer>);
    return b;
  }, []);
}
