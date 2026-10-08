'use client';
import {useCallback, useEffect, useRef, useState} from 'react';

/** Microphone-only analyser for demos without a LiveKit call. */
export function useMicFrequencies() {
  const [active, setActive] = useState(false);
  const analyser = useRef<AnalyserNode | null>(null);
  const buf = useRef<Uint8Array | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    cleanup.current?.();
    cleanup.current = null;
    analyser.current = null;
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {echoCancellation: true, noiseSuppression: true},
      });
      const ac = new AudioContext();
      const node = ac.createAnalyser();
      node.fftSize = 512;
      node.smoothingTimeConstant = 0.8;
      ac.createMediaStreamSource(stream).connect(node);
      analyser.current = node;
      buf.current = new Uint8Array(node.frequencyBinCount);
      cleanup.current = () => {
        stream.getTracks().forEach((t) => t.stop());
        ac.close().catch(() => {});
      };
      setActive(true);
    } catch {
      setActive(false);
    }
  }, []);

  useEffect(() => stop, [stop]);

  const getFrequencies = useCallback(() => {
    const a = analyser.current,
      b = buf.current;
    if (!a || !b) return null;
    a.getByteFrequencyData(b as Uint8Array<ArrayBuffer>);
    return b;
  }, []);

  return {active, start, stop, getFrequencies};
}
