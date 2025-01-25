'use client';

import { motion } from 'framer-motion';

const AnimatedTitle = () => (
  <motion.div
    className="text-3xl font-bold"
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', duration: 1 }}
  >
    Pretendard 테스트 제목
  </motion.div>
);

export default AnimatedTitle;
