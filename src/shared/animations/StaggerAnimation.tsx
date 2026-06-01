import { domAnimation, LazyMotion, m, Variants } from "motion/react"
import { ReactNode } from "react"

type StaggerContainerProps = {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
  }
}

export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.03
}: StaggerContainerProps) => (
  <LazyMotion features={domAnimation}>
    <m.div
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.02
          }
        }
      }}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </m.div>
  </LazyMotion>
)

export const StaggerItem = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => (
  <m.div variants={staggerItemVariants} className={className}>
    {children}
  </m.div>
)
