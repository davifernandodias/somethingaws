'use client';
import { useActionState, useCallback, useEffect, useReducer, useRef, useMemo } from 'react';
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
import { useControlPointsTopicsQuestions } from '../../../store-data-config';
import { hasSelectedRequiredOptions } from '../../../utils/has-selected-required-options';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

const getTimestamp = () => performance.now();

const TOAST_COOLDOWN_MS = 10_000;
const MAX_TOAST_ALERTS = 5;
const SUBMIT_COOLDOWN_MS = 4000;

export function QuizForm() {
  const fundamental = useControlPointsTopicsQuestions((state) => state.fundamental_cloud_concepts);
  const security = useControlPointsTopicsQuestions((state) => state.security_compliance);
  const technology = useControlPointsTopicsQuestions((state) => state.cloud_technology);
  const billing = useControlPointsTopicsQuestions((state) => state.billing_pricing_support);

  const topicsScore = useMemo(
    () => ({
      fundamental_cloud_concepts: fundamental,
      security_compliance: security,
      cloud_technology: technology,
      billing_pricing_support: billing,
    }),
    [fundamental, security, technology, billing]
  );

  const actionWithTopics = useCallback(
    (state: QuestionState | null, formData: FormData) => sendQuestion(state, formData, topicsScore),
    [topicsScore]
  );

  const [state, formAction, isPending] = useActionState<QuestionState | null, FormData>(
    actionWithTopics,
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
      <Input
        name="amount_limit_questions"
        type="hidden"
        value={stateReducer.amountLimitQuestions}
        readOnly
      />
      {state !== null && (
        <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-6">
          {/* Header + Progresso */}
          {state.currentQuestionCount > 0 && !state.error && (
            <>
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-muted-foreground text-sm font-medium tracking-wide">
                  PERGUNTA {state.currentQuestionCount} DE {stateReducer.amountLimitQuestions}
                </span>
              </motion.div>

              <motion.div
                className="origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <Progress
                  value={state.currentQuestionCount}
                  max={stateReducer.amountLimitQuestions}
                  className="bg-muted/30 h-1.5 rounded-full"
                />
              </motion.div>
            </>
          )}

          {/* Pergunta */}
          {state.questions?.map((question: Question) => (
            <motion.div
              key={question.id}
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-2xl leading-tight font-semibold text-balance">
                {question.title}
              </h1>

              {/* Alternativas */}
              <div className="space-y-4">
                {question.response.map((resp: any, index: number) => {
                  const isSelected = stateReducer.selectedAnswers[question.id]?.includes(index);

                  const feedbackBg =
                    state.validated && isSelected
                      ? resp.rep
                        ? 'bg-green-500/10'
                        : 'bg-red-500/10'
                      : 'bg-card/30';

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + index * 0.1,
                        ease: 'easeOut',
                      }}
                      className="group"
                    >
                      <div
                        className={`flex cursor-pointer items-start gap-4 rounded-xl p-4 transition-all duration-300 ${feedbackBg} hover:bg-card/60`}
                      >
                        <Input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4"
                          checked={isSelected || false}
                          onChange={() => handleControlSelectionAlternatives(question, index)}
                          disabled={state.validated}
                        />

                        <span className="flex-1 text-base leading-relaxed font-semibold">
                          {resp.alternative}
                        </span>
                      </div>

                      {/* Feedback animado */}
                      <AnimatePresence>
                        {state.validated && isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{
                              duration: 0.5,
                              ease: 'easeInOut',
                            }}
                            className="overflow-hidden"
                          >
                            <div
                              className={`mt-3 rounded-lg p-4 ${resp.rep ? 'bg-green-500/10' : 'bg-red-500/10'} `}
                            >
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className={`text-sm leading-relaxed ${
                                  resp.rep ? 'text-green-800' : 'text-red-800'
                                }`}
                              >
                                {resp.because}
                              </motion.span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-9">
        <Button
          type="submit"
          disabled={
            isPending ||
            (state !== null && (state.error || !hasSelectedRequiredOptions(state, stateReducer)))
          }
          onClick={(e) => {
            if (state !== null && state.disabledButton) {
              e.preventDefault();
              window.location.reload();
            }
          }}
          className="cursor-pointer"
        >
          {isPending
            ? 'Carregando...'
            : !state
              ? 'Começar quiz'
              : state.error
                ? 'Erro'
                : state.disabledButton
                  ? 'Recomeçar'
                  : !state.validated
                    ? 'Responder pergunta'
                    : 'Próxima pergunta'}
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
