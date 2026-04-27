export type LgsYear =
  | 2025
  | 2024
  | 2023
  | 2022
  | 2021
  | 2020
  | 2019
  | 2018;

export type LgsSubjectKey =
  | "turkish"
  | "history"
  | "religion"
  | "foreignLanguage"
  | "math"
  | "science";

export type LgsSubjectInput = {
  correct: number | null;
  wrong: number | null;
};

export type LgsCalculationInput = {
  year: LgsYear;
  subjects: Record<LgsSubjectKey, LgsSubjectInput>;
  exemptions?: Partial<Record<"religion" | "foreignLanguage", boolean>>;
};

export type LgsSubjectResult = {
  key: LgsSubjectKey;
  net: number;
  questionCount: number;
  contribution: number;
  exempt: boolean;
};

export type LgsCalculationResult = {
  year: LgsYear;
  score: number;
  percentile: number;
  rank: number;
  population: number;
  totalNet: number;
  totalQuestions: number;
  subjectResults: Record<LgsSubjectKey, LgsSubjectResult>;
  imputedContribution: number;
};

type LgsYearProfile = {
  baseScore: number;
  population: number;
  netCoefficients: Record<LgsSubjectKey, number>;
  percentileAnchors: Array<{
    score: number;
    percentile: number;
  }>;
};

export const lgsYears: LgsYear[] = [
  2025,
  2024,
  2023,
  2022,
  2021,
  2020,
  2019,
  2018,
];

export const lgsSubjects: Array<{
  key: LgsSubjectKey;
  label: string;
  shortLabel: string;
  questionCount: number;
  weight: number;
  group: "Sözel" | "Sayısal";
}> = [
  {
    key: "turkish",
    label: "Türkçe",
    shortLabel: "Türkçe",
    questionCount: 20,
    weight: 4,
    group: "Sözel",
  },
  {
    key: "history",
    label: "T.C. İnkılap Tarihi ve Atatürkçülük",
    shortLabel: "İnkılap",
    questionCount: 10,
    weight: 1,
    group: "Sözel",
  },
  {
    key: "religion",
    label: "Din Kültürü ve Ahlak Bilgisi",
    shortLabel: "Din",
    questionCount: 10,
    weight: 1,
    group: "Sözel",
  },
  {
    key: "foreignLanguage",
    label: "Yabancı Dil",
    shortLabel: "Yabancı Dil",
    questionCount: 10,
    weight: 1,
    group: "Sözel",
  },
  {
    key: "math",
    label: "Matematik",
    shortLabel: "Matematik",
    questionCount: 20,
    weight: 4,
    group: "Sayısal",
  },
  {
    key: "science",
    label: "Fen Bilimleri",
    shortLabel: "Fen",
    questionCount: 20,
    weight: 4,
    group: "Sayısal",
  },
];

