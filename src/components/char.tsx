'use client';

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { motion, easeInOut } from 'framer-motion';
import { reverseRenameTopicGroup } from '../../utils/rename-topic-name';
import { ALL_TOPICS } from '../../utils/draws-question-topic';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

type ChartProps = {
  topicStats: TopicStatsDetail;
};

const ACERTOS_COLOR = '#22c55e';
const ERROS_COLOR = '#ef4444';

const chartConfig = {
  acertos: {
    label: 'Acertos',
    color: ACERTOS_COLOR,
  },
  erros: {
    label: 'Erros',
    color: ERROS_COLOR,
  },
} satisfies ChartConfig;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeInOut },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeInOut },
  },
};

function getRecommendationText(topicStats: TopicStatsDetail): string {
  const entries = ALL_TOPICS.map((topic) => ({
    topic: reverseRenameTopicGroup(topic),
    ...topicStats[topic],
    total: topicStats[topic].correct + topicStats[topic].errors,
  }));

  const withQuestions = entries.filter((e) => e.total > 0);
  if (withQuestions.length === 0) return 'Continue praticando para ver seu desempenho por topico.';

  const worst = withQuestions.reduce((prev, curr) => {
    const prevRate = prev.total > 0 ? prev.correct / prev.total : 1;
    const currRate = curr.total > 0 ? curr.correct / curr.total : 1;
    return currRate < prevRate ? curr : prev;
  });

  const best = withQuestions.reduce((prev, curr) => {
    const prevRate = prev.total > 0 ? prev.correct / prev.total : 0;
    const currRate = curr.total > 0 ? curr.correct / curr.total : 0;
    return currRate > prevRate ? curr : prev;
  });

  const totalCorrect = withQuestions.reduce((s, e) => s + e.correct, 0);
  const totalQuestions = withQuestions.reduce((s, e) => s + e.total, 0);
  const overallRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  let intro = '';
  if (overallRate >= 80) {
    intro = 'Parabens! Voce demonstrou um otimo dominio geral. ';
  } else if (overallRate >= 60) {
    intro = 'Voce esta no caminho certo! Ha espaco para melhorar. ';
  } else {
    intro = 'Continue estudando e praticando. ';
  }

  const priority =
    worst.topic !== best.topic
      ? `Priorize revisar ${worst.topic}, onde houve mais dificuldades. `
      : '';
  const strength =
    best.correct > 0 && worst.topic !== best.topic ? `${best.topic} foi seu melhor topico. ` : '';

  return `${intro}${priority}${strength}Faca um novo quiz para acompanhar sua evolucao.`;
}

function StatCard({
  label,
  value,
  detail,
  color,
}: {
  label: string;
  value: number | string;
  detail?: string;
  color?: string;
}) {
  return (
    <div className="bg-muted/50 flex flex-1 flex-col gap-1 rounded-lg px-3 py-2.5">
      <span className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        {label}
      </span>
      <span className="text-xl leading-none font-bold" style={color ? { color } : undefined}>
        {value}
      </span>
      {detail && <span className="text-muted-foreground text-[11px]">{detail}</span>}
    </div>
  );
}

export function Chart({ topicStats }: ChartProps) {
  const chartData = useMemo(
    () =>
      ALL_TOPICS.map((topic) => {
        const correct = topicStats[topic].correct;
        const errors = topicStats[topic].errors;
        const total = correct + errors;
        return {
          topico: reverseRenameTopicGroup(topic),
          acertos: correct,
          erros: errors,
          total,
          rate: total > 0 ? Math.round((correct / total) * 100) : 0,
        };
      }).sort((a, b) => b.rate - a.rate),
    [topicStats]
  );

  const totalCorrect = useMemo(() => chartData.reduce((sum, d) => sum + d.acertos, 0), [chartData]);

  const totalErrors = useMemo(() => chartData.reduce((sum, d) => sum + d.erros, 0), [chartData]);

  const totalQuestions = totalCorrect + totalErrors;
  const overallRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const recommendation = getRecommendationText(topicStats);

  const chartHeight = Math.max(280, chartData.length * 56);

  return (
    <motion.div
      className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col gap-1 px-4 sm:px-0">
        <h2 className="text-foreground text-lg font-semibold text-balance sm:text-xl">
          Seu desempenho por topico
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Quantidade de acertos e erros em cada topico do quiz
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={fadeUp} className="flex gap-2 px-4 sm:gap-3 sm:px-0">
        <StatCard
          label="Aproveitamento"
          value={`${overallRate}%`}
          detail={`${totalQuestions} questoes`}
        />
        <StatCard label="Acertos" value={totalCorrect} color={ACERTOS_COLOR} />
        <StatCard label="Erros" value={totalErrors} color={ERROS_COLOR} />
      </motion.div>

      {/* Chart */}
      <motion.div variants={scaleIn}>
        <Card className="border-0 shadow-none sm:border sm:shadow-sm">
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer config={chartConfig} style={{ height: chartHeight, width: '100%' }}>
              <BarChart
                data={chartData}
                layout="vertical"
                accessibilityLayer
                margin={{ left: 4, right: 8, top: 4, bottom: 4 }}
                barGap={2}
                barCategoryGap="24%"
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.4} />
                <YAxis
                  dataKey="topico"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={160}
                  tick={{
                    fontSize: 11,
                    fill: 'hsl(var(--muted-foreground))',
                  }}
                  tickFormatter={(value: string) =>
                    value.length > 24 ? value.slice(0, 22) + '...' : value
                  }
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  hide
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const label = name === 'acertos' ? 'Acertos' : 'Erros';
                        return (
                          <span className="flex items-center gap-1.5">
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: name === 'acertos' ? ACERTOS_COLOR : ERROS_COLOR,
                              }}
                            />
                            {label}: {value}
                          </span>
                        );
                      }}
                    />
                  }
                  cursor={{ fill: 'hsl(var(--muted) / 0.2)', radius: 4 }}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="acertos"
                  fill={ACERTOS_COLOR}
                  radius={6}
                  barSize={12}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                  animationBegin={200}
                />
                <Bar
                  dataKey="erros"
                  fill={ERROS_COLOR}
                  radius={6}
                  barSize={12}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                  animationBegin={500}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="px-4 pt-0 pb-4 sm:px-6">
            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              {recommendation}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
