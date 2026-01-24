import { ModeToggle } from '@/components/ui/mode-toggle';
import { FormQuestionQuiz } from './_components/form-question';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="absolute top-4 left-4 z-50">
        <ModeToggle />
      </div>

      <div className="grid h-screen place-items-center">
        <FormQuestionQuiz />
      </div>
    </main>
  );
}
