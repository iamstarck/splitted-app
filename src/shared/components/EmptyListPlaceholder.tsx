import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyListPlaceholderProps {
  message: string;
  subMessage?: string;
  icon: ReactNode;
}

const EmptyListPlaceholder = ({
  message,
  subMessage,
  icon: Icon,
}: EmptyListPlaceholderProps) => {
  return (
    <motion.div
      className="flex flex-col items-center text-muted-foreground gap-2 select-none py-16 text-center"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {Icon}
      </motion.div>
      <div>
        <p className="font-semibold">{message}</p>
        {subMessage && <p>{subMessage}</p>}
      </div>
    </motion.div>
  );
};

export default EmptyListPlaceholder;
