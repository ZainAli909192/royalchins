"use client";

import {
  motion,
  type Variants,
} from "framer-motion";

import type {
  ReactNode,
} from "react";

type MotionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const easing = [
  0.22,
  1,
  0.36,
  1,
] as const;

export function FadeIn({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.55,
        delay,
        ease: easing,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FromLeft({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -45,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.65,
        delay,
        ease: easing,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FromRight({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 45,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.65,
        delay,
        ease: easing,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: easing,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    y: 24,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

export function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={
        containerVariants
      }
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={
        itemVariants
      }
      className={
        className
      }
    >
      {children}
    </motion.div>
  );
}