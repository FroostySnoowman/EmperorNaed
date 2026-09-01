import { motion, type HTMLMotionProps } from 'framer-motion'
import { inView, riseItem, stagger } from '../../lib/motion'

type StaggerProps = HTMLMotionProps<'div'> & { delay?: number; gap?: number }

export function Stagger({ delay = 0, gap = 0.08, children, ...rest }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(delay, gap)}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={riseItem} {...rest}>
      {children}
    </motion.div>
  )
}
