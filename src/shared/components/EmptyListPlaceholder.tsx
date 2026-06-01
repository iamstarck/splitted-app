import type { ReactNode } from "react"
import { m } from "motion/react"

interface EmptyListPlaceholderProps {
  message: string
  subMessage?: string
  icon: ReactNode
}

const EmptyListPlaceholder = ({
  message,
  subMessage,
  icon: Icon
}: EmptyListPlaceholderProps) => {
  return (
    <m.div
      className="flex flex-col items-center text-muted-foreground gap-2 select-none py-16 text-center"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <m.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {Icon}
      </m.div>
      <div>
        <p className="font-semibold">{message}</p>
        {subMessage && <p>{subMessage}</p>}
      </div>
    </m.div>
  )
}

export default EmptyListPlaceholder
