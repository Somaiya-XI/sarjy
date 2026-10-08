
'use client';
import { AgentAudioVisualizerCustom } from "@/components/ui/AgentCustomVisualizer";
import { Artwork } from "@/types/artwork";
import { useRoomContext, useVoiceAssistant } from '@livekit/components-react';
import '@livekit/components-styles';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArtworkCard } from "./ArtworkCard";

export function VoiceAssistantUI() {
  const { state, audioTrack } = useVoiceAssistant();
  const room = useRoomContext();
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const handleData = (payload: Uint8Array) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload));
        if (message.type === 'artwork_candidate' && message.artwork) {
          setArtwork(message.artwork);
        }
      } catch (error) {
        console.error('Failed to parse agent data:', error);
      }
    };
    room.on('dataReceived', handleData);
    return () => {
      room.off('dataReceived', handleData);
    };
  }, [room]);

  return (
    <div className="w-full max-w-7xl px-4 mx-auto py-20">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-30 w-full">
        {/* Flower Visualizer Container */}
        <motion.div
          className="w-full  flex flex-col justify-center items-center flex-1 max-w-lg lg:max-w-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          layout
        >
          <span className="text-sm text-muted-foreground font-body font-light">{state}..</span>
          <AgentAudioVisualizerCustom
            size="fill"
            state={state}
            audioTrack={audioTrack}
            complexity={0.7}
          />
        </motion.div>

        {/* Artwork Card Container */}
        <AnimatePresence mode="wait">
          {artwork && (
            <motion.div
              className="w-full flex-1 max-w-md lg:max-w-lg"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              layout
            >
              <ArtworkCard artwork={artwork} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


