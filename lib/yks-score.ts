export type YksYear =
  | 2025
  | 2024
  | 2023
  | 2022
  | 2021
  | 2020
  | 2019
  | 2018;

export type YksSubjectKey =
  | "tytTurkish"
  | "tytSocial"
  | "tytMath"
  | "tytScience"
  | "aytLiterature"
  | "aytHistory1"
  | "aytGeography1"
  | "aytHistory2"
  | "aytGeography2"
  | "aytPhilosophy"
  | "aytReligion"
  | "aytMath"
  | "aytPhysics"
  | "aytChemistry"
  | "aytBiology"
  | "ydtLanguage";

export type YksScoreType = "tyt" | "say" | "soz" | "ea" | "dil";

export type YksSubjectInput = {
  correct: number | null;
  wrong: number | null;
};

export type YksCalculationInput = {
  year: YksYear;
  subjects: Record<YksSubjectKey, YksSubjectInput>;
  obp: number | null;
  previousPlacement: boolean;
  vocationalExtra: boolean;
};

export type YksScoreResult = {
  type: YksScoreType;
  valid: boolean;
  reason?: string;
  score: number | null;
  rank: number | null;
  percentile: number | null;
  population: number;
  placementScore: number | null;
  placementRank: number | null;
  placementPercentile: number | null;
  vocationalPlacementScore: number | null;
  vocationalPlacementRank: number | null;
  vocationalPlacementPercentile: number | null;
};

export type YksCalculationResult = {
  year: YksYear;
  nets: Record<YksSubjectKey, number>;
  totals: {
    tyt: number;
    ayt: number;
    ydt: number;
  };
  obp: number | null;
  obpContribution: number | null;
  vocationalContribution: number | null;
  scores: Record<YksScoreType, YksScoreResult>;
};

type ScoreVector = Record<YksScoreType, number>;

type YksProfile = {
  baseScores: ScoreVector;
  coefficients: Record<YksSubjectKey, ScoreVector>;
  populations: Record<YksScoreType, number>;
  anchors: Record<
    YksScoreType,
    Array<[score: number, percentile: number, placementScore: number, placementPercentile: number]>
  >;
};

export const yksYears: YksYear[] = [
  2025,
  2024,
  2023,
  2022,
  2021,
  2020,
  2019,
  2018,
];

export const yksScoreTypes: Array<{
  key: YksScoreType;
  label: string;
  longLabel: string;
}> = [
  { key: "tyt", label: "TYT", longLabel: "Temel Yeterlilik Testi" },
  { key: "say", label: "SAY", longLabel: "Sayısal" },
  { key: "soz", label: "SÖZ", longLabel: "Sözel" },
  { key: "ea", label: "EA", longLabel: "Eşit Ağırlık" },
  { key: "dil", label: "DİL", longLabel: "Yabancı Dil" },
];

export const yksSubjects: Array<{
  key: YksSubjectKey;
  label: string;
  shortLabel: string;
  questionCount: number;
  group: "TYT" | "AYT" | "YDT";
}> = [
  { key: "tytTurkish", label: "Türkçe", shortLabel: "Türkçe", questionCount: 40, group: "TYT" },
  { key: "tytSocial", label: "Sosyal Bilimler", shortLabel: "Sosyal", questionCount: 20, group: "TYT" },
  { key: "tytMath", label: "Temel Matematik", shortLabel: "TYT Mat", questionCount: 40, group: "TYT" },
  { key: "tytScience", label: "Fen Bilimleri", shortLabel: "TYT Fen", questionCount: 20, group: "TYT" },
  { key: "aytLiterature", label: "Türk Dili ve Edebiyatı", shortLabel: "Edebiyat", questionCount: 24, group: "AYT" },
  { key: "aytHistory1", label: "Tarih-1", shortLabel: "Tarih-1", questionCount: 10, group: "AYT" },
  { key: "aytGeography1", label: "Coğrafya-1", shortLabel: "Coğ-1", questionCount: 6, group: "AYT" },
  { key: "aytHistory2", label: "Tarih-2", shortLabel: "Tarih-2", questionCount: 11, group: "AYT" },
  { key: "aytGeography2", label: "Coğrafya-2", shortLabel: "Coğ-2", questionCount: 11, group: "AYT" },
  { key: "aytPhilosophy", label: "Felsefe", shortLabel: "Felsefe", questionCount: 12, group: "AYT" },
  { key: "aytReligion", label: "Din Kültürü / Felsefe", shortLabel: "Din/Fel", questionCount: 6, group: "AYT" },
  { key: "aytMath", label: "Matematik", shortLabel: "AYT Mat", questionCount: 40, group: "AYT" },
  { key: "aytPhysics", label: "Fizik", shortLabel: "Fizik", questionCount: 14, group: "AYT" },
  { key: "aytChemistry", label: "Kimya", shortLabel: "Kimya", questionCount: 13, group: "AYT" },
  { key: "aytBiology", label: "Biyoloji", shortLabel: "Biyoloji", questionCount: 13, group: "AYT" },
  { key: "ydtLanguage", label: "Yabancı Dil", shortLabel: "YDT", questionCount: 80, group: "YDT" },
];

