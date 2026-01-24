'use client';
import { useActionState, useEffect, useReducer, useRef } from 'react';
import { sendQuestion } from '../action-get-question';
import { toast } from 'sonner';
import InitialState from './initial-page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { reducer } from '../../../reducer/config-quiz-reducer';
import { defineButtonState } from '../../../utils/define-button-state';
import { checkStateButton, isCheckOptions } from '../../../utils/enable-or-disabled-button';
import { useControlPointsTopicsQuestions } from '../../../store-data-config';

const getTimestamp = () => performance.now();

const TOAST_COOLDOWN_MS = 10_000;
const MAX_TOAST_ALERTS = 5;
const SUBMIT_COOLDOWN_MS = 4000;

export function QuizForm() {
  const [state, formAction, isPending] = useActionState<QuestionState | null, FormData>(
    sendQuestion,
    null
  );
  const [stateReducer, dispatch] = useReducer(reducer, {
    openModalConfiguration: false,
    selectedAnswers: {},
    amountLimitQuestions: 10,
    disabledCoolDown: false,
  });

  const toastControlRef = useRef({ count: 0, lastShownAt: 0 });
  const submitCooldownRef = useRef<{ locked: boolean; timeoutId: NodeJS.Timeout | null }>({
    locked: false,
    timeoutId: null,
  });

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.message);
    if (state.modalAlert && state.buttonText) toast.info(state.message);
    if (state.validated && state.isCorrect) toast.info(state.message);
    if (state.validated && !state.isCorrect) toast.info(state.message);
    if (state.disabledButton) toast.warning(state.message);

    if (state.validated && !submitCooldownRef.current.locked) {
      submitCooldownRef.current.locked = true;
      dispatch({ type: 'controls_disabled_button' });

      submitCooldownRef.current.timeoutId = setTimeout(() => {
        submitCooldownRef.current.locked = false;
        dispatch({ type: 'controls_enable_button' });
      }, SUBMIT_COOLDOWN_MS);
    }
  }, [state]);

  function handleControlSelectionAlternatives(question: Question, index: number) {
    if (state?.validated) return;
    const current = stateReducer.selectedAnswers[question.id] || [];
    const max = question.accept_two_alternatives ? 2 : 1;

    if (!current.includes(index) && current.length >= max) {
      const now = getTimestamp();
      const { count, lastShownAt } = toastControlRef.current;

      if (count >= MAX_TOAST_ALERTS || now - lastShownAt < TOAST_COOLDOWN_MS) {
        return;
      }

      toast.warning(
        question.accept_two_alternatives
          ? 'Você só pode selecionar duas alternativas.'
          : 'Você só pode selecionar apenas uma alternativa.'
      );
      toastControlRef.current = { count: count + 1, lastShownAt: now };
      return;
    }

    dispatch({
      type: 'controls_quantity_selection_alternatives',
      payload: { questionId: question.id, index, acceptTwo: question.accept_two_alternatives },
    });
  }

  return (
    <form action={formAction}>
      {state === null && (
        <div className="flex h-80 items-start">
          <InitialState />
        </div>
      )}
      {/* Input hidden, to control passing the number of questions to the action in formData. */}
      <Input
        name="amount_limit_questions"
        type="hidden"
        value={stateReducer.amountLimitQuestions}
        readOnly
      />
      {state !== null && (
        <>
          {state.questions?.length > 0 &&
            !state.error &&
            state.questions.map((question: Question) => (
              <div key={question.id} className="mt-5">
                <h1 className="text-lg font-bold">{question.title}</h1>
                <h3 className="mb-3 text-sm text-gray-600">{question.group_by_topic}</h3>

                {question.response?.map((resp: QuestionResponse, index: number) => (
                  <div key={index} className="mb-3 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="checkbox"
                        name={`answers[${question.id}]`}
                        value={index}
                        className="h-4 w-4"
                        checked={
                          stateReducer.selectedAnswers[question.id]?.includes(index) || false
                        }
                        onChange={() => handleControlSelectionAlternatives(question, index)}
                      />
                      <Label className="cursor-pointer">{resp.alternative}</Label>
                    </div>
                    {state.validated && (
                      <span
                        className={resp.rep ? 'text-sm text-green-800' : 'text-sm text-red-800'}
                      >
                        {resp.because}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}

          {state.buttonText && state.modalAlert && (
            <div className="flex flex-col gap-2 rounded bg-blue-100 p-3 text-blue-800">
              <p>{state.message}</p>
              <Button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  toast.success('Dados limpos!');
                  window.location.reload();
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {state.buttonText}
              </Button>
            </div>
          )}
        </>
      )}

      <div className="flex justify-center gap-9">
        <Button type="submit" disabled={isPending} className="cursor-pointer">
          {defineButtonState(state, isPending)}
        </Button>

        {state === null && (
          <Button
            type="button"
            onClick={() => {
              dispatch({ type: 'open_modal_config_quiz', payload: true });
            }}
            className="cursor-pointer bg-gray-800 hover:bg-gray-700 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-700"
          >
            Configurações
          </Button>
        )}
      </div>

      {stateReducer.openModalConfiguration && (
        <Dialog
          open={stateReducer.openModalConfiguration}
          onOpenChange={(open) => dispatch({ type: 'open_modal_config_quiz', payload: open })}
        >
          <DialogContent className="w-full max-w-md rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Configurações do Quiz</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Ajuste as opções antes de iniciar o quiz.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex gap-4 space-y-2">
              <Label htmlFor="questions">Número de perguntas:</Label>
              <Input
                name="range_number"
                type="number"
                min={1}
                max={20}
                value={stateReducer.amountLimitQuestions}
                onChange={(e) =>
                  dispatch({ type: 'controls_limite_questions', payload: e.target.value })
                }
                className="w-22"
                placeholder="Ex: 10"
              />
            </div>

            <DialogFooter className="mt-8 flex gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => dispatch({ type: 'open_modal_config_quiz', payload: false })}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  dispatch({ type: 'open_modal_config_quiz', payload: false });
                }}
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
}
