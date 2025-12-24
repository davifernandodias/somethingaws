"use client"

import { useActionState, useEffect } from 'react';

import { sendQuestion } from '../action-get-question';

import { toast } from 'sonner';

import { InitialState } from './initial-page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



export function FormQuestionQuiz() {
    const [state, formAction, isPending] = useActionState(sendQuestion, null);


    useEffect(() => {
        if (!state) return;
        if (state.error) toast.error(state.message);
        if (state.modalAlert && state.buttonText) toast.info(state.message);
        if (state.validated && state.isCorrect) toast.info(state.message);
        if (state.validated && !state.isCorrect) toast.info(state.message);
    }, [state]);

    return (
        <form action={formAction}>
            {/* Estado inicial do quiz */}
            {state === null && <InitialState />}

            {state !== null && (
                <>
                    {state.questions?.length > 0 && !state.error && (
                        state.questions.map((question: any) => (
                            <div key={question.id} className='mt-5'>
                                <h1 className='font-bold text-lg'>{question.title}</h1>
                                <h3 className='text-sm text-gray-600 mb-3'>{question.group_by_topic}</h3>

                                {question.response?.map((resp: any, index: number) => (
                                    <div key={index} className='flex flex-col gap-2 mb-3'>
                                        <div className='flex gap-1.5 items-center'>
                                            <Input
                                                type='checkbox'
                                                name={`answers[${question.id}]`}
                                                value={index}
                                                className='w-4 h-4'
                                            />
                                            <Label className='cursor-pointer'>{resp.alternative}</Label>
                                        </div>

                                        {state.validated && (
                                            <span className={resp.rep ? 'text-green-800 text-sm' : 'text-red-800 text-sm'}>
                                                {resp.because}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}

                    {state.buttonText && state.modalAlert && (
                        <div className='flex flex-col bg-blue-100 text-blue-800 p-3 rounded gap-2'>
                            <p>{state.message}</p>
                            <Button
                                type='button'
                                onClick={() => {
                                    localStorage.clear();
                                    toast.success('Dados limpos!');
                                    window.location.reload();

                                }}
                                className='bg-blue-500 hover:bg-blue-600'
                            >
                                {state.buttonText}
                            </Button>
                        </div>
                    )}

                    {state.validated && state.isCorrect && (
                        <div className='bg-green-100 text-green-800 p-3 rounded'>✓ Parabéns! Você acertou a pergunta.</div>
                    )}
                </>
            )}

            <Button
                type="submit"
                disabled={((state && state.error) || isPending)}
                className='cursor-pointer'
            >
                {isPending ? "Carregando..." : "Iniciar Quiz"}
            </Button>
            { state == null && (
                <Button>Configurações</Button>
            )}
        </form>
    );
}