function v(tyt: number, say: number, soz: number, ea: number, dil: number): ScoreVector {
  return { tyt, say, soz, ea, dil };
}

export const yksProfiles: Record<YksYear, YksProfile> = {
  2025: {
    baseScores: v(145.47136, 132.87101, 129.61401, 129.33556, 105.92394),
    populations: { tyt: 2310579, say: 1291531, soz: 1174047, ea: 1494612, dil: 140657 },
    coefficients: {
      tytTurkish: v(2.8272, 1.1981, 1.12999, 1.19268, 1.53016),
      tytSocial: v(2.98817, 1.26631, 1.19432, 1.26059, 1.61728),
      tytMath: v(3.27928, 1.38968, 1.31067, 1.3834, 1.77483),
      tytScience: v(2.52529, 1.07016, 1.00932, 1.06532, 1.36675),
      aytLiterature: v(0, 0, 2.78861, 2.94335, 0),
      aytHistory1: v(0, 0, 2.39484, 2.52773, 0),
      aytGeography1: v(0, 0, 2.6973, 2.84697, 0),
      aytHistory2: v(0, 0, 3.80279, 0, 0),
      aytGeography2: v(0, 0, 2.4719, 0, 0),
      aytPhilosophy: v(0, 0, 3.75903, 0, 0),
      aytReligion: v(0, 0, 2.35253, 0, 0),
      aytMath: v(0, 2.89026, 0, 2.87719, 0),
      aytPhysics: v(0, 2.4565, 0, 0, 0),
      aytChemistry: v(0, 2.53401, 0, 0, 0),
      aytBiology: v(0, 2.61106, 0, 0, 0),
      ydtLanguage: v(0, 0, 0, 0, 2.59917),
    },
    anchors: {
      tyt: [[180.92421, 85.06, 228.92421, 80.07], [251.82994, 39.1, 299.82994, 36.94], [322.73567, 11.61, 370.73567, 12.23], [374.99599, 3.9, 422.99599, 4.51], [393.6414, 2.34, 441.6414, 2.87], [464.54713, 0.06, 512.54713, 0.13], [500, 0.01, 548, 0.01]],
      say: [[169.58386, 80.17, 217.58386, 74.7], [243.00967, 25.92, 291.00967, 26.64], [316.43548, 10.86, 364.43548, 11.5], [365.85215, 5.83, 413.85215, 6.41], [389.86129, 3.89, 437.86129, 4.46], [463.2871, 0.29, 511.2871, 0.51], [500, 0.01, 548, 0.01]],
      soz: [[167.31432, 87.11, 215.31432, 82.77], [242.71492, 27.07, 290.71492, 25.94], [318.11552, 2.69, 366.11552, 2.8], [391.01324, 0.09, 439.01324, 0.1], [393.51612, 0.08, 441.51612, 0.09], [468.91671, 0.01, 516.91671, 0.01], [500, 0.01, 548, 0.01]],
      ea: [[167.10042, 85.81, 215.10042, 81.01], [242.63015, 27.37, 290.63015, 27.71], [318.15987, 4.81, 366.15987, 5.69], [378.3819, 0.44, 426.3819, 0.65], [393.68959, 0.23, 441.68959, 0.32], [469.21931, 0.01, 517.21931, 0.01], [500, 0.01, 548, 0.01]],
      dil: [[145.90534, 94.9, 193.90534, 92.72], [225.86817, 58.02, 273.86817, 57.59], [305.831, 29.23, 353.831, 29.43], [380.90077, 7.32, 428.90077, 8.23], [385.79383, 6.37, 433.79383, 7.27], [465.75666, 0.19, 513.75666, 0.34], [500, 0.01, 548, 0.01]],
    },
  },
  2024: {
    baseScores: v(144.94534, 133.28374, 130.35832, 132.2826, 110.58115),
    populations: { tyt: 2755277, say: 1307007, soz: 1423849, ea: 1703833, dil: 153648 },
    coefficients: {
      tytTurkish: v(2.90844, 1.1067, 1.23203, 1.13891, 1.49539),
      tytSocial: v(2.93675, 1.11747, 1.24402, 1.15, 1.50994),
      tytMath: v(2.92548, 1.11318, 1.23925, 1.14558, 1.50415),
      tytScience: v(3.14816, 1.19791, 1.33358, 1.23278, 1.61864),
      aytLiterature: v(0, 0, 3.06333, 2.83178, 0),
      aytHistory1: v(0, 0, 2.57146, 2.37709, 0),
      aytGeography1: v(0, 0, 2.74393, 2.53653, 0),
      aytHistory2: v(0, 0, 3.16003, 0, 0),
      aytGeography2: v(0, 0, 2.82045, 0, 0),
      aytPhilosophy: v(0, 0, 3.8504, 0, 0),
      aytReligion: v(0, 0, 3.13095, 0, 0),
      aytMath: v(0, 3.18937, 0, 3.28219, 0),
      aytPhysics: v(0, 2.42639, 0, 0, 0),
      aytChemistry: v(0, 3.07406, 0, 0, 0),
      aytBiology: v(0, 2.50924, 0, 0, 0),
      ydtLanguage: v(0, 0, 0, 0, 2.60942),
    },
    anchors: {
      tyt: [[180.45082, 79.63, 228.45082, 74.05], [251.46175, 34.16, 299.46175, 32.3], [322.47268, 10.48, 370.47268, 10.95], [393.48361, 3.09, 441.48361, 3.5], [464.49453, 0.22, 512.49453, 0.41], [500, 0.01, 548, 0.01]],
      say: [[170.20676, 73.66, 218.20676, 68.67], [244.05289, 21.55, 292.05289, 22.39], [317.89901, 8.86, 365.89901, 9.46], [391.74513, 3.08, 439.74513, 3.55], [465.59124, 0.26, 513.59124, 0.46], [500, 0.01, 548, 0.02]],
      soz: [[170.04606, 87.16, 218.04606, 82.94], [249.42159, 30.31, 297.42159, 29.09], [328.79711, 4.69, 376.79711, 4.82], [408.17264, 0.14, 456.17264, 0.17], [487.54817, 0.01, 535.54817, 0.01], [500, 0.01, 548, 0.01]],
      ea: [[170.01013, 80.53, 218.01013, 74.93], [245.46514, 22.73, 293.46514, 23.23], [320.92014, 4.07, 368.92014, 4.79], [396.37514, 0.23, 444.37514, 0.33], [471.83014, 0.01, 519.83014, 0.01], [500, 0.01, 548, 0.01]],
      dil: [[149.71179, 94.02, 197.71179, 91.69], [227.97304, 57.03, 275.97304, 56.67], [306.23429, 28.9, 354.23429, 29.28], [384.49555, 7.62, 432.49555, 8.57], [462.75679, 0.45, 510.75679, 0.74], [500, 0.01, 548, 0.02]],
    },
  },
  2023: {
    baseScores: v(141.89877, 128.23164, 128.44005, 128.96295, 109.86403),
    populations: { tyt: 2895128, say: 1500310, soz: 1546776, ea: 1859614, dil: 153986 },
    coefficients: {
      tytTurkish: v(2.8903, 1.18669, 1.12738, 1.16638, 1.48615),
      tytSocial: v(3.02496, 1.24198, 1.17991, 1.22072, 1.55539),
      tytMath: v(3.02119, 1.24043, 1.17844, 1.2192, 1.55345),
      tytScience: v(3.05713, 1.25519, 1.19246, 1.23371, 1.57193),
      aytLiterature: v(0, 0, 3.03348, 3.1384, 0),
      aytHistory1: v(0, 0, 3.15655, 3.26573, 0),
      aytGeography1: v(0, 0, 2.95949, 3.06185, 0),
      aytHistory2: v(0, 0, 3.07407, 0, 0),
      aytGeography2: v(0, 0, 2.98558, 0, 0),
      aytPhilosophy: v(0, 0, 3.67176, 0, 0),
      aytReligion: v(0, 0, 2.81324, 0, 0),
      aytMath: v(0, 2.82335, 0, 2.77503, 0),
      aytPhysics: v(0, 2.48078, 0, 0, 0),
      aytChemistry: v(0, 2.9415, 0, 0, 0),
      aytBiology: v(0, 3.10151, 0, 0, 0),
      ydtLanguage: v(0, 0, 0, 0, 2.64089),
    },
    anchors: {
      tyt: [[177.7089, 77.25, 225.7089, 71.23], [249.32914, 33.7, 297.32914, 31.61], [320.94939, 10.67, 368.94939, 10.93], [392.56963, 2.98, 440.56963, 3.33], [464.18988, 0.17, 512.18988, 0.35], [500, 0.01, 548, 0.01]],
      say: [[165.55684, 73.84, 213.55684, 67.86], [240.20718, 24.85, 288.20718, 25.09], [314.85752, 10.55, 362.85752, 10.98], [389.50785, 4.24, 437.50785, 4.65], [464.15819, 0.48, 512.15819, 0.77], [500, 0.01, 548, 0.03]],
      soz: [[167.38038, 82.76, 215.38038, 77.5], [245.26113, 27.46, 293.26113, 25.75], [323.14189, 3.87, 371.14189, 3.83], [401.02265, 0.12, 449.02265, 0.14], [478.90341, 0.01, 526.90341, 0.01], [500, 0.01, 548, 0.01]],
      ea: [[167.14923, 79.14, 215.14923, 72.97], [243.52171, 25.85, 291.52171, 25.57], [319.8942, 5.26, 367.8942, 5.91], [396.26668, 0.33, 444.26668, 0.41], [472.63917, 0.01, 520.63917, 0.02], [500, 0.01, 548, 0.01]],
      dil: [[149.40422, 92.47, 197.40422, 89.63], [228.48462, 57.71, 276.48462, 56.72], [307.56502, 31.06, 355.56502, 30.9], [386.64542, 9.2, 434.64542, 9.96], [465.72583, 0.56, 513.72583, 0.95], [500, 0.01, 548, 0.04]],
    },
  },
  2022: {
    baseScores: v(145.89114, 125.41249, 127.67879, 127.39793, 110.46478),
    populations: { tyt: 2911511, say: 1429833, soz: 1494079, ea: 1780135, dil: 123163 },
    coefficients: {
      tytTurkish: v(2.84108, 1.19277, 1.15192, 1.21851, 1.46769),
      tytSocial: v(3.14372, 1.31983, 1.27462, 1.34831, 1.62403),
      tytMath: v(2.87306, 1.2062, 1.16489, 1.23223, 1.48421),
      tytScience: v(3.13342, 1.3155, 1.27045, 1.34389, 1.61871),
      aytLiterature: v(0, 0, 3.03078, 3.20599, 0),
      aytHistory1: v(0, 0, 3.15136, 3.33355, 0),
      aytGeography1: v(0, 0, 2.15242, 2.27685, 0),
      aytHistory2: v(0, 0, 3.51334, 0, 0),
      aytGeography2: v(0, 0, 2.21521, 0, 0),
      aytPhilosophy: v(0, 0, 3.89473, 0, 0),
      aytReligion: v(0, 0, 2.93121, 0, 0),
      aytMath: v(0, 2.59003, 0, 2.64593, 0),
      aytPhysics: v(0, 3.19248, 0, 0, 0),
      aytChemistry: v(0, 2.95035, 0, 0, 0),
      aytBiology: v(0, 3.11269, 0, 0, 0),
      ydtLanguage: v(0, 0, 0, 0, 2.62354),
    },
    anchors: {
      tyt: [[181.30201, 73.8, 229.30201, 66.52], [252.12379, 29.03, 300.12379, 27.44], [322.94556, 9.74, 370.94556, 9.99], [393.76734, 2.87, 441.76734, 3.19], [464.58911, 0.17, 512.58911, 0.3], [500, 0.01, 548, 0.01]],
      say: [[162.99054, 70.3, 210.99054, 64.25], [238.14659, 23.52, 286.14659, 23.82], [313.30264, 10.58, 361.30264, 10.99], [388.45869, 4.41, 436.45869, 4.81], [463.61474, 0.44, 511.61474, 0.75], [500, 0.01, 548, 0.02]],
      soz: [[166.48665, 86.55, 214.48665, 81.33], [244.10237, 29.23, 292.10237, 27.6], [321.71808, 4.25, 369.71808, 4.25], [399.3338, 0.18, 447.3338, 0.2], [476.94951, 0.01, 524.94951, 0.01], [500, 0.01, 548, 0.01]],
      ea: [[165.56308, 83.71, 213.56308, 77.59], [241.89347, 27.58, 289.89347, 27.05], [318.22386, 6.7, 366.22386, 7.32], [394.55424, 0.51, 442.55424, 0.62], [470.88463, 0.01, 518.88463, 0.02], [500, 0.01, 548, 0.01]],
      dil: [[149.74622, 93.41, 197.74622, 90.68], [228.30916, 60.23, 276.30916, 59.16], [306.87209, 33.08, 354.87209, 32.82], [385.43503, 10.14, 433.43503, 10.9], [463.99796, 0.82, 511.99796, 1.08], [500, 0.01, 548, 0.04]],
    },
  },
  2021: {
    baseScores: v(97.33913, 98.19321, 92.89618, 92.49281, 95.3699),
    populations: { tyt: 2393283, say: 910507, soz: 938291, ea: 1223186, dil: 87804 },
    coefficients: {
      tytTurkish: v(2.92085, 1.13335, 1.19364, 1.19998, 1.53655),
      tytSocial: v(2.97903, 1.15592, 1.21741, 1.22388, 1.56715),
      tytMath: v(4.52956, 1.75756, 1.85106, 1.86088, 2.38283),
      tytScience: v(3.1845, 1.23565, 1.30138, 1.30829, 1.67524),
      aytLiterature: v(0, 0, 3.01032, 3.02628, 0),
      aytHistory1: v(0, 0, 3.32767, 3.34532, 0),
      aytGeography1: v(0, 0, 2.35266, 2.36514, 0),
      aytHistory2: v(0, 0, 4.98424, 0, 0),
      aytGeography2: v(0, 0, 2.60652, 0, 0),
      aytPhilosophy: v(0, 0, 3.64756, 0, 0),
      aytReligion: v(0, 0, 2.7409, 0, 0),
      aytMath: v(0, 3.40447, 0, 3.6046, 0),
      aytPhysics: v(0, 3.47679, 0, 0, 0),
      aytChemistry: v(0, 2.4643, 0, 0, 0),
      aytBiology: v(0, 2.20583, 0, 0, 0),
      ydtLanguage: v(0, 0, 0, 0, 2.5191),
    },
    anchors: {
      tyt: [[139.46783, 74.57, 187.46783, 96.67], [223.7252, 25.1, 271.7252, 34.75], [307.98258, 5.95, 355.98258, 9.11], [392.23996, 0.7, 440.23996, 1.29], [476.49734, 0.01, 524.49734, 0.01], [500, 0.01, 548, 0.01]],
      say: [[139.09659, 88.93, 187.09659, 100], [220.90341, 25.23, 268.90341, 59.71], [302.71023, 9.47, 350.71023, 23.35], [384.51706, 1.82, 432.51706, 5.27], [466.32388, 0.02, 514.32388, 0.15], [500, 0.01, 548, 0.01]],
      soz: [[136.44807, 99.99, 184.44807, 100], [223.55192, 25.4, 271.55192, 39.63], [310.65578, 1.99, 358.65578, 3.31], [397.75964, 0.06, 445.75964, 0.1], [484.8635, 0.01, 532.8635, 0.01], [500, 0.01, 548, 0.01]],
      ea: [[136.24643, 96.99, 184.24643, 100], [223.75357, 20.91, 271.75357, 43.85], [311.26072, 2.52, 359.26072, 6.21], [398.76787, 0.07, 446.76787, 0.19], [486.27502, 0.01, 534.27502, 0.01], [500, 0.01, 548, 0.01]],
      dil: [[137.68496, 98.45, 185.68496, 100], [222.31502, 62.1, 270.31502, 75.3], [306.94508, 29.84, 354.94508, 36.45], [391.57515, 5.19, 439.57515, 7.35], [476.20522, 0.17, 524.20522, 0.2], [500, 0.01, 548, 0.02]],
    },
  },
  2020: {
    baseScores: v(99.42142, 99.13474, 94.45322, 98.19173, 99.02161),
    populations: { tyt: 2257671, say: 1183249, soz: 991718, ea: 1364125, dil: 91469 },
    coefficients: {
      tytTurkish: v(3.24013, 1.38438, 1.35339, 1.37684, 1.56545),
      tytSocial: v(3.65785, 1.56286, 1.52787, 1.55435, 1.76727),
      tytMath: v(3.34389, 1.42872, 1.39673, 1.42093, 1.61558),
      tytScience: v(3.40553, 1.45505, 1.42248, 1.44713, 1.64537),
      aytLiterature: v(0, 0, 3.12319, 3.1773, 0),
      aytHistory1: v(0, 0, 3.47483, 3.53504, 0),
      aytGeography1: v(0, 0, 2.91209, 2.96254, 0),
      aytHistory2: v(0, 0, 3.69502, 0, 0),
      aytGeography2: v(0, 0, 2.59947, 0, 0),
      aytPhilosophy: v(0, 0, 3.2201, 0, 0),
      aytReligion: v(0, 0, 3.94389, 0, 0),
      aytMath: v(0, 2.70774, 0, 2.69299, 0),
      aytPhysics: v(0, 3.15076, 0, 0, 0),
      aytChemistry: v(0, 2.77011, 0, 0, 0),
      aytBiology: v(0, 3.30868, 0, 0, 0),
      ydtLanguage: v(0, 0, 0, 0, 2.61746),
    },
    anchors: {
      tyt: [[139.88428, 81.69, 187.88428, 97.85], [220.81003, 34.94, 268.81003, 41.71], [301.73579, 10.52, 349.73579, 13.66], [382.66154, 2.81, 430.66154, 3.94], [463.58729, 0.13, 511.58729, 0.26], [500, 0.01, 548, 0.01]],
      say: [[139.56738, 89.22, 187.56738, 100], [220.43262, 29.83, 268.43262, 50.27], [301.29786, 13.26, 349.29786, 23.06], [382.1631, 5.72, 430.1631, 10.37], [463.02834, 0.5, 511.02834, 1.38], [500, 0.01, 548, 0.04]],
      soz: [[137.22659, 98.64, 185.22659, 100], [222.77342, 40.58, 270.77342, 44.68], [308.32025, 5.71, 356.32025, 6.5], [393.86708, 0.21, 441.86708, 0.28], [479.41391, 0.01, 527.41391, 0.01], [500, 0.01, 548, 0.01]],
      ea: [[139.09585, 96.89, 187.09585, 99.99], [220.90414, 34.52, 268.90414, 45.2], [302.71243, 9.12, 350.71243, 13.09], [384.52072, 0.72, 432.52072, 1.12], [466.329, 0.02, 514.329, 0.04], [500, 0.01, 548, 0.01]],
      dil: [[139.51078, 96.68, 187.51078, 100], [220.48919, 63.43, 268.48919, 71.39], [301.4676, 34, 349.4676, 38.32], [382.44601, 9.08, 430.44601, 11.02], [463.42442, 0.88, 511.42442, 1.14], [500, 0.01, 548, 0.05]],
    },
  },
  2019: {
    baseScores: v(100.00365, 99.6267, 95.11373, 98.2322, 98.14102),
    populations: { tyt: 2375217, say: 1142773, soz: 1232397, ea: 1436601, dil: 95605 },
    coefficients: {
      tytTurkish: v(3.10686, 1.23018, 1.39288, 1.30973, 1.57552),
      tytSocial: v(3.02843, 1.19913, 1.35771, 1.27667, 1.53575),
      tytMath: v(3.72496, 1.47492, 1.66998, 1.5703, 1.88897),
      tytScience: v(3.48961, 1.38174, 1.56447, 1.47108, 1.76962),
      aytLiterature: v(0, 0, 3.19369, 3.00304, 0),
      aytHistory1: v(0, 0, 3.17747, 2.98779, 0),
      aytGeography1: v(0, 0, 2.54785, 2.39576, 0),
      aytHistory2: v(0, 0, 3.3431, 0, 0),
      aytGeography2: v(0, 0, 2.74643, 0, 0),
      aytPhilosophy: v(0, 0, 3.1382, 0, 0),
      aytReligion: v(0, 0, 3.32196, 0, 0),
      aytMath: v(0, 2.97941, 0, 3.17207, 0),
      aytPhysics: v(0, 3.1103, 0, 0, 0),
      aytChemistry: v(0, 3.13062, 0, 0, 0),
      aytBiology: v(0, 3.08251, 0, 0, 0),
      ydtLanguage: v(0, 0, 0, 0, 2.58075),
    },
    anchors: {
      tyt: [[140.37431, 79.18, 188.37431, 97.57], [221.11931, 30.67, 269.11931, 37.5], [301.8643, 8.02, 349.8643, 10.84], [382.60929, 1.92, 430.60929, 2.8], [463.35428, 0.07, 511.35428, 0.15], [500, 0.01, 548, 0.01]],
      say: [[139.96085, 94.71, 187.96085, 100], [220.63056, 24.08, 268.63056, 56.09], [301.30027, 9.6, 349.30027, 23.16], [381.96998, 3.44, 429.96998, 8.87], [462.63969, 0.22, 510.63969, 0.88], [500, 0.01, 548, 0.02]],
      soz: [[138.04133, 92.48, 186.04133, 100], [223.89813, 39.68, 271.89813, 51.18], [309.75779, 5.83, 357.75779, 7.66], [395.61459, 0.17, 443.61459, 0.25], [481.47138, 0.01, 529.47138, 0.01], [500, 0.01, 548, 0.01]],
      ea: [[139.57165, 98.78, 187.57165, 100], [222.25203, 27.99, 270.25203, 46.34], [304.9351, 5.95, 352.9351, 10.99], [387.61547, 0.33, 435.61547, 0.74], [470.29585, 0.01, 518.29585, 0.02], [500, 0.01, 548, 0.01]],
      dil: [[139.25941, 97.03, 187.25941, 100], [221.49802, 60.26, 269.49802, 73.27], [303.73663, 30.41, 351.73663, 36.99], [385.97524, 7.44, 433.97524, 9.92], [468.21385, 0.59, 516.21385, 0.88], [500, 0.01, 548, 0.05]],
    },
  },
  2018: {
    baseScores: v(99.43477, 99.63265, 91.22186, 97.88902, 97.16977),
    populations: { tyt: 2218992, say: 1248135, soz: 1226046, ea: 1489712, dil: 89776 },
    coefficients: {
      tytTurkish: v(3.16533, 1.17565, 1.3648, 1.24361, 1.57225),
      tytSocial: v(3.60497, 1.33894, 1.55436, 1.41634, 1.79062),
      tytMath: v(3.47203, 1.28956, 1.49704, 1.36411, 1.72459),
      tytScience: v(3.3464, 1.2429, 1.44288, 1.31475, 1.66219),
      aytLiterature: v(0, 0, 3.25183, 2.96308, 0),
      aytHistory1: v(0, 0, 3.45132, 3.14485, 0),
      aytGeography1: v(0, 0, 2.7667, 2.52103, 0),
      aytHistory2: v(0, 0, 4.3952, 0, 0),
      aytGeography2: v(0, 0, 2.91162, 0, 0),
      aytPhilosophy: v(0, 0, 3.76334, 0, 0),
      aytReligion: v(0, 0, 2.46334, 0, 0),
      aytMath: v(0, 3.16541, 0, 3.34839, 0),
      aytPhysics: v(0, 3.6034, 0, 0, 0),
      aytChemistry: v(0, 2.86987, 0, 0, 0),
      aytBiology: v(0, 2.86297, 0, 0, 0),
      ydtLanguage: v(0, 0, 0, 0, 2.66526),
    },
    anchors: {
      tyt: [[139.88696, 90.89, 187.88696, 98.26], [220.79134, 32.63, 268.79134, 37.53], [301.69572, 8.57, 349.69572, 10.83], [382.6001, 2.09, 430.6001, 2.88], [463.50448, 0.06, 511.50448, 0.16], [500, 0.01, 548, 0.01]],
      say: [[139.81631, 97.07, 187.81631, 100], [220.1837, 18.76, 268.1837, 53.79], [300.55109, 7.35, 348.55109, 21.89], [380.91848, 2.6, 428.91848, 8.21], [461.28587, 0.2, 509.28587, 0.93], [500, 0.01, 548, 0.02]],
      soz: [[135.61094, 99.99, 183.61094, 100], [224.38906, 36.62, 272.38906, 43.4], [313.16717, 3.62, 361.16717, 4.59], [401.94528, 0.07, 449.94528, 0.09], [490.72339, 0.01, 538.72339, 0.01], [500, 0.01, 548, 0.01]],
      ea: [[138.94451, 99.67, 186.94451, 100], [221.05549, 23.11, 269.05549, 44.35], [303.16648, 4.41, 351.16648, 9.56], [385.27747, 0.23, 433.27747, 0.59], [467.38845, 0.01, 515.38845, 0.02], [500, 0.01, 548, 0.01]],
      dil: [[138.58488, 98.92, 186.58488, 100], [221.41513, 54.47, 269.41513, 70.64], [304.24538, 26.13, 352.24538, 34.22], [387.07563, 6.19, 435.07563, 8.88], [469.90587, 0.28, 517.90587, 0.61], [500, 0.01, 548, 0.02]],
    },
  },
};

