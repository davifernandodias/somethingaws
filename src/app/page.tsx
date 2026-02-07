import { ModeToggle } from '@/components/ui/mode-toggle';
import { QuizForm } from './_components/question-form';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 left-4 z-50">
        <ModeToggle />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-5">
        <QuizForm />
      </div>
    </main>
  );
}
