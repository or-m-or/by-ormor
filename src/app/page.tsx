import AnimatedParagraph from '@/components/motion/AnimatedParagraph';
import AnimatedTitle from '@/components/motion/AnimatedTitle';

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center font-pretendard">
      <AnimatedTitle />
      <AnimatedParagraph />
    </main>
  );
}
