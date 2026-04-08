import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Utility for staggered list animations.
 * Wrap a list container with StaggerContainer and each item with StaggerItem.
 */

type StaggerContainerProps = {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
  },
};

export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.03,
}: StaggerContainerProps) => (
  <motion.div
    variants={{
      initial: {},
      animate: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.02,
        },
      },
    }}
    initial="initial"
    animate="animate"
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.div variants={staggerItemVariants} className={className}>
    {children}
  </motion.div>
);