export function isYksYear(value: number): value is YksYear {
  return yksYears.includes(value as YksYear);
}

export function calculateYksScore(input: YksCalculationInput): YksCalculationResult {
  const profile = yksProfiles[input.year];
  const nets = {} as Record<YksSubjectKey, number>;

  for (const subject of yksSubjects) {
    nets[subject.key] = calculateSubjectNet(
      input.subjects[subject.key],
      subject.questionCount
    );
  }

  const totals = {
    tyt: nets.tytTurkish + nets.tytSocial + nets.tytMath + nets.tytScience,
    ayt:
      nets.aytLiterature +
      nets.aytHistory1 +
      nets.aytGeography1 +
      nets.aytHistory2 +
      nets.aytGeography2 +
      nets.aytPhilosophy +
      nets.aytReligion +
      nets.aytMath +
      nets.aytPhysics +
      nets.aytChemistry +
      nets.aytBiology,
    ydt: nets.ydtLanguage,
  };
  const obp = normalizeObp(input.obp);
  const obpContribution = obp === null ? null : obp * (input.previousPlacement ? 0.06 : 0.12);
  const vocationalContribution = obp === null || !input.vocationalExtra ? null : obp * 0.06;
  const scores = {} as Record<YksScoreType, YksScoreResult>;

  for (const type of ["tyt", "say", "soz", "ea", "dil"] as const) {
    const validity = getScoreValidity(type, nets);
    const population = profile.populations[type];

    if (!validity.valid) {
      scores[type] = {
        type,
        valid: false,
        reason: validity.reason,
        score: null,
        rank: null,
        percentile: null,
        population,
        placementScore: null,
        placementRank: null,
        placementPercentile: null,
        vocationalPlacementScore: null,
        vocationalPlacementRank: null,
        vocationalPlacementPercentile: null,
      };
      continue;
    }

    const score = clampScore(calculateRawScore(profile, type, nets));
    const percentile = estimatePercentile(profile, type, score, false);
    const rank = estimateRank(population, percentile, score);
    const placementScore =
      obpContribution === null ? null : clampPlacementScore(score + obpContribution);
    const placementPercentile =
      placementScore === null
        ? null
        : estimatePercentile(profile, type, placementScore, true);
    const placementRank =
      placementPercentile === null
        ? null
        : estimateRank(population, placementPercentile, placementScore ?? score);
    const vocationalPlacementScore =
      placementScore === null || vocationalContribution === null
        ? null
        : clampPlacementScore(placementScore + vocationalContribution);
    const vocationalPlacementPercentile =
      vocationalPlacementScore === null
        ? null
        : estimatePercentile(profile, type, vocationalPlacementScore, true);
    const vocationalPlacementRank =
      vocationalPlacementScore === null || vocationalPlacementPercentile === null
        ? null
        : estimateRank(population, vocationalPlacementPercentile, vocationalPlacementScore);

    scores[type] = {
      type,
      valid: true,
      score,
      rank,
      percentile,
      population,
      placementScore,
      placementRank,
      placementPercentile,
      vocationalPlacementScore,
      vocationalPlacementRank,
      vocationalPlacementPercentile,
    };
  }

  return {
    year: input.year,
    nets,
    totals,
    obp,
    obpContribution,
    vocationalContribution,
    scores,
  };
}

