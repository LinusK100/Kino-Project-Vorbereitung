import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Film } from 'lucide-react'
import { pageVariants } from '@/lib/transitions'

export default function NotFoundPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
    >
      <Film size={48} style={{ color: '#01696f' }} className="mb-4 opacity-50" />
      <h2
        className="text-5xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
      >
        404
      </h2>
      <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
        Diese Seite wurde nicht gefunden.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-lg font-medium text-sm text-white transition-opacity hover:opacity-90"
        style={{ background: '#01696f' }}
      >
        Zur Übersicht
      </Link>
    </motion.div>
  )
}
