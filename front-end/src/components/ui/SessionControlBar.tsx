'use client';
import {
  useLocalParticipant,
  useMediaDeviceSelect,
  useMultibandTrackVolume,
  useRoomContext,
  useTrackToggle,
} from '@livekit/components-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Track } from 'livekit-client';
import { Check, ChevronDown, Mic, MicOff, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const BARS = 12;

function MicWaveform({ active }: { active: boolean }) {
  const { localParticipant, microphoneTrack } = useLocalParticipant();

  const trackRef = microphoneTrack
    ? { participant: localParticipant, publication: microphoneTrack, source: Track.Source.Microphone }
    : undefined;

  // One volume (0..1) per bar, updated continuously from the mic
  const bands = useMultibandTrackVolume(trackRef, { bands: BARS, loPass: 100, hiPass: 600 });

  return (
    <div className="flex h-6 items-center gap-[3px]" aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => {
        const v = active ? (bands[i] ?? 0) : 0;
        const h = 4 + Math.sqrt(v) * 20; // 4px resting, up to 24px
        return (
          <span
            key={i}
            className="w-[3px] rounded-full bg-primary/80 transition-[height] duration-100 ease-out"
            style={{ height: h }}
          />
        );
      })}
    </div>
  );
}

export function SessionControlBar() {
  const room = useRoomContext();
  const { enabled, toggle, pending } = useTrackToggle({ source: Track.Source.Microphone });
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({ kind: 'audioinput' });

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close the dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div className="flex items-center gap-3">
      {/* Pill: mic toggle + waveform + device picker */}
      <div ref={menuRef} className="relative">
        <div className="glass flex items-center gap-1 rounded-full px-2 py-1.5 text-primary">
          <button
            type="button"
            onClick={() => toggle()}
            disabled={pending}
            aria-label={enabled ? 'Mute microphone' : 'Unmute microphone'}
            className="cursor-pointer flex size-9 items-center justify-center rounded-full transition hover:bg-primary/10"
          >
            {enabled ? <Mic className="size-5" /> : <MicOff className="size-5 opacity-60" />}
          </button>

          <MicWaveform active={enabled} />

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Choose microphone"
            aria-expanded={open}
            className="cursor-pointer flex size-9 items-center justify-center rounded-full transition hover:bg-primary/10"
          >
            <ChevronDown className={`size-5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Device menu, opens upward */}
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="glass absolute bottom-full left-0 mb-2 w-64 overflow-hidden rounded-2xl p-1 text-sm text-primary"
            >
              {devices.length === 0 && <li className="px-3 py-2 opacity-60">No microphones found</li>}
              {devices.map((d) => (
                <li key={d.deviceId}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMediaDevice(d.deviceId);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-primary/10"
                  >
                    <span className="truncate">{d.label || 'Microphone'}</span>
                    {d.deviceId === activeDeviceId && <Check className="size-4 shrink-0" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* End session */}
      <button
        type="button"
        onClick={() => room.disconnect()}
        aria-label="End session"
  className="glass glass-hover flex size-12 cursor-pointer items-center justify-center rounded-full text-primary"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
