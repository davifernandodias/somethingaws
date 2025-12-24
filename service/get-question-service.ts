import json_questions from "../data/json_question.json" assert { type: "json" };


export async function getQuestionService(id: number, level?: number, category?: string) {

    let questions = Array<any>();
    if(level && category){

        questions = json_questions.filter((question) => {
            return question.id === id && question.level_of_complexity === level && question.group_by_topic === category;
        });

        if(questions.length <= 0){
            return {
                questions: [],
                success: false,
                message: "Nenhuma questão encontrada para os filtros informados."
            }
        }
    }else{
        questions = json_questions.filter((question) => {
            return question.id === id;
        });

        if(questions.length <= 0){
            return {
                questions: [],
                success: false,
                message: "Nenhuma questão encontrada para os filtros informados."
            }
        }
    }

    return { questions: questions, success: true, message: "Questões encontradas com sucesso." };
}