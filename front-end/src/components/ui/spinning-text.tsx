"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from 'next/image';

type SpinningTextProps = {
  text: string;
  radius?: number;
  fontSize?: number;
  speed?: number;
  direction?: "normal" | "reverse";
  className?: string;
  children?: React.ReactNode;
};

const SpinningText: React.FC<SpinningTextProps> = ({
  text,
  radius = 50,
  fontSize = 12,
  speed = 10,
  direction = "normal",
  className,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const characters = text.split("");
  const totalChars = characters.length;
  const angleStep = 360 / totalChars;

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          rotate: direction === "normal" ? 360 : -360,
        }}
        transition={{
          duration: isHovered ? speed / 2 : speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative flex items-center justify-center"
        style={{ width: radius * 2, height: radius * 2 }}
      >
        {characters.map((char, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-0 font-medium uppercase tracking-tighter"
            style={{
              height: radius,
              transform: `translateX(-50%) rotate(${i * angleStep}deg)`,
              fontSize: fontSize,
              transformOrigin: `center ${radius}px`,
            }}
          >
            {char}
          </span>
        ))}
      </motion.div>
      <div className="absolute flex items-center justify-center">
        {children || (
          <Star className="text-primary fill-primary" size={radius / 2} />
        )}
      </div>
    </div>
  );
};

  const SpinningText02 = () => {
    return (
      <div className="">
        <SpinningText
          text="•Start•Conversation"
          radius={100}
          fontSize={12}
          speed={20}
          direction="reverse"
          className="text-primary font-medium font-eng-display tracking-tighter"
        >
          <div className="size-10  flex items-center justify-center">
            <Image src="/logo.svg" alt="Image"  fill priority className="fill-primary text-primary animate-pulse"/>
            {/* <Image src='/blue-bg.png' alt='Fabric Texture' fill priority sizes='100vw' className=' object-repeat opacity-70' /> */}
          </div>
        </SpinningText>
      </div>
    );
  };

  export default SpinningText02;
