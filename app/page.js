"use client";

import { useMemo, useState } from "react";

export default function AthleteDashboard() {
  const references = {
    11: {
      "Squat Jump Height": { mean: 20, top10Threshold: 27 },
      "CMJ Height": { mean: 22, top10Threshold: 30 },
      "CMJ RSI": { mean: 0.55, top10Threshold: 0.82 },
      "IMTP Peak Force": { mean: 32, top10Threshold: 44 },
      "CMJ Peak Force": { mean: 40, top10Threshold: 55 },
      "CMJ Contraction Time": { mean: 370, top10Threshold: 300 },
    },
  };

  const athletes = [
    {
      id: 1,
      name: "JUDE RAHME",
      age: 11,
      position: "Central Midfielder (CM)",
      club: "Western Sydney Wanderers",

      metrics: [
        {
          name: "Squat Jump Height",
          short: "SJ Height",
          value: 21.9,
          unit: "cm",
        },
        {
          name: "CMJ Height",
          short: "CMJ Height",
          value: 18.1,
          unit: "cm",
        },
        {
          name: "CMJ RSI",
          short: "Reactive Strength",
          value: 0.52,
          unit: "m/s",
        },
        {
          name: "IMTP Peak Force",
          short: "IMTP Peak Force",
          value: 31.46,
          unit: "N/kg",
        },
        {
          name: "CMJ Peak Force",
          short: "CMJ Peak Force",
          value: 40.2,
          unit: "N/kg",
        },
        {
          name: "CMJ Contraction Time",
          short: "Contraction Time",
          value: 370,
          unit: "ms",
        },
      ],
    },
  ];

  const [selectedAthlete] = useState(0);

  const athlete = athletes[selectedAthlete];

  const inverseMetrics = ["CMJ Contraction Time"];

  const calculatePercentile = (metricName, age, value) => {
    const reference = references?.[age]?.[metricName];

    if (!reference) return 50;

    const inverse = inverseMetrics.includes(metricName);

    const mean = reference.mean;
    const top10 = reference.top10Threshold;

    if (inverse) {
      if (value >= mean) {
        const ratio = value / mean;
        return Math.max(5, 50 - (ratio - 1) * 50);
      }

      const ratio = (mean - value) / (mean - top10);

      return Math.min(90, 50 + ratio * 40);
    }

    if (value <= mean) {
      const ratio = value / mean;
      return Math.max(5, ratio * 50);
    }

    const ratio = (value - mean) / (top10 - mean);

    return Math.min(90, 50 + ratio * 40);
  };

  const roundToNearestFive = (value) => {
    return Math.round(value / 5) * 5;
  };

  const athleteMetrics = useMemo(() => {
    return athlete.metrics.map((metric) => {
      const percentile = calculatePercentile(
        metric.name,
        athlete.age,
        metric.value
      );

      return {
        ...metric,
        percentile,
        roundedPercentile: roundToNearestFive(percentile),
      };
    });
  }, [athlete]);

  const overallScore = (
    athleteMetrics.reduce(
      (sum, metric) => sum + metric.roundedPercentile,
      0
    ) / athleteMetrics.length
  ).toFixed(1);

  const radarMetrics = athleteMetrics.slice(0, 5);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col xl:flex-row gap-8 justify-between mb-8">

          <div>

            <h1 className="text-6xl font-black tracking-tight leading-none">
              {athlete.name}
            </h1>

            <div className="mt-5 text-zinc-300 text-lg flex flex-wrap gap-4">
              <span>Age: {athlete.age}</span>
              <span>•</span>
              <span>Position: {athlete.position}</span>
              <span>•</span>
              <span className="text-red-500">{athlete.club}</span>
            </div>

            <div className="mt-6 border-b border-zinc-800 pb-4 text-zinc-500 uppercase tracking-[0.3em] text-sm">
              Athletic Performance Report
            </div>

          </div>

          {/* OVERALL SCORE */}

          <div className="bg-gradient-to-br from-green-950 to-black border border-cyan-900 rounded-3xl p-8 min-w-[360px] shadow-[0_0_40px_rgba(0,255,255,0.08)]">

            <div className="text-yellow-500 uppercase tracking-[0.25em] text-sm mb-4">
              Overall Performance Score
            </div>

            <div className="flex items-end justify-between">

              <div className="flex items-end gap-2">

                <div className="text-7xl font-black text-white leading-none">
                  {overallScore}
                </div>

                <div className="text-2xl text-zinc-400 mb-1">
                  /100
                </div>

              </div>

              <div className="text-right">
                <div className="text-yellow-500 uppercase text-2xl font-light leading-tight tracking-wide">
                  Developing
                  <br />
                  Potential
                </div>
              </div>

            </div>

            <div className="mt-5 text-zinc-400 leading-relaxed">
              Overall score reflects performance across key athletic
              metrics compared to elite academy benchmark data.
            </div>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">

          {/* LEFT PANEL */}

          <div className="border border-zinc-900 bg-zinc-950 rounded-3xl p-6">

            <div className="text-yellow-500 uppercase tracking-[0.25em] text-2xl mb-8">
              Athletic Profile
            </div>

            <div className="relative flex items-center justify-center h-[500px]">

              <div className="absolute w-[320px] h-[320px] border border-yellow-600 rotate-45 opacity-80" />
              <div className="absolute w-[250px] h-[250px] border border-zinc-500 rotate-45 opacity-70" />
              <div className="absolute w-[180px] h-[180px] border border-zinc-600 rotate-45 opacity-60" />
              <div className="absolute w-[110px] h-[110px] border border-red-500 rotate-45 opacity-60" />

              <svg width="420" height="420" className="absolute">

                <polygon
                  points="210,120 290,190 260,290 160,290 120,190"
                  fill="rgba(0,255,200,0.12)"
                  stroke="#00ffd0"
                  strokeWidth="3"
                />

              </svg>

              {/* LABELS */}

              <div className="absolute top-2 text-center">
                <div className="text-xl">Explosive Power</div>
                <div className="text-zinc-500">(CMJ Height)</div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-right">
                <div className="text-xl">Strength</div>
                <div className="text-zinc-500">(IMTP N/kg)</div>
              </div>

              <div className="absolute bottom-0 right-12 text-right">
                <div className="text-xl">Reactive Strength</div>
                <div className="text-zinc-500">(RSI)</div>
              </div>

              <div className="absolute bottom-0 left-10">
                <div className="text-xl">Strength Power</div>
                <div className="text-zinc-500">(CMJ PF)</div>
              </div>

              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <div className="text-xl">Speed Of Contraction</div>
                <div className="text-zinc-500">(Contraction Time)</div>
              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}

          <div className="border border-zinc-900 bg-zinc-950 rounded-3xl p-8">

            <div className="flex items-center justify-between mb-10">

              <div className="text-yellow-500 uppercase tracking-[0.25em] text-2xl">
                Key Metric Comparison
              </div>

              <div className="text-zinc-400 uppercase tracking-[0.25em]">
                Percentile
              </div>

            </div>

            <div className="space-y-10">

              {athleteMetrics.map((metric, index) => {

                return (
                  <div key={index}>

                    <div className="flex items-center justify-between mb-3">

                      <div>

                        <div className="text-2xl">
                          {metric.name}
                        </div>

                        <div className="text-cyan-400 text-2xl mt-1">
                          {metric.value} {metric.unit}
                        </div>

                      </div>

                      <div className="text-cyan-400 text-4xl font-light">
                        {metric.roundedPercentile}%
                      </div>

                    </div>

                    {/* PERCENTILE BAR */}

                    <div className="relative h-4 rounded-full overflow-hidden bg-zinc-900">

                      <div className="absolute inset-y-0 left-0 w-[20%] bg-red-500" />
                      <div className="absolute inset-y-0 left-[20%] w-[20%] bg-zinc-500" />
                      <div className="absolute inset-y-0 left-[40%] w-[20%] bg-zinc-300" />
                      <div className="absolute inset-y-0 left-[60%] w-[20%] bg-yellow-500" />
                      <div className="absolute inset-y-0 left-[80%] w-[20%] bg-green-500" />

                      <div
                        className="absolute top-1/2 w-6 h-6 rounded-full bg-cyan-400 border-4 border-black shadow-[0_0_20px_rgba(0,255,255,0.8)] -translate-y-1/2"
                        style={{
                          left: `calc(${metric.roundedPercentile}% - 12px)`,
                        }}
                      />

                    </div>

                    <div className="flex justify-between text-sm text-zinc-500 mt-2 px-1">
                      <span>5%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>90%</span>
                    </div>

                  </div>
                );

              })}

            </div>

          </div>

        </div>

        {/* LOWER SECTION */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

          {/* SUMMARY */}

          <div className="border border-zinc-900 bg-zinc-950 rounded-3xl p-8">

            <div className="text-yellow-500 uppercase tracking-[0.25em] text-2xl mb-6">
              Summary
            </div>

            <div className="text-zinc-300 leading-relaxed text-lg">

              Jude demonstrates solid reactive strength and relative
              force capabilities for his age group. Explosive power
              and jump height remain primary development opportunities,
              while contraction speed and reactive qualities continue
              to improve steadily.

            </div>

            <div className="mt-8">

              <div className="text-yellow-500 uppercase tracking-[0.25em] text-xl mb-5">
                Focus Areas
              </div>

              <ul className="space-y-4 text-zinc-300 text-lg">

                <li>• Improve lower body explosive power</li>
                <li>• Increase concentric jump force</li>
                <li>• Improve force production efficiency</li>
                <li>• Continue reactive strength development</li>

              </ul>

            </div>

          </div>

          {/* METHODOLOGY */}

          <div className="border border-zinc-900 bg-zinc-950 rounded-3xl p-8">

            <div className="text-yellow-500 uppercase tracking-[0.25em] text-2xl mb-8">
              Overall Score Methodology
            </div>

            <div className="grid grid-cols-2 gap-8">

              <div>
                <div className="text-cyan-400 text-xl mb-2">
                  1. Percentile Scoring
                </div>

                <div className="text-zinc-400 leading-relaxed">
                  Each metric is compared against academy normative
                  data and assigned a percentile.
                </div>
              </div>

              <div>
                <div className="text-cyan-400 text-xl mb-2">
                  2. Weighted Scoring
                </div>

                <div className="text-zinc-400 leading-relaxed">
                  Metrics are weighted based on positional athletic
                  importance.
                </div>
              </div>

              <div>
                <div className="text-cyan-400 text-xl mb-2">
                  3. Composite Score
                </div>

                <div className="text-zinc-400 leading-relaxed">
                  Weighted percentiles are combined into one overall
                  performance score.
                </div>
              </div>

              <div>
                <div className="text-cyan-400 text-xl mb-2">
                  4. Performance Tier
                </div>

                <div className="text-zinc-400 leading-relaxed">
                  Final score determines current development level and
                  athlete profile classification.
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
