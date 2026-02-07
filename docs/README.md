# Projeto Quiz — Documentação em Português (BR)

Este documento contém a mesma informação do README principal (em English), mas traduzida para o Português Brasileiro.

> Aviso: A versão em Inglês está no `README.md` na raiz do repositório.

## Índice
- Objetivo do projeto
- Regras de negócio (lógica do quiz)
- Estrutura de dados e arquivos
- Como o motor adaptativo funciona
- Parâmetros e configurações
- Guia do desenvolvedor
- Executando localmente
- Como adicionar/editar questões
- Testes e formatação
- Contribuição

## Objetivo do projeto

A aplicação é um quiz baseada em Next.js para ajudar estudantes a praticarem tópicos relacionados à AWS, adaptando a sequência de questões com base nos erros do aluno.

## Regras de negócio (lógica do quiz)

- A ideia central: o estudante pratica com base em seus erros. O sistema expõe mais questões dos tópicos em que o estudante erra.
- Cada questão tem `group_by_topic` e `level_of_complexity` (1..3).
- Quando o usuário erra, o sistema registra esse erro no tópico correspondente.
- A próxima questão é escolhida favorecendo tópicos com mais erros recentes.
- Regra de escape: se o usuário errar mais de duas vezes no mesmo tópico dentro de uma janela configurada, o sistema deverá escolher uma questão de outro tópico para evitar focar indefinidamente.
- `accept_two_alternatives`: algumas perguntas podem aceitar duas alternativas corretas quando apropriado.
- Pontuação, mensagens, janelas de análise e pesos são parametrizáveis (arquivos de configuração fornecem esses valores).

<img width="8437" height="10019" alt="Image" src="https://github.com/user-attachments/assets/8cbc8577-cc29-43ae-b39e-6f9ee8fb777f" />

## Estrutura de dados e arquivos

- `data/json_questions.json` — base de dados das questões.
- `@types/question.d.ts` — tipos TypeScript das questões.
- `src/app/_components/` — componentes React (ex.: `question-form.tsx`).
- `service/` — serviços de busca e geração de questões.
- `reducer/` — estado do quiz e configuração do reducer.
- `utils/` — utilitários para seleção de questões, scoring e manipulação de estado.
- `scripts/` — scripts utilitários de geração/refatoração de questões.

## Como o motor adaptativo funciona (resumo)

1. Usuário responde uma questão.
2. Aplicação registra acerto/erro.
3. Em caso de erro, incrementa contador de erros do tópico e registra tentativa recente.
4. Gera lista ponderada de tópicos; tópicos com mais erros têm peso maior.
5. Filtra questões por dificuldade e exposição recente.
6. Se um tópico tem mais de duas falhas recentes, aplica "escape rule" e escolhe outro tópico.
7. Apresenta a próxima questão.

## Parâmetros e configurações

Os parâmetros relevantes estão em `store-data-config.ts` e `reducer/config-quiz-reducer.ts`, tais como:
- tamanho da janela de tentativas recentes
- limiar para regra de escape (ex.: 2)
- fatores de peso para priorização de tópicos
- permitir duas alternativas corretas
- regras de pontuação

Ajuste estes arquivos para alterar o comportamento do motor.

## Guia do desenvolvedor

- Tipos: `@types/question.d.ts` descreve `Question` e `QuestionResponse`.
- Serviços: `service/question-fetcher.service.ts` e `service/question-generator.service.ts`.
- Lógica de tópico e seleção: `utils/draws-question-topic.ts` e `utils/question-state.utils.ts`.
- Reducer: `reducer/config-quiz-reducer.ts`.

## Executando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Adicionando ou editando questões

1. Edite `data/json_questions.json` seguindo `@types/question.d.ts`.
2. Cada questão deve ter 4 alternativas em `response`.
3. Defina `level_of_complexity` como 1, 2 ou 3. Para prática tipo Cloud Practitioner prefira 1 ou 2.
4. Não deixe a posição da alternativa correta sempre na mesma posição.
5. Escreva um `because` explicativo para feedback ao estudante.

## Testes e formatação

```bash
npm run format
npm run lint
```
