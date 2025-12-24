"use client"

import { useActionState } from 'react';
import { sendQuestion } from '../action-get-question';
import { InitialState } from './initial-page';



export function FormQuestionQuiz() {


    const [state, formAction, isPending] = useActionState(sendQuestion, null);


    return (
        <>
            <form action={formAction} className='bg-white text-black flex flex-col gap-4 p-4 rounded shadow-md'>

                {/* Estado inicial do quiz */}
                { state === null && (
                    <>
                        <InitialState />
                    </>
                )}


                {state !== null && (
                    <>
                    {state.questions.length > 0 && !state.error && (
                       state.questions.map((question: any) => (
                        <div key={question.id} style={{ marginTop: '20px' }} className='bg-red-500'>

                            <h1>{question.title}</h1>
                            <h3>{question.group_by_topic}</h3>
                            {question.response.map((resp: any, index: number) => (
                                <div key={index} className='flex flex-col gap-2 bg-yellow-200'>
                                    <div className='flex gap-1.5'>
                                        <input type="checkbox"  name={`answers[${question.id}]`} value={index}/>
                                        <label>{resp.alternative}</label>
                                    </div>
                                    <div>
                                        {state.validated && (
                                            <span className={ resp.rep ? 'text-green-800' : 'text-red-800'}>{resp.because}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                       ))
                    )}

                    {state.validated && state.isCorrect && (
                        <div className='bg-green-200 text-green-800 p-2 rounded'>
                            Parabéns! Você acertou a pergunta.
                        </div>
                    )}


                    {state.validated && !state.isCorrect && (
                        <div className='bg-red-200 text-red-800 p-2 rounded'>
                            Que pena! Você errou a pergunta. As respostas corretas são:
                            <ul>
                                {state.correctIndexes.map((index: number) => (
                                    <li key={index}>{state.questions[0].response[index].alternative}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {state.error && (
                        <div className='bg-red-200 text-red-800 p-2 rounded'>
                            {state.message}
                        </div>
                    )}

                    {state.buttonText && (
                        <input type="button" value={state.buttonText} className="cursor-pointer hover:bg-red-300" onClick={() => localStorage.clear()}/>
                    )}
                    </>
                )}

                <button type="submit" disabled={((state && state.error) || isPending)} className='cursor-pointer hover:bg-red-300'>{isPending ? "Carregando..." : "Iniciar Quiz"}</button>

            </form>
        </>
    )
}