'use client';

import { motion } from 'framer-motion';

const AnimatedParagraph = () => (
  <motion.div
    className="mt-4 font-light"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.5 }}
  >
    Pretendard 테스트 글꼴
  </motion.div>
);

export default AnimatedParagraph;
