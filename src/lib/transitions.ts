import type { Variants } from 'motion/react'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export const containerVariants: Variants = {
  animate: { transition: { staggerChildren: 0.05 } },
}

export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
}

export const screenVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: EASE } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
}
