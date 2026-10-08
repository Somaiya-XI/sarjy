
'use client';
import { SessionControlBar } from '@/components/ui/SessionControlBar';
import { VoiceAssistantUI } from "@/components/ui/VoiceAssistantUI";
import { LiveKitRoom, RoomAudioRenderer, } from '@livekit/components-react';
import '@livekit/components-styles';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EntranceIntro } from "../ui/EntranceIntro";
import SpinningText02 from "../ui/spinning-text";
export function HomeHero() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');
    const [phase, setPhase] = useState<'intro' | 'start'>('intro');


  useEffect(() => {
    if (phase !== 'intro') return;
    const t = setTimeout(() => setPhase('start'), 3800);
    return () => clearTimeout(t);
  }, [phase]);


  const startSession = async () => {
    try {
      const res = await fetch('/api/token');
      const data = await res.json();
      setToken(data.token);
      setUrl(process.env.NEXT_PUBLIC_LIVEKIT_URL || '');
    } catch (e) {
      console.error('Failed to get token', e);
    }
  };

  const leave = () => {
    setToken(null);
  };

  return (
    <section className="">
      {token ? (
        <LiveKitRoom
          serverUrl={url}
          token={token}
          connect={true}
          audio={true}
          video={false}
          onDisconnected={leave}
          className='flex flex-col items-center gap-6'
        >
          <VoiceAssistantUI />
          {/* Automatically plays the agent's incoming WebRTC audio track */}
          <RoomAudioRenderer />
          <SessionControlBar />
        </LiveKitRoom>
      ) :  (
        <div className="font-display font-bold flex flex-col items-center justify-center py-70">
          <AnimatePresence mode="wait">
            {phase === 'intro' ? (
              <div key="intro" onClick={() => setPhase('start')} className="cursor-pointer">
                <EntranceIntro />
              </div>
            ) : (
              <motion.div
                key="start"
                onClick={startSession}
                className="cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <SpinningText02 />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