export const lgsYearProfiles: Record<LgsYear, LgsYearProfile> = {
  2025: {
    baseScore: 178.0515,
    population: 963142,
    netCoefficients: {
      turkish: 4.5269,
      history: 1.9351,
      religion: 1.9859,
      foreignLanguage: 1.6898,
      math: 4.6474,
      science: 4.1179,
    },
    percentileAnchors: [
      { score: 178.0515, percentile: 90.61 },
      { score: 210.2464, percentile: 68.04 },
      { score: 242.4412, percentile: 50.72 },
      { score: 274.6361, percentile: 38.82 },
      { score: 306.8309, percentile: 29.66 },
      { score: 339.0258, percentile: 22.11 },
      { score: 371.2206, percentile: 15.77 },
      { score: 387.318, percentile: 12.87 },
      { score: 403.4155, percentile: 10.18 },
      { score: 414.1529, percentile: 8.49 },
      { score: 419.5129, percentile: 7.69 },
      { score: 435.6103, percentile: 5.44 },
      { score: 451.7077, percentile: 3.49 },
      { score: 467.8052, percentile: 1.86 },
      { score: 475.8539, percentile: 1.19 },
      { score: 480.3708, percentile: 0.86 },
      { score: 483.9026, percentile: 0.6 },
      { score: 491.9513, percentile: 0.23 },
      { score: 500, percentile: 0.01 },
    ],
  },
  2024: {
    baseScore: 196.6174,
    population: 992906,
    netCoefficients: {
      turkish: 4.1076,
      history: 1.7293,
      religion: 1.8182,
      foreignLanguage: 1.5308,
      math: 4.6325,
      science: 3.8901,
    },
    percentileAnchors: [
      { score: 196.6174, percentile: 92.52 },
      { score: 226.9557, percentile: 73.23 },
      { score: 257.294, percentile: 55.76 },
      { score: 287.6322, percentile: 42.87 },
      { score: 317.9705, percentile: 32.97 },
      { score: 348.3087, percentile: 24.74 },
      { score: 378.647, percentile: 17.65 },
      { score: 393.8161, percentile: 14.46 },
      { score: 408.9852, percentile: 11.47 },
      { score: 417.9628, percentile: 9.8 },
      { score: 424.1544, percentile: 8.7 },
      { score: 439.3235, percentile: 6.13 },
      { score: 454.4926, percentile: 3.79 },
      { score: 469.6617, percentile: 1.85 },
      { score: 477.2463, percentile: 1.09 },
      { score: 481.2067, percentile: 0.78 },
      { score: 484.8309, percentile: 0.5 },
      { score: 492.4154, percentile: 0.17 },
      { score: 500, percentile: 0.01 },
    ],
  },
  2023: {
    baseScore: 194.7522,
    population: 1030195,
    netCoefficients: {
      turkish: 4.3487,
      history: 1.6666,
      religion: 1.8994,
      foreignLanguage: 1.5075,
      math: 4.2538,
      science: 4.1231,
    },
    percentileAnchors: [
      { score: 194.7522, percentile: 92.23 },
      { score: 225.277, percentile: 73.35 },
      { score: 255.8017, percentile: 56.73 },
      { score: 286.3265, percentile: 44.28 },
      { score: 316.8513, percentile: 34.47 },
      { score: 347.3761, percentile: 26.36 },
      { score: 377.9009, percentile: 19.58 },
      { score: 393.1633, percentile: 16.58 },
      { score: 408.4256, percentile: 13.81 },
      { score: 419.0655, percentile: 11.96 },
      { score: 423.688, percentile: 11.15 },
      { score: 438.9504, percentile: 8.5 },
      { score: 454.2128, percentile: 5.82 },
      { score: 469.4752, percentile: 3.04 },
      { score: 477.1064, percentile: 1.85 },
      { score: 481.513, percentile: 1.25 },
      { score: 484.7376, percentile: 0.81 },
      { score: 492.3688, percentile: 0.25 },
      { score: 500, percentile: 0.01 },
    ],
  },
  2022: {
    baseScore: 199.9999,
    population: 1031799,
    netCoefficients: {
      turkish: 3.9197,
      history: 1.7514,
      religion: 1.6624,
      foreignLanguage: 1.4796,
      math: 4.9298,
      science: 3.704,
    },
    percentileAnchors: [
      { score: 199.9999, percentile: 92.31 },
      { score: 229.9999, percentile: 73.06 },
      { score: 260, percentile: 54.61 },
      { score: 290, percentile: 40.26 },
      { score: 320, percentile: 29.14 },
      { score: 350, percentile: 20.46 },
      { score: 380, percentile: 13.68 },
      { score: 395, percentile: 10.8 },
      { score: 410, percentile: 8.23 },
      { score: 417.6688, percentile: 7.05 },
      { score: 425, percentile: 5.95 },
      { score: 440, percentile: 3.98 },
      { score: 455, percentile: 2.32 },
      { score: 470, percentile: 1.05 },
      { score: 477.5, percentile: 0.57 },
      { score: 481.0374, percentile: 0.41 },
      { score: 485, percentile: 0.25 },
      { score: 492.5, percentile: 0.08 },
      { score: 500, percentile: 0.01 },
    ],
  },
  2021: {
    baseScore: 200.0006,
    population: 1038492,
    netCoefficients: {
      turkish: 3.446,
      history: 1.4753,
      religion: 1.5927,
      foreignLanguage: 1.3396,
      math: 5.7878,
      science: 3.5624,
    },
    percentileAnchors: [
      { score: 200.0006, percentile: 89.31 },
      { score: 230.0006, percentile: 64.36 },
      { score: 260.0005, percentile: 43.79 },
      { score: 290.0005, percentile: 30.59 },
      { score: 320.0004, percentile: 21.27 },
      { score: 350.0003, percentile: 14.18 },
      { score: 380.0003, percentile: 8.62 },
      { score: 395.0003, percentile: 6.3 },
      { score: 410.0002, percentile: 4.37 },
      { score: 413.9362, percentile: 3.93 },
      { score: 425.0002, percentile: 2.83 },
      { score: 440.0002, percentile: 1.68 },
      { score: 455.0002, percentile: 0.9 },
      { score: 470.0001, percentile: 0.38 },
      { score: 477.5001, percentile: 0.22 },
      { score: 480.0765, percentile: 0.17 },
      { score: 485.0001, percentile: 0.1 },
      { score: 492.5001, percentile: 0.04 },
      { score: 500, percentile: 0.01 },
    ],
  },
  2020: {
    baseScore: 200.0003,
    population: 1472088,
    netCoefficients: {
      turkish: 3.7972,
      history: 1.4192,
      religion: 1.5344,
      foreignLanguage: 1.5178,
      math: 5.621,
      science: 3.3458,
    },
    percentileAnchors: [
      { score: 200.0003, percentile: 93.51 },
      { score: 230.0002, percentile: 76.27 },
      { score: 260.0002, percentile: 57.17 },
      { score: 290.0002, percentile: 41.56 },
      { score: 320.0002, percentile: 29.38 },
      { score: 350.0001, percentile: 19.64 },
      { score: 380.0001, percentile: 11.85 },
      { score: 395.0001, percentile: 8.76 },
      { score: 410.0001, percentile: 6.22 },
      { score: 415.0051, percentile: 5.48 },
      { score: 425.0001, percentile: 4.17 },
      { score: 440.0001, percentile: 2.58 },
      { score: 455, percentile: 1.39 },
      { score: 470, percentile: 0.6 },
      { score: 477.5, percentile: 0.35 },
      { score: 480.0968, percentile: 0.26 },
      { score: 485, percentile: 0.15 },
      { score: 492.5, percentile: 0.04 },
      { score: 500, percentile: 0.01 },
    ],
  },
  2019: {
    baseScore: 193.4797,
    population: 1029555,
    netCoefficients: {
      turkish: 3.6717,
      history: 1.6857,
      religion: 1.9408,
      foreignLanguage: 1.632,
      math: 4.9528,
      science: 4.0725,
    },
    percentileAnchors: [
      { score: 193.4797, percentile: 93.97 },
      { score: 224.1318, percentile: 80.52 },
      { score: 254.7838, percentile: 65.71 },
      { score: 285.4358, percentile: 51.48 },
      { score: 316.0878, percentile: 38.46 },
      { score: 346.7399, percentile: 27.24 },
      { score: 377.3919, percentile: 18.14 },
      { score: 392.7179, percentile: 14.45 },
      { score: 408.0439, percentile: 11.22 },
      { score: 414.9167, percentile: 9.92 },
      { score: 423.37, percentile: 8.43 },
      { score: 438.696, percentile: 5.99 },
      { score: 454.022, percentile: 3.85 },
      { score: 469.348, percentile: 2.07 },
      { score: 477.011, percentile: 1.32 },
      { score: 480.7185, percentile: 1 },
      { score: 484.674, percentile: 0.68 },
      { score: 492.337, percentile: 0.25 },
      { score: 500, percentile: 0.01 },
    ],
  },
  2018: {
    baseScore: 105.0895,
    population: 971617,
    netCoefficients: {
      turkish: 4.3495,
      history: 1.9888,
      religion: 2.1592,
      foreignLanguage: 1.7575,
      math: 7.6353,
      science: 4.8082,
    },
    percentileAnchors: [
      { score: 105.0895, percentile: 99.77 },
      { score: 144.5806, percentile: 90.49 },
      { score: 184.0716, percentile: 73.01 },
      { score: 223.5627, percentile: 52.09 },
      { score: 263.0537, percentile: 33.72 },
      { score: 302.5448, percentile: 20.09 },
      { score: 342.0358, percentile: 10.47 },
      { score: 361.7813, percentile: 6.91 },
      { score: 381.5269, percentile: 4.25 },
      { score: 386.2367, percentile: 3.72 },
      { score: 401.2724, percentile: 2.36 },
      { score: 421.0179, percentile: 1.16 },
      { score: 440.7634, percentile: 0.48 },
      { score: 460.5089, percentile: 0.15 },
      { score: 470.3817, percentile: 0.07 },
      { score: 473.8144, percentile: 0.05 },
      { score: 480.2545, percentile: 0.04 },
      { score: 490.1272, percentile: 0.03 },
      { score: 500, percentile: 0.01 },
    ],
  },
};