export function calculateSubjectNet(input: YksSubjectInput, questionCount: number) {
  const correct = input.correct ?? 0;
  const wrong = input.wrong;

  if (wrong === null) {
    return clamp(correct, 0, questionCount);
  }

  return clamp(correct - wrong / 4, 0, questionCount);
}

export function normalizeObp(value: number | null) {
  if (value === null) {
    return null;
  }

  if (value >= 50 && value <= 100) {
    return value * 5;
  }

  if (value >= 250 && value <= 500) {
    return value;
  }

  return null;
}

function calculateRawScore(
  profile: YksProfile,
  type: YksScoreType,
  nets: Record<YksSubjectKey, number>
) {
  let score = profile.baseScores[type];

  for (const subject of yksSubjects) {
    score += nets[subject.key] * profile.coefficients[subject.key][type];
  }

  return score;
}

function getScoreValidity(
  type: YksScoreType,
  nets: Record<YksSubjectKey, number>
): { valid: boolean; reason?: string } {
  const tytValid = nets.tytTurkish >= 0.5 || nets.tytMath >= 0.5;

  if (!tytValid) {
    return {
      valid: false,
      reason: "TYT puanı için Türkçe veya Temel Matematik testinden en az 0,5 net gerekir.",
    };
  }

  if (type === "tyt") {
    return { valid: true };
  }

  if (type === "say" && nets.aytMath + nets.aytPhysics + nets.aytChemistry + nets.aytBiology < 0.5) {
    return { valid: false, reason: "SAY için AYT Matematik veya Fen alanından en az 0,5 net gerekir." };
  }

  if (type === "ea" && nets.aytMath + nets.aytLiterature + nets.aytHistory1 + nets.aytGeography1 < 0.5) {
    return { valid: false, reason: "EA için AYT Matematik veya Edebiyat-Sosyal-1 alanından en az 0,5 net gerekir." };
  }

  if (
    type === "soz" &&
    nets.aytLiterature +
      nets.aytHistory1 +
      nets.aytGeography1 +
      nets.aytHistory2 +
      nets.aytGeography2 +
      nets.aytPhilosophy +
      nets.aytReligion <
      0.5
  ) {
    return { valid: false, reason: "SÖZ için ilgili AYT sözel testlerinden en az 0,5 net gerekir." };
  }

  if (type === "dil" && nets.ydtLanguage < 0.5) {
    return { valid: false, reason: "DİL için YDT testinden en az 0,5 net gerekir." };
  }

  return { valid: true };
}

