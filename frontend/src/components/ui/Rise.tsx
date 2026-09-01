import { motion, type HTMLMotionProps } from 'framer-motion'
import { inView, rise } from '../../lib/motion'

export function Rise({ delay = 0, children, ...rest }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={inView} variants={rise} transition={{ delay }} {...rest}>
      {children}
    </motion.div>
  )
}
