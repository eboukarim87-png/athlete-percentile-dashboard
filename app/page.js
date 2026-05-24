import { useMemo, useState } from 'react';

export default function AthleteDashboard() {
  const references = {
    11: {
      'Squat Jump Height': {
        mean: 20,
        top10Threshold: 27,
      },
      'CMJ Height': {
        mean: 22,
        top10Threshold: 30,
      },
      'CMJ RSI': {
        mean: 0.55,
        top10Threshold: 0.82,
      },
      'IMTP Peak Force': {
        mean: 32,
        top10Threshold: 44,
      },
      'CMJ Peak Force': {
        mean: 40,
        top10Threshold: 55,
      },
      'CMJ Contraction Time': {
        mean: 370,
        top10Threshold: 300,
      },
    },

    12: {
      'Squat Jump Height': {
        mean: 23,
        top10Threshold: 31,
      },
      'CMJ Height': {
        mean: 25,
        top10Threshold: 34,
      },
      'CMJ RSI': {
        mean: 0.65,
        top10Threshold: 0.95,
      },
      'IMTP Peak Force': {
        mean: 36,
        top10Threshold: 50,
      },
      'CMJ Peak Force': {
        mean: 46,
        top10Threshold: 62,
      },
      'CMJ Contraction Time': {
        mean: 345,
        top10Threshold: 280,
      },
    },
  };

  const athletes = [
    {
      id: 1,
      name: 'Jude Rahme',
      age: 11,
      position: 'CM',
      club: 'WSW',
      metrics: [
        {
          name: 'Squat Jump Height',
          value: 21.9,
          unit: 'cm',
        },
        {
          name: 'CMJ Height',
          value: 18.1,
          unit: 'cm',
        },
        {
          name: 'CMJ RSI',
          value: 0.52,
          unit: 'm/s',
        },
        {
          name: 'IMTP Peak Force',
          value: 31.46,
          unit: 'N/kg',
        },
        {
          name: 'CMJ Peak Force',
          value: 40.2,
          unit: 'N/kg',
        },
        {
          name: 'CMJ Contraction Time',
          value: 370,
          unit: 'ms',
        },
      ],
    },

    {
      id: 2,
      name: 'John Test',
      age: 12,
      position: 'CD',
      club: 'Bankstown Lions',
      metrics: [
        {
          name: 'Squat Jump Height',
          value: 29,
          unit: 'cm',
        },
        {
          name: 'CMJ Height',
          value: 32,
          unit: 'cm',
        },
        {
          name: 'CMJ RSI',
          value: 0.88,
          unit: 'm/s',
        },
        {
          name: 'IMTP Peak Force',
          value: 48,
          unit: 'N/kg',
        },
        {
          name: 'CMJ Peak Force',
          value: 58,
          unit: 'N/kg',
        },
        {
          name: 'CMJ Contraction Time',
          value: 285,
          unit: 'ms',
        },
      ],
    },
  ];

  const [selectedAthlete, setSelectedAthlete] = useState(0);

  const athlete = athletes[selectedAthlete];

  const inverseMetrics = ['CMJ Contraction Time'];

  const calculatePercentile = (metricName, age, value) => {
    const reference = references?.[age]?.[metricName];

    if (!reference) {
      return 50;
    }

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

  const getCategory = (percentile) => {
    if (percentile >= 95)
      return {
        label: 'Elite',
        color: 'text-cyan-400',
        hex: '#22d3ee',
      };

    if (percentile >= 80)
      return {
        label: 'Excellent',
        color: 'text-green-400',
        hex: '#22c55e',
      };

    if (percentile >= 60)
      return {
        label: 'Above Average',
        color: 'text-lime-400',
        hex: '#84cc16',
      };

    if (percentile >= 40)
      return {
        label: 'Average',
        color: 'text-yellow-400',
        hex: '#facc15',
      };

    if (percentile >= 20)
      return {
        label: 'Below Average',
        color: 'text-orange-400',
        hex: '#fb923c',
      };

    return {
      label: 'Needs Development',
      color: 'text-red-400',
      hex: '#ef4444',
    };
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

  const overallScore = Math.round(
    athleteMetrics.reduce(
      (sum, metric) => sum + metric.roundedPercentile,
      0
    ) / athleteMetrics.length
  );

  const overallCategory = getCategory(overallScore);

  const radarPoints = athleteMetrics.map((metric) => ({
    label: metric.name,
    value: metric.roundedPercentile,
  }));

  const centerX = 160;
  const centerY = 160;
  const radius = 120;

  const radarCoordinates = radarPoints
    .map((point, index) => {
      const angle =
        (Math.PI * 2 * index) / radarPoints.length - Math.PI / 2;

      const scaledRadius = (point.value / 100) * radius;

      const x = centerX + Math.cos(angle) * scaledRadius;
      const y = centerY + Math.sin(angle) * scaledRadius;

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col lg:flex-row gap-6">

          <div className="flex-1 space-y-4">

            <div>
              <div className="text-zinc-400 uppercase tracking-widest text-xs mb-2">
                Athlete Selection
              </div>

              <select
                value={selectedAthlete}
                onChange={(e) => setSelectedAthlete(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 min-w-[280px]"
              >
                {athletes.map((athleteOption, index) => (
                  <option key={athleteOption.id} value={index}>
                    {athleteOption.name}
                  </option>
                ))}
              </select>
            </div>

            <h1 className="text-5xl font-black tracking-wide">
              {athlete.name}
            </h1>

            <div className="text-zinc-300 text-lg">
              Age: {athlete.age} • Position: {athlete.position} • Club:{' '}
              <span className="text-red-500">{athlete.club}</span>
            </div>
          </div>

          <div className="w-full lg:w-[360px] bg-gradient-to-br from-green-950 to-zinc-900 border border-green-900 rounded-3xl p-6 shadow-2xl">

            <div className="text-yellow-400 uppercase tracking-widest text-sm mb-3">
              Overall Performance Score
            </div>

            <div className="flex items-end justify-between">

              <div>
                <div className="text-7xl font-black leading-none text-white">
                  {overallScore}
                </div>

                <div className="text-zinc-400">/100</div>
              </div>

              <div
                className="text-right font-semibold uppercase tracking-wide text-sm max-w-[120px]"
                style={{ color: overallCategory.hex }}
              >
                {overallCategory.label}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

            <div className="text-yellow-400 uppercase tracking-widest text-lg mb-6">
              Athletic Profile
            </div>

            <div className="relative h-[420px] flex items-center justify-center">

              <div className="absolute w-72 h-72 border border-zinc-700 rotate-45" />
              <div className="absolute w-56 h-56 border border-zinc-700 rotate-45" />
              <div className="absolute w-40 h-40 border border-zinc-700 rotate-45" />
              <div className="absolute w-24 h-24 border border-zinc-700 rotate-45" />

              <svg width="320" height="320" className="absolute overflow-visible">

                <polygon
                  points={radarCoordinates}
                  fill="rgba(34,211,238,0.22)"
                  stroke="#22d3ee"
                  strokeWidth="4"
                />

                {radarPoints.map((point, index) => {

                  const angle =
                    (Math.PI * 2 * index) / radarPoints.length -
                    Math.PI / 2;

                  const scaledRadius = (point.value / 100) * radius;

                  const x = centerX + Math.cos(angle) * scaledRadius;
                  const y = centerY + Math.sin(angle) * scaledRadius;

                  return (
                    <g key={index}>
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={centerX + Math.cos(angle) * radius}
                        y2={centerY + Math.sin(angle) * radius}
                        stroke={getCategory(point.value).hex}
                        strokeWidth="2"
                      />

                      <circle
                        cx={x}
                        cy={y}
                        r="7"
                        fill={getCategory(point.value).hex}
                        stroke="white"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>

              {radarPoints.map((point, index) => {

                const angle =
                  (Math.PI * 2 * index) / radarPoints.length -
                  Math.PI / 2;

                const labelRadius = radius + 40;

                const x = centerX + Math.cos(angle) * labelRadius;
                const y = centerY + Math.sin(angle) * labelRadius;

                return (
                  <div
                    key={index}
                    className="absolute text-xs text-zinc-300 text-center w-28"
                    style={{
                      left: `${x - 56}px`,
                      top: `${y - 10}px`,
                    }}
                  >
                    <div>{point.label}</div>

                    <div
                      className="font-semibold mt-1"
                      style={{ color: getCategory(point.value).hex }}
                    >
                      {point.value}th
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-2 bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div className="text-yellow-400 uppercase tracking-widest text-lg">
                Key Metric Comparison
              </div>

              <div className="text-zinc-400 uppercase text-sm tracking-widest">
                Percentile
              </div>
            </div>

            <div className="space-y-6">

              {athleteMetrics.map((metric, index) => {

                const category = getCategory(metric.roundedPercentile);

                return (
                  <div key={index} className="space-y-2">

                    <div className="flex items-center justify-between">

                      <div>
                        <div className="text-lg">{metric.name}</div>

                        <div className="text-cyan-400 font-semibold">
                          {metric.value} {metric.unit}
                        </div>
                      </div>

                      <div className="text-right">

                        <div className="text-2xl font-bold text-cyan-400">
                          {metric.roundedPercentile}th
                        </div>

                        <div className={`text-sm ${category.color}`}>
                          {category.label}
                        </div>
                      </div>
                    </div>

                    <div className="relative h-4 rounded-full overflow-hidden bg-zinc-800">

                      <div className="absolute inset-y-0 left-0 w-[20%] bg-red-500" />
                      <div className="absolute inset-y-0 left-[20%] w-[20%] bg-orange-400" />
                      <div className="absolute inset-y-0 left-[40%] w-[20%] bg-yellow-400" />
                      <div className="absolute inset-y-0 left-[60%] w-[20%] bg-lime-400" />
                      <div className="absolute inset-y-0 left-[80%] w-[20%] bg-green-500" />

                      <div
                        className="absolute top-1/2 w-5 h-5 rounded-full border-4 border-white bg-cyan-400 -translate-y-1/2 shadow-lg"
                        style={{
                          left: `calc(${metric.roundedPercentile}% - 10px)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