function estimatePercentile(
  profile: YksProfile,
  type: YksScoreType,
  score: number,
  placement: boolean
) {
  const anchors = profile.anchors[type].map((item) => ({
    score: placement ? item[2] : item[0],
    percentile: placement ? item[3] : item[1],
  }));

  if (score <= anchors[0].score) {
    return clamp(anchors[0].percentile, 0.01, 100);
  }

  for (let index = 1; index < anchors.length; index += 1) {
    const previous = anchors[index - 1];
    const next = anchors[index];

    if (score <= next.score) {
      const ratio = (score - previous.score) / (next.score - previous.score);
      const previousLog = Math.log(previous.percentile);
      const nextLog = Math.log(next.percentile);
      return clamp(
        Math.exp(previousLog + ratio * (nextLog - previousLog)),
        0.01,
        100
      );
    }
  }

  return anchors[anchors.length - 1].percentile;
}

function estimateRank(population: number, percentile: number, score: number) {
  if (score >= 499.999) {
    return 1;
  }

  return Math.max(1, Math.round((population * percentile) / 100));
}

function clampScore(score: number) {
  if (score > 499.99) {
    return 500;
  }

  return clamp(score, 100, 500);
}

function clampPlacementScore(score: number) {
  return clamp(score, 100, 560);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
