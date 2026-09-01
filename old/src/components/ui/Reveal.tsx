import { motion, type HTMLMotionProps } from 'framer-motion'
import { fadeUp, inView } from '../../lib/motion'

type RevealProps = HTMLMotionProps<'div'> & { delay?: number }

export function Reveal({ delay = 0, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={fadeUp}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