export function isLgsYear(value: number): value is LgsYear {
  return lgsYears.includes(value as LgsYear);
}

export function calculateLgsScore(
  input: LgsCalculationInput
): LgsCalculationResult {
  const profile = lgsYearProfiles[input.year];
  const exemptions = input.exemptions ?? {};
  let totalNet = 0;
  let totalQuestions = 0;
  let contribution = 0;
  let possibleIncludedContribution = 0;
  let possibleExemptContribution = 0;

  const subjectResults = {} as Record<LgsSubjectKey, LgsSubjectResult>;

  for (const subject of lgsSubjects) {
    const exempt =
      subject.key === "religion" || subject.key === "foreignLanguage"
        ? Boolean(exemptions[subject.key])
        : false;
    const net = exempt
      ? 0
      : calculateSubjectNet(input.subjects[subject.key], subject.questionCount);
    const subjectContribution = net * profile.netCoefficients[subject.key];
    const possibleContribution =
      subject.questionCount * profile.netCoefficients[subject.key];

    if (exempt) {
      possibleExemptContribution += possibleContribution;
    } else {
      totalNet += net;
      totalQuestions += subject.questionCount;
      contribution += subjectContribution;
      possibleIncludedContribution += possibleContribution;
    }

    subjectResults[subject.key] = {
      key: subject.key,
      net,
      questionCount: subject.questionCount,
      contribution: subjectContribution,
      exempt,
    };
  }

  const imputedContribution =
    possibleExemptContribution > 0 && possibleIncludedContribution > 0
      ? (contribution / possibleIncludedContribution) *
        possibleExemptContribution
      : 0;
  const rawScore = profile.baseScore + contribution + imputedContribution;
  const score = clampScore(rawScore);
  const percentile = estimatePercentile(input.year, score);
  const rank = score >= 499.999 ? 1 : Math.max(1, Math.round((profile.population * percentile) / 100));

  return {
    year: input.year,
    score,
    percentile,
    rank,
    population: profile.population,
    totalNet,
    totalQuestions,
    subjectResults,
    imputedContribution,
  };
}

export function calculateSubjectNet(
  input: LgsSubjectInput,
  questionCount: number
) {
  const correct = input.correct ?? 0;
  const wrong = input.wrong;

  if (wrong === null) {
    return clamp(correct, 0, questionCount);
  }

  return clamp(correct - wrong / 3, 0, questionCount);
}

export function estimatePercentile(year: LgsYear, score: number) {
  const anchors = lgsYearProfiles[year].percentileAnchors;

  if (score <= anchors[0].score) {
    return anchors[0].percentile;
  }

  for (let index = 1; index < anchors.length; index += 1) {
    const previous = anchors[index - 1];
    const next = anchors[index];

    if (score <= next.score) {
      const ratio = (score - previous.score) / (next.score - previous.score);
      return previous.percentile + ratio * (next.percentile - previous.percentile);
    }
  }

  return anchors[anchors.length - 1].percentile;
}

function clampScore(score: number) {
  if (score > 499.99) {
    return 500;
  }

  return clamp(score, 100, 500);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
