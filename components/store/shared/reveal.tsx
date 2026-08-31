"use client";

import {
  motion,
  type Variants,
} from "framer-motion";

import type {
  ReactNode,
} from "react";

type RevealDirection =
  | "left"
  | "right"
  | "up"
  | "down"
  | "scale"
  | "fade";

type RevealProps = {
  children: ReactNode;
  className?: string;

  direction?: RevealDirection;

  delay?: number;
  duration?: number;

  distance?: number;

  scaleFrom?: number;

  once?: boolean;

  amount?: number;
};

const ease = [
  0.22,
  1,
  0.36,
  1,
] as const;

export function Reveal({
  children,
  className,

  direction = "up",

  delay = 0,
  duration = 0.65,

  distance = 40,

  scaleFrom = 0.9,

  once = true,

  amount = 0.2,
}: RevealProps) {
  const initial = {
    opacity: 0,

    ...(direction === "left"
      ? { x: -distance }
      : direction === "right"
        ? { x: distance }
        : direction === "up"
          ? { y: distance }
          : direction === "down"
            ? { y: -distance }
            : direction === "scale"
              ? {
                  scale:
                    scaleFrom,
                }
              : {}),
  };

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={visible}
      viewport={{
        once,
        amount,
      }}
      transition={{
        duration,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;

  stagger?: number;
  delay?: number;

  once?: boolean;
  amount?: number;
};

const groupVariants = (
  stagger: number,
  delay: number
): Variants => ({
  hidden: {},

  visible: {
    transition: {
      staggerChildren:
        stagger,
      delayChildren: delay,
    },
  },
});

export function RevealGroup({
  children,
  className,

  stagger = 0.08,
  delay = 0,

  once = true,
  amount = 0.15,
}: RevealGroupProps) {
  return (
    <motion.div
      variants={groupVariants(
        stagger,
        delay
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;

  direction?: RevealDirection;

  distance?: number;
  scaleFrom?: number;

  duration?: number;
};

export function RevealItem({
  children,
  className,

  direction = "up",

  distance = 30,

  scaleFrom = 0.9,

  duration = 0.55,
}: RevealItemProps) {
  const variants:
    Variants = {
    hidden: {
      opacity: 0,

      ...(direction ===
      "left"
        ? {
            x: -distance,
          }
        : direction ===
            "right"
          ? {
              x: distance,
            }
          : direction ===
              "up"
            ? {
                y: distance,
              }
            : direction ===
                "down"
              ? {
                  y: -distance,
                }
              : direction ===
                  "scale"
                ? {
                    scale:
                      scaleFrom,
                  }
                : {}),
    },

    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,

      transition: {
        duration,
        ease,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}