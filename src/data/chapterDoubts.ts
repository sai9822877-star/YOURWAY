/**
 * Chapter Doubts & Sub-Topic Explaining Videos Catalog
 * Provides MCQ-style conceptual doubt diagnostics when a video finishes.
 * If a student clicks any topic, its targeted explaining video opens right in front of them.
 */

import { Topic } from '../types';

export interface ChapterSubTopicDoubt {
  id: string;
  name: string;
  doubtPrompt: string; // The MCQ-styled question phrasing
  targetedVideoId: string; // Laser-focused video specifically explaining this sub-topic
  targetedVideoTitle: string;
  channel: string;
  durationMinutes: number;
  keyNotes: string[];
  quickCheckQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface ChapterDoubtCatalog {
  topicId: string;
  topicName: string;
  subjectName: string;
  subTopics: ChapterSubTopicDoubt[];
}

export const CHAPTER_DOUBTS_CATALOG: Record<string, ChapterDoubtCatalog> = {
  // Class 9 Maths - Polynomials & Factorization
  top_math_2: {
    topicId: 'top_math_2',
    topicName: 'Polynomials & Factorization',
    subjectName: 'Mathematics',
    subTopics: [
      {
        id: 'sub_poly_1',
        name: 'Degree & Classification of Polynomials',
        doubtPrompt: 'How to find the degree of polynomials and distinguish monomials, binomials, and trinomials?',
        targetedVideoId: 'm-lC4xU_y3o',
        targetedVideoTitle: 'Degree of Polynomials Class 9 Maths | Concepts & Practice',
        channel: 'Dear Sir',
        durationMinutes: 8,
        keyNotes: [
          'The degree of a polynomial in one variable is the highest exponent of the variable.',
          'Constant non-zero polynomial has degree 0 (e.g. 7 = 7x⁰).',
          'The degree of the zero polynomial (0) is NOT defined.',
          'Polynomial terms must only have non-negative integer exponents (whole numbers: 0, 1, 2...).',
        ],
        quickCheckQuestion: {
          question: 'What is the degree of the polynomial p(x) = 4x⁵ - 3x² + 7x⁷ - 9?',
          options: ['5', '2', '7', '9'],
          correctIndex: 2,
          explanation: 'The highest exponent of x in the expression is 7 (from the term 7x⁷). Therefore, the degree is 7.',
        },
      },
      {
        id: 'sub_poly_2',
        name: 'Zeroes of a Polynomial & Root Finding',
        doubtPrompt: 'How to calculate zeroes of a polynomial p(x) = 0 and verify geometric roots?',
        targetedVideoId: 'X63Wc23sXv8',
        targetedVideoTitle: 'Zeroes of a Polynomial Class 9 | Complete Concept',
        channel: 'Physics Wallah Foundation',
        durationMinutes: 10,
        keyNotes: [
          'A real number k is a zero of a polynomial p(x) if p(k) = 0.',
          'A non-zero constant polynomial has no zeroes.',
          'Every real number is a zero of the zero polynomial.',
          'A linear polynomial ax + b (a ≠ 0) has one and only one zero: x = -b/a.',
        ],
        quickCheckQuestion: {
          question: 'Find the zero of the linear polynomial p(x) = 3x - 12.',
          options: ['-4', '4', '12', '-12'],
          correctIndex: 1,
          explanation: 'Set p(x) = 0 => 3x - 12 = 0 => 3x = 12 => x = 4.',
        },
      },
      {
        id: 'sub_poly_3',
        name: 'Remainder Theorem & Quick Remainder Evaluation',
        doubtPrompt: 'How to apply the Remainder Theorem to find remainders without performing long division?',
        targetedVideoId: 'lWz0EwL-QJg',
        targetedVideoTitle: 'Remainder Theorem Class 9th Maths | Quick Shortcut & Proof',
        channel: 'Magnet Brains',
        durationMinutes: 12,
        keyNotes: [
          'Remainder Theorem: Let p(x) be any polynomial of degree ≥ 1, and a be any real number.',
          'If p(x) is divided by the linear polynomial (x - a), then the remainder is simply p(a).',
          'If divided by (ax + b), the remainder is p(-b/a).',
          'This eliminates the need to execute multi-step algebraic long division.',
        ],
        quickCheckQuestion: {
          question: 'Find the remainder when p(x) = x³ - 3x² + 4x - 5 is divided by (x - 2).',
          options: ['-1', '3', '-5', '5'],
          correctIndex: 0,
          explanation: 'By Remainder Theorem, Remainder = p(2) = (2)³ - 3(2)² + 4(2) - 5 = 8 - 12 + 8 - 5 = -1.',
        },
      },
      {
        id: 'sub_poly_4',
        name: 'Factor Theorem & Splitting the Middle Term',
        doubtPrompt: 'How to master Factor Theorem and easily split middle terms for quadratic expressions?',
        targetedVideoId: '8RV-37qk-c4',
        targetedVideoTitle: 'Factor Theorem & Middle Term Splitting | Masterclass',
        channel: 'ExpHub — Prashant Kirad',
        durationMinutes: 14,
        keyNotes: [
          'Factor Theorem: (x - a) is a factor of p(x) if and only if p(a) = 0.',
          'To factorize ax² + bx + c: find two numbers p and q such that p + q = b and pq = ac.',
          'Rewrite bx as px + qx and factor by grouping.',
          'For cubic polynomials, find the first root by trial (divisors of constant term), then divide to get a quadratic.',
        ],
        quickCheckQuestion: {
          question: 'What is the factorization of 6x² + 17x + 5 by splitting the middle term?',
          options: ['(2x + 1)(3x + 5)', '(6x + 5)(x + 1)', '(2x + 5)(3x + 1)', '(3x - 1)(2x - 5)'],
          correctIndex: 0,
          explanation: 'ac = 6 * 5 = 30. Two numbers that add to 17 and multiply to 30 are 15 and 2. 6x² + 15x + 2x + 5 = 3x(2x + 5) + 1(2x + 5) or grouping yields (2x + 1)(3x + 5).',
        },
      },
      {
        id: 'sub_poly_5',
        name: 'Algebraic Identities Expansion & Verification',
        doubtPrompt: 'How to expand and apply standard identities like (x+y+z)², (x±y)³, and x³+y³+z³-3xyz?',
        targetedVideoId: '0yZ5f4m4Vn8',
        targetedVideoTitle: 'Algebraic Identities Class 9 in 15 Minutes | Dear Sir Tricks',
        channel: 'Dear Sir',
        durationMinutes: 15,
        keyNotes: [
          '(x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx',
          '(x + y)³ = x³ + y³ + 3xy(x + y)',
          '(x - y)³ = x³ - y³ - 3xy(x - y)',
          'x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx)',
          'Conditional Identity: If x + y + z = 0, then x³ + y³ + z³ = 3xyz.',
        ],
        quickCheckQuestion: {
          question: 'If a + b + c = 0, what is the value of a³ + b³ + c³?',
          options: ['0', 'abc', '3abc', '(a+b+c)³'],
          correctIndex: 2,
          explanation: 'Using the identity x³+y³+z³-3xyz = (x+y+z)(x²+y²+z²-xy-yz-zx), if x+y+z = 0, the right side becomes 0, so x³+y³+z³ = 3xyz.',
        },
      },
    ],
  },

  // Class 9 Science - Matter in Our Surroundings
  top_sci_1: {
    topicId: 'top_sci_1',
    topicName: 'Matter in Our Surroundings',
    subjectName: 'Science',
    subTopics: [
      {
        id: 'sub_sci_1',
        name: 'Physical Nature of Matter & Kinetic Theory',
        doubtPrompt: 'How particulate theory explains intermolecular space and kinetic energy in solids, liquids, and gases?',
        targetedVideoId: 'bmzDsWMSCTk',
        targetedVideoTitle: 'States of Matter & Kinetic Particle Theory | Class 9 Science',
        channel: 'ExpHub — Prashant Kirad',
        durationMinutes: 9,
        keyNotes: [
          'Matter is made up of particles that have spaces between them.',
          'Particles of matter are continuously moving and possess kinetic energy.',
          'Kinetic energy increases directly with temperature.',
          'Diffusion is the intermixing of particles of two different types of matter on their own.',
        ],
        quickCheckQuestion: {
          question: 'When temperature increases, what happens to the rate of diffusion?',
          options: ['Decreases', 'Remains unchanged', 'Increases', 'Drops to zero'],
          correctIndex: 2,
          explanation: 'Increasing temperature increases the kinetic energy of particles, making them move faster and diffusing quicker.',
        },
      },
      {
        id: 'sub_sci_2',
        name: 'Latent Heat of Fusion and Vaporization',
        doubtPrompt: 'Why does temperature remain constant during phase changes despite heating?',
        targetedVideoId: 'd9tySXcfT-I',
        targetedVideoTitle: 'Latent Heat Explained | Physics Wallah',
        channel: 'Physics Wallah Foundation',
        durationMinutes: 11,
        keyNotes: [
          'Latent heat of fusion: heat energy required to change 1 kg of a solid into liquid at atmospheric pressure at its melting point.',
          'Latent heat of vaporization: heat energy required to change 1 kg of liquid into gas at its boiling point.',
          'Temperature remains constant because heat is absorbed to overcome intermolecular forces of attraction.',
        ],
        quickCheckQuestion: {
          question: 'Particles in water at 0°C (273 K) have more energy than particles in ice at the same temperature because:',
          options: [
            'Ice has more latent heat',
            'Water particles have absorbed latent heat of fusion',
            'Water particles are stationary',
            'Ice particles move faster',
          ],
          correctIndex: 1,
          explanation: 'Water at 0°C contains additional latent heat of fusion that was absorbed to break the crystal lattice of ice.',
        },
      },
      {
        id: 'sub_sci_3',
        name: 'Evaporation Factors & Cooling Mechanisms',
        doubtPrompt: 'How humidity, wind speed, surface area, and temperature affect evaporation cooling?',
        targetedVideoId: 'p0l4x7fC97Q',
        targetedVideoTitle: 'Evaporation & Cooling Effect | Concepts & Applications',
        channel: 'ExpHub — Prashant Kirad',
        durationMinutes: 8,
        keyNotes: [
          'Evaporation is a surface phenomenon occurring at temperatures below boiling point.',
          'Rate increases with: increased surface area, increased temperature, increased wind speed.',
          'Rate decreases with: increased atmospheric humidity.',
          'Causes cooling because high-energy surface particles take latent heat from surroundings.',
        ],
        quickCheckQuestion: {
          question: 'Why do we wear cotton clothes in summer?',
          options: [
            'Cotton reflects sunlight completely',
            'Cotton absorbs sweat and exposes it to atmosphere for evaporative cooling',
            'Cotton traps cold air next to skin',
            'Cotton has low specific heat capacity',
          ],
          correctIndex: 1,
          explanation: 'Cotton is a good absorber of water; it absorbs sweat, exposing it to air for fast evaporation which cools the body.',
        },
      },
    ],
  },
};

/**
 * Universal fallback generator that builds structured doubts and targeted videos
 * for any topic based on its learning outcomes and subject.
 */
export function getDoubtsForTopic(topic: Topic): ChapterDoubtCatalog {
  if (CHAPTER_DOUBTS_CATALOG[topic.id]) {
    return CHAPTER_DOUBTS_CATALOG[topic.id];
  }

  const outcomes = topic.learningOutcomes || [
    'Fundamental conceptual definitions and principles',
    'Application of key formulas and problem-solving steps',
    'Common exam misconceptions and step-by-step proofs',
    'Real-life scenario questions and NCERT exercises',
  ];

  const subTopics: ChapterSubTopicDoubt[] = outcomes.map((outcome, idx) => {
    return {
      id: `doubt_${topic.id}_${idx + 1}`,
      name: outcome.split(':')[0] || `Key Concept ${idx + 1}`,
      doubtPrompt: `Do you have doubt in: "${outcome}"?`,
      targetedVideoId: topic.youtubeVideoId,
      targetedVideoTitle: `${topic.name} — ${outcome.slice(0, 45)}...`,
      channel: topic.youtubeChannel || 'Your Way Academy',
      durationMinutes: 10 + idx * 2,
      keyNotes: [
        outcome,
        `Master the core principles of ${topic.name} required by the CBSE/NCERT curriculum.`,
        `Practice solving at least 3 problems directly applying this concept to lock in your XP.`,
      ],
      quickCheckQuestion: {
        question: `Which statement best describes ${outcome.slice(0, 50)}...?`,
        options: [
          'It is a fundamental principle verified through standard NCERT derivation.',
          'It only applies in laboratory conditions with zero friction.',
          'It is an empirical approximation that requires no formula.',
          'It is an optional extension topic.',
        ],
        correctIndex: 0,
        explanation: `This is a foundational concept in ${topic.name} emphasized in CBSE board examinations.`,
      },
    };
  });

  return {
    topicId: topic.id,
    topicName: topic.name,
    subjectName: topic.subjectId.includes('math') ? 'Mathematics' : topic.subjectId.includes('sci') ? 'Science' : 'Core Subject',
    subTopics,
  };
}
