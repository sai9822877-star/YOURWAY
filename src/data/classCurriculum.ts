/**
 * Your Way — Multi-Class Dynamic Curriculum Database
 * Provides tailored NCERT/CBSE curriculum for Class 6 through Class 12:
 * - Class 6, Class 7, Class 8, Class 9, Class 10, Class 11, Class 12
 * - Verified educators: Physics Wallah (PW), Magnet Brains, Prashant Kirad, Dear Sir, Digraj Sir, Khan Academy
 */

import { ClassLevel, Subject, Topic, Question, Achievement, LeaderboardEntry } from '../types';
import { DEMO_SUBJECTS, DEMO_TOPICS, DEMO_QUESTIONS } from './demoData';
import { CLASS_10_TOPICS } from './class10Curriculum';
import { CLASS_11_TOPICS } from './class11Curriculum';

export const ALL_CLASSES: ClassLevel[] = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

export function getGroupSubjectOptions(classLevel: ClassLevel): string[] {
  switch (classLevel) {
    case 'Class 1':
    case 'Class 2':
    case 'Class 3':
    case 'Class 4':
    case 'Class 5':
      return [
        'Mathematics',
        'English',
        'Environmental Studies (EVS)',
        'General Science',
        'Hindi',
        'General Knowledge',
      ];
    case 'Class 6':
    case 'Class 7':
    case 'Class 8':
      return [
        'Mathematics',
        'Science',
        'English',
        'Social Science',
        'Hindi',
        'Computer Science',
      ];
    case 'Class 9':
    case 'Class 10':
      return [
        'Mathematics',
        'Science',
        'English',
        'Social Science',
        'Hindi',
        'Information Technology',
      ];
    case 'Class 11':
    case 'Class 12':
      return [
        'Physics',
        'Chemistry',
        'Mathematics',
        'Biology',
        'English Core',
        'Computer Science',
        'Economics',
        'Business Studies',
        'Accountancy',
      ];
    default:
      return ['Mathematics', 'Science', 'English', 'Social Science'];
  }
}

// Standard achievements across the platform
export const APP_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_class',
    title: 'First Class',
    description: 'Complete your first learning session on Your Way.',
    icon: '🏆',
    xpReward: 50,
  },
  {
    id: 'ach_7_day_streak',
    title: '7 Day Streak',
    description: 'Study consecutively for 7 days in a row.',
    icon: '🔥',
    xpReward: 150,
  },
  {
    id: 'ach_1000_xp',
    title: '1,000 XP Milestone',
    description: 'Earn 1,000 XP across lessons and practice quizzes.',
    icon: '⭐',
    xpReward: 200,
  },
  {
    id: 'ach_50_lessons',
    title: '50 Lessons Master',
    description: 'Complete 50 educational lessons across your subjects.',
    icon: '📚',
    xpReward: 300,
  },
  {
    id: 'ach_quiz_master',
    title: 'Quiz Master',
    description: 'Answer 20 diagnostic & practice questions correctly.',
    icon: '🎯',
    xpReward: 100,
  },
  {
    id: 'ach_course_completed',
    title: 'Course Completed',
    description: 'Successfully complete an entire personalized subject syllabus.',
    icon: '🚀',
    xpReward: 500,
  },
];

// Helper to generate subjects for each class
export function getSubjectsForClass(classLevel: ClassLevel): Subject[] {
  switch (classLevel) {
    case 'Class 6':
      return [
        {
          id: 'sub_c6_maths',
          name: 'Mathematics',
          class: 'Class 6',
          description: 'Integers, Whole Numbers, Fractions, Decimals, Basic Geometry, and Data Handling.',
          iconName: 'Calculator',
          color: 'indigo',
        },
        {
          id: 'sub_c6_science',
          name: 'Science',
          class: 'Class 6',
          description: 'Components of Food, Sorting Materials, Getting to Know Plants, and Light.',
          iconName: 'Atom',
          color: 'emerald',
        },
        {
          id: 'sub_c6_english',
          name: 'English',
          class: 'Class 6',
          description: 'Nouns, Pronouns, Verbs, Tenses, Reading Comprehension, and Honeysuckle prose.',
          iconName: 'BookOpen',
          color: 'sky',
        },
        {
          id: 'sub_c6_social_science',
          name: 'Social Science',
          class: 'Class 6',
          description: 'What Where How, Early Humans, Globe & Maps, and Democratic Government.',
          iconName: 'Globe',
          color: 'amber',
        },
      ];

    case 'Class 7':
      return [
        {
          id: 'sub_c7_maths',
          name: 'Mathematics',
          class: 'Class 7',
          description: 'Integers, Fractions & Decimals, Simple Equations, Triangles, and Lines & Angles.',
          iconName: 'Calculator',
          color: 'indigo',
        },
        {
          id: 'sub_c7_science',
          name: 'Science',
          class: 'Class 7',
          description: 'Nutrition in Plants & Animals, Heat, Acids & Bases, and Motion & Time.',
          iconName: 'Atom',
          color: 'emerald',
        },
        {
          id: 'sub_c7_english',
          name: 'English',
          class: 'Class 7',
          description: 'Tenses, Active & Passive Voice, Modals, Honeycomb literature, and Writing.',
          iconName: 'BookOpen',
          color: 'sky',
        },
        {
          id: 'sub_c7_social_science',
          name: 'Social Science',
          class: 'Class 7',
          description: 'Medieval India, Delhi Sultans, Environment, Water, and Equality in Democracy.',
          iconName: 'Globe',
          color: 'amber',
        },
      ];

    case 'Class 8':
      return [
        {
          id: 'sub_c8_maths',
          name: 'Mathematics',
          class: 'Class 8',
          description: 'Rational Numbers, Linear Equations, Quadrilaterals, Algebraic Expressions, and Mensuration.',
          iconName: 'Calculator',
          color: 'indigo',
        },
        {
          id: 'sub_c8_science',
          name: 'Science',
          class: 'Class 8',
          description: 'Cell Structure, Force & Pressure, Microorganisms, Sound, Friction, and Light.',
          iconName: 'Atom',
          color: 'emerald',
        },
        {
          id: 'sub_c8_english',
          name: 'English',
          class: 'Class 8',
          description: 'Direct & Indirect Speech, Prepositions, Conjunctions, Honeydew, and Essay Writing.',
          iconName: 'BookOpen',
          color: 'sky',
        },
        {
          id: 'sub_c8_social_science',
          name: 'Social Science',
          class: 'Class 8',
          description: 'Modern Indian History (1857 Revolt), Resources, Indian Constitution, and Judiciary.',
          iconName: 'Globe',
          color: 'amber',
        },
      ];

    case 'Class 9':
      return DEMO_SUBJECTS;

    case 'Class 10':
      return [
        {
          id: 'sub_c10_maths',
          name: 'Mathematics',
          class: 'Class 10',
          description: 'Real Numbers, Polynomials, Quadratic Equations, Trigonometry, Circles, and Statistics.',
          iconName: 'Calculator',
          color: 'indigo',
        },
        {
          id: 'sub_c10_science',
          name: 'Science',
          class: 'Class 10',
          description: 'Chemical Reactions, Acids & Bases, Life Processes, Light, Electricity, and Magnetic Effects.',
          iconName: 'Atom',
          color: 'emerald',
        },
        {
          id: 'sub_c10_english',
          name: 'English',
          class: 'Class 10',
          description: 'Reported Speech, Subject-Verb Agreement, First Flight, and Analytical Paragraphs.',
          iconName: 'BookOpen',
          color: 'sky',
        },
        {
          id: 'sub_c10_social_science',
          name: 'Social Science',
          class: 'Class 10',
          description: 'Nationalism in Europe & India, Power Sharing, Federalism, and Economic Development.',
          iconName: 'Globe',
          color: 'amber',
        },
      ];

    case 'Class 11':
      return [
        {
          id: 'sub_c11_maths',
          name: 'Mathematics',
          class: 'Class 11',
          description: 'Sets, Trigonometric Functions, Complex Numbers, Permutations, Calculus, and 3D Geometry.',
          iconName: 'Calculator',
          color: 'indigo',
        },
        {
          id: 'sub_c11_physics',
          name: 'Physics',
          class: 'Class 11',
          description: 'Units & Measurements, Kinematics, Laws of Motion, Rotational Motion, Fluids, and Thermodynamics.',
          iconName: 'Atom',
          color: 'emerald',
        },
        {
          id: 'sub_c11_chemistry',
          name: 'Chemistry',
          class: 'Class 11',
          description: 'Structure of Atom, Chemical Bonding, Thermodynamics, Equilibrium, and Organic Chemistry GOC.',
          iconName: 'FlaskConical',
          color: 'sky',
        },
        {
          id: 'sub_c11_biology',
          name: 'Biology',
          class: 'Class 11',
          description: 'Cell Biology, Plant Physiology, Human Respiration, Circulation, Excretion, and Biomolecules.',
          iconName: 'Dna',
          color: 'teal',
        },
        {
          id: 'sub_c11_english',
          name: 'English Core',
          class: 'Class 11',
          description: 'Hornbill, Snapshots, Note Making, Speech Writing, and Advanced Formal Communication.',
          iconName: 'BookOpen',
          color: 'amber',
        },
      ];

    case 'Class 12':
      return [
        {
          id: 'sub_c12_maths',
          name: 'Mathematics',
          class: 'Class 12',
          description: 'Matrices, Determinants, Calculus (Differentiation & Integration), Vectors, and Probability.',
          iconName: 'Calculator',
          color: 'indigo',
        },
        {
          id: 'sub_c12_physics',
          name: 'Physics',
          class: 'Class 12',
          description: 'Electrostatics, Current Electricity, Magnetism, Optics, and Modern Physics.',
          iconName: 'Atom',
          color: 'emerald',
        },
        {
          id: 'sub_c12_chemistry',
          name: 'Chemistry',
          class: 'Class 12',
          description: 'Solutions, Electrochemistry, Chemical Kinetics, Coordination Compounds, and Organic Reactions.',
          iconName: 'FlaskConical',
          color: 'sky',
        },
        {
          id: 'sub_c12_english',
          name: 'English Core',
          class: 'Class 12',
          description: 'Flamingo, Vistas, Reading Comprehension, Report Writing, and Formal Letters.',
          iconName: 'BookOpen',
          color: 'amber',
        },
      ];

    default:
      return DEMO_SUBJECTS;
  }
}

// Generate topics for any class level
export function getTopicsForClass(classLevel: ClassLevel): Topic[] {
  if (classLevel === 'Class 9') {
    return DEMO_TOPICS;
  }

  // Generate customized topics for Class 6, 7, 8, 10, 11, 12
  const subjects = getSubjectsForClass(classLevel);

  const topicTemplates: Partial<Record<ClassLevel, Array<{
    subjectIndex: number;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    duration: number;
    videoId: string;
    title: string;
    channel: string;
    outcomes: string[];
    educators: Array<{ educator: string; channelName: string; youtubeVideoId: string; title: string }>;
  }>>> = {
    'Class 6': [
      {
        subjectIndex: 0,
        name: 'Knowing Our Numbers & Place Value',
        difficulty: 'Easy',
        duration: 30,
        videoId: '7o0cEBn2E5Y',
        title: 'Knowing Our Numbers Class 6 Full Chapter | Dear Sir',
        channel: 'Dear Sir',
        outcomes: ['Understand Indian and International place value charts', 'Compare large multi-digit numbers', 'Estimate sums and products using rounding off'],
        educators: [
          { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Knowing Our Numbers Class 6 Full Chapter | Dear Sir' },
          { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'G93Me80fi5M', title: 'Knowing Our Numbers Class 6 | Magnet Brains' },
        ],
      },
      {
        subjectIndex: 0,
        name: 'Fractions & Decimals Basics',
        difficulty: 'Medium',
        duration: 35,
        videoId: 's9pB2z8H9yA',
        title: 'Fractions in One Shot | Class 6 Maths | Magnet Brains',
        channel: 'Magnet Brains',
        outcomes: ['Identify proper, improper and mixed fractions', 'Represent fractions on the number line', 'Perform addition and subtraction of like and unlike fractions'],
        educators: [
          { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 's9pB2z8H9yA', title: 'Fractions in One Shot | Class 6 Maths | Magnet Brains' },
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Fractions Class 6th Full Chapter | PW Foundation' },
        ],
      },
      {
        subjectIndex: 1,
        name: 'Components of Food & Balanced Diet',
        difficulty: 'Easy',
        duration: 30,
        videoId: 'G93Me80fi5M',
        title: 'Components of Food Class 6 Science | Magnet Brains',
        channel: 'Magnet Brains',
        outcomes: ['Test for starch, protein and fats in food samples', 'Understand deficiency diseases and symptoms', 'Build a balanced dietary plan'],
        educators: [
          { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'G93Me80fi5M', title: 'Components of Food Class 6 Science | Magnet Brains' },
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'd9tySXcfT-I', title: 'Components of Food Full Chapter | PW Foundation' },
        ],
      },
      {
        subjectIndex: 2,
        name: 'Nouns, Pronouns & Sentence Structure',
        difficulty: 'Easy',
        duration: 25,
        videoId: 'pXZtRXpGNck',
        title: 'English Grammar for Class 6 | Dear Sir',
        channel: 'Dear Sir',
        outcomes: ['Identify types of nouns: collective, abstract, proper', 'Use subject and object pronouns correctly', 'Construct declarative, interrogative, and imperative sentences'],
        educators: [
          { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'English Grammar for Class 6 | Dear Sir' },
        ],
      },
      {
        subjectIndex: 3,
        name: 'What, Where, How and When? (Early History)',
        difficulty: 'Medium',
        duration: 35,
        videoId: 'N4KswB4OA0c',
        title: 'What, Where, How and When Class 6 History | Digraj Sir',
        channel: 'Social School — Digraj Sir',
        outcomes: ['Analyze historical sources: manuscripts, inscriptions, archaeology', 'Trace early settlements along the Narmada and Indus rivers', 'Understand dates BC and AD notation'],
        educators: [
          { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'What, Where, How and When Class 6 History | Digraj Sir' },
        ],
      },
    ],

    'Class 7': [
      {
        subjectIndex: 0,
        name: 'Integers: Properties & Multiplication',
        difficulty: 'Easy',
        duration: 35,
        videoId: 'jC6MW9KOQvU',
        title: 'Integers Class 7 Maths Full Chapter | Prashant Kirad',
        channel: 'ExpHub — Prashant Kirad',
        outcomes: ['Apply closure, commutative and associative properties of integers', 'Master rules of multiplication and division of negative numbers', 'Solve word problems involving temperature and elevation changes'],
        educators: [
          { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Integers Class 7 Maths Full Chapter | Prashant Kirad' },
          { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Integers Concept & Tricks | Dear Sir' },
        ],
      },
      {
        subjectIndex: 1,
        name: 'Nutrition in Plants & Photosynthesis',
        difficulty: 'Medium',
        duration: 35,
        videoId: 'd9tySXcfT-I',
        title: 'Nutrition in Plants Class 7 Full Chapter | Physics Wallah',
        channel: 'Physics Wallah Foundation',
        outcomes: ['Explain the light-dependent process of photosynthesis', 'Distinguish autotrophic, heterotrophic, saprotrophic and parasitic nutrition', 'Identify stomata, chlorophyll and root absorption mechanisms'],
        educators: [
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'd9tySXcfT-I', title: 'Nutrition in Plants Class 7 Full Chapter | Physics Wallah' },
          { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'G93Me80fi5M', title: 'Nutrition in Plants | Class 7 Science | Magnet Brains' },
        ],
      },
      {
        subjectIndex: 2,
        name: 'Tenses & Active-Passive Voice',
        difficulty: 'Medium',
        duration: 30,
        videoId: 'pXZtRXpGNck',
        title: 'Learn Tenses in English Grammar with Examples | Dear Sir',
        channel: 'Dear Sir',
        outcomes: ['Convert sentences between active and passive voice across tenses', 'Identify past continuous and present perfect tense structures', 'Correct subject-verb agreement mismatches'],
        educators: [
          { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Learn Tenses in English Grammar with Examples | Dear Sir' },
        ],
      },
      {
        subjectIndex: 3,
        name: 'Our Environment & Earth Spheres',
        difficulty: 'Easy',
        duration: 30,
        videoId: 'N4KswB4OA0c',
        title: 'Environment Class 7 Geography Full Chapter | Digraj Sir',
        channel: 'Social School — Digraj Sir',
        outcomes: ['Analyze lithosphere, hydrosphere, atmosphere and biosphere interactions', 'Understand biotic and abiotic ecosystems', 'Recognize human impacts on environmental equilibrium'],
        educators: [
          { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Environment Class 7 Geography Full Chapter | Digraj Sir' },
        ],
      },
    ],

    'Class 8': [
      {
        subjectIndex: 0,
        name: 'Rational Numbers & Number Line',
        difficulty: 'Easy',
        duration: 35,
        videoId: 'jC6MW9KOQvU',
        title: 'Rational Numbers Class 8 Full Chapter | Prashant Kirad',
        channel: 'ExpHub — Prashant Kirad',
        outcomes: ['Represent positive and negative rational numbers on number lines', 'Find multiple rational numbers between any two given numbers', 'Apply distributive property of multiplication over addition'],
        educators: [
          { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Rational Numbers Class 8 Full Chapter | Prashant Kirad' },
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Rational Numbers Class 8 One Shot | PW Foundation' },
          { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Rational Numbers Concept & Tricks | Dear Sir' },
        ],
      },
      {
        subjectIndex: 0,
        name: 'Linear Equations in One Variable',
        difficulty: 'Medium',
        duration: 40,
        videoId: 'SDzy5eZpKVU',
        title: 'Linear Equations in One Variable Class 8 | Prashant Kirad',
        channel: 'ExpHub — Prashant Kirad',
        outcomes: ['Solve linear equations with variables on both sides', 'Apply cross-multiplication for fractional equations', 'Formulate and solve real-life word problems on age, currency, and geometry'],
        educators: [
          { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'SDzy5eZpKVU', title: 'Linear Equations in One Variable Class 8 | Prashant Kirad' },
          { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'bQ7ZCBMnR1o', title: 'Linear Equations in One Variable | Magnet Brains' },
        ],
      },
      {
        subjectIndex: 1,
        name: 'Cell — Structure and Functions',
        difficulty: 'Medium',
        duration: 40,
        videoId: 'd9tySXcfT-I',
        title: 'Cell Structure and Functions Class 8 Science | Physics Wallah',
        channel: 'Physics Wallah Foundation',
        outcomes: ['Identify parts of a cell: cell membrane, cytoplasm, nucleus, vacuoles', 'Compare plant cells vs animal cells (cell wall, plastids)', 'Understand prokaryotic vs eukaryotic cell organization'],
        educators: [
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'd9tySXcfT-I', title: 'Cell Structure and Functions Class 8 Science | Physics Wallah' },
          { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'G93Me80fi5M', title: 'Cell Structure and Functions Full Chapter | Magnet Brains' },
        ],
      },
      {
        subjectIndex: 1,
        name: 'Force and Pressure',
        difficulty: 'Medium',
        duration: 35,
        videoId: '2JpCoOi2cDY',
        title: 'Force and Pressure Class 8 in One Shot | Physics Wallah',
        channel: 'Physics Wallah Foundation',
        outcomes: ['Define contact and non-contact forces (gravitational, electrostatic, magnetic)', 'Calculate pressure as Force per unit area (P = F/A)', 'Demonstrate atmospheric and liquid pressure phenomena'],
        educators: [
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: '2JpCoOi2cDY', title: 'Force and Pressure Class 8 in One Shot | Physics Wallah' },
        ],
      },
      {
        subjectIndex: 2,
        name: 'Direct and Indirect Speech',
        difficulty: 'Hard',
        duration: 35,
        videoId: 'pXZtRXpGNck',
        title: 'Direct and Indirect Speech Rules | Dear Sir',
        channel: 'Dear Sir',
        outcomes: ['Convert assertive, interrogative, and imperative sentences into indirect speech', 'Apply correct tense shifts (simple present to simple past, etc.)', 'Change reporting verbs and time expressions appropriately'],
        educators: [
          { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Direct and Indirect Speech Rules | Dear Sir' },
        ],
      },
      {
        subjectIndex: 3,
        name: 'The Indian Constitution & Secularism',
        difficulty: 'Medium',
        duration: 40,
        videoId: 'N4KswB4OA0c',
        title: 'The Indian Constitution Class 8 Civics | Digraj Sir',
        channel: 'Social School — Digraj Sir',
        outcomes: ['Explain the key features of the Constitution: Federalism, Parliamentary Form, Separation of Powers', 'Analyze Fundamental Rights and their significance', 'Define secularism in the Indian democratic context'],
        educators: [
          { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'The Indian Constitution Class 8 Civics | Digraj Sir' },
        ],
      },
    ],

    'Class 9': [], // handled by DEMO_TOPICS

    'Class 10': CLASS_10_TOPICS,

    'Class 11': CLASS_11_TOPICS,

    'Class 12': [
      {
        subjectIndex: 0,
        name: 'Matrices & Determinants',
        difficulty: 'Medium',
        duration: 45,
        videoId: 'zd_DiEhylh4',
        title: 'Matrices Class 12 Maths One Shot | Physics Wallah',
        channel: 'Physics Wallah',
        outcomes: ['Calculate matrix multiplication and transpose properties', 'Find inverse of a matrix using adjoint formula', 'Solve system of linear equations using matrix method'],
        educators: [
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah', youtubeVideoId: 'zd_DiEhylh4', title: 'Matrices Class 12 Maths One Shot | Physics Wallah' },
          { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'bU1-GHz-ifk', title: 'Matrices Full Chapter Class 12 | Dear Sir' },
        ],
      },
      {
        subjectIndex: 1,
        name: 'Electrostatics & Electric Potential',
        difficulty: 'Hard',
        duration: 55,
        videoId: '2JpCoOi2cDY',
        title: 'Electrostatics Class 12 Physics Full Chapter | Physics Wallah',
        channel: 'Physics Wallah',
        outcomes: ['Apply Coulomb’s Law and Gauss’s Theorem to spherical shells and planes', 'Derive capacitance of parallel plate capacitor with dielectric', 'Calculate potential energy of dipoles in uniform electric fields'],
        educators: [
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah', youtubeVideoId: '2JpCoOi2cDY', title: 'Electrostatics Class 12 Physics Full Chapter | Physics Wallah' },
        ],
      },
      {
        subjectIndex: 2,
        name: 'Solutions & Colligative Properties',
        difficulty: 'Hard',
        duration: 45,
        videoId: 'd9tySXcfT-I',
        title: 'Solutions Class 12 Chemistry One Shot | Physics Wallah',
        channel: 'Physics Wallah',
        outcomes: ['Calculate molarity, molality, and mole fraction', 'Apply Raoult’s law and Henry’s law to ideal and non-ideal solutions', 'Determine molecular weight using freezing point depression and osmotic pressure'],
        educators: [
          { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah', youtubeVideoId: 'd9tySXcfT-I', title: 'Solutions Class 12 Chemistry One Shot | Physics Wallah' },
        ],
      },
    ],
  };

  const templates = topicTemplates[classLevel] || topicTemplates['Class 8'];

  return templates.map((tmpl, idx) => {
    const subject = subjects[tmpl.subjectIndex] || subjects[0];
    return {
      id: `top_${classLevel.toLowerCase().replace(' ', '')}_${idx + 1}`,
      subjectId: subject.id,
      name: tmpl.name,
      difficulty: tmpl.difficulty,
      order: idx + 1,
      youtubeVideoId: tmpl.videoId,
      youtubeTitle: tmpl.title,
      youtubeChannel: tmpl.channel,
      durationMinutes: tmpl.duration,
      learningOutcomes: tmpl.outcomes,
      educatorOptions: tmpl.educators,
    };
  });
}

// Generate realistic class leaderboard with seeded students
export function getLeaderboardForClass(
  classLevel: ClassLevel,
  currentStudent?: { id: string; name: string; username?: string; xp: number; streak?: number }
): LeaderboardEntry[] {
  // Pre-seeded high-performing peer learners for each class
  const seedPeers: Partial<Record<ClassLevel, Array<{ name: string; username: string; xp: number; streak: number; avatarBg: string }>>> = {
    'Class 6': [
      { name: 'Ananya Verma', username: 'ananya_v6', xp: 2150, streak: 12, avatarBg: 'indigo' },
      { name: 'Rohan Sharma', username: 'rohan_s', xp: 1980, streak: 9, avatarBg: 'emerald' },
      { name: 'Sneha Patel', username: 'sneha_p', xp: 1840, streak: 7, avatarBg: 'amber' },
      { name: 'Kabir Mehta', username: 'kabir_m', xp: 1690, streak: 6, avatarBg: 'sky' },
      { name: 'Tanmay Joshi', username: 'tanmay_j', xp: 1420, streak: 5, avatarBg: 'violet' },
      { name: 'Priya Nair', username: 'priya_n', xp: 1250, streak: 4, avatarBg: 'rose' },
      { name: 'Arjun Rao', username: 'arjun_r', xp: 980, streak: 3, avatarBg: 'teal' },
      { name: 'Meera Iyer', username: 'meera_i', xp: 820, streak: 2, avatarBg: 'cyan' },
    ],
    'Class 7': [
      { name: 'Devansh Kulkarni', username: 'dev_k7', xp: 2320, streak: 14, avatarBg: 'indigo' },
      { name: 'Rhea Sen', username: 'rhea_s', xp: 2190, streak: 11, avatarBg: 'emerald' },
      { name: 'Aditya Choudhary', username: 'aditya_c', xp: 1950, streak: 8, avatarBg: 'amber' },
      { name: 'Ishita Roy', username: 'ishita_r', xp: 1810, streak: 7, avatarBg: 'sky' },
      { name: 'Varun Pillai', username: 'varun_p', xp: 1540, streak: 5, avatarBg: 'violet' },
      { name: 'Simran Bhasin', username: 'simran_b', xp: 1390, streak: 4, avatarBg: 'rose' },
      { name: 'Nikhil Saxena', username: 'nikhil_s', xp: 1120, streak: 3, avatarBg: 'teal' },
    ],
    'Class 8': [
      { name: 'Aarav Gupta', username: 'aarav_g8', xp: 2450, streak: 15, avatarBg: 'indigo' },
      { name: 'Bhavya Mishra', username: 'bhavya_m', xp: 2310, streak: 13, avatarBg: 'emerald' },
      { name: 'Chirag Sethi', username: 'chirag_s', xp: 2180, streak: 10, avatarBg: 'amber' },
      { name: 'Diya Nambiar', username: 'diya_n', xp: 1960, streak: 8, avatarBg: 'sky' },
      { name: 'Eshaan Kaul', username: 'eshaan_k', xp: 1750, streak: 6, avatarBg: 'violet' },
      { name: 'Farhan Zaidi', username: 'farhan_z', xp: 1520, streak: 5, avatarBg: 'rose' },
      { name: 'Gayatri Deshmukh', username: 'gayatri_d', xp: 1340, streak: 4, avatarBg: 'teal' },
      { name: 'Harsh Vardhan', username: 'harsh_v', xp: 1100, streak: 3, avatarBg: 'cyan' },
    ],
    'Class 9': [
      { name: 'Kavya Singhania', username: 'kavya_s9', xp: 2780, streak: 18, avatarBg: 'indigo' },
      { name: 'Manish Pandey', username: 'manish_p', xp: 2540, streak: 14, avatarBg: 'emerald' },
      { name: 'Navya Reddy', username: 'navya_r', xp: 2390, streak: 11, avatarBg: 'amber' },
      { name: 'Omkar Bhat', username: 'omkar_b', xp: 2150, streak: 9, avatarBg: 'sky' },
      { name: 'Prachi Jain', username: 'prachi_j', xp: 1920, streak: 8, avatarBg: 'violet' },
      { name: 'Qadir Khan', username: 'qadir_k', xp: 1680, streak: 6, avatarBg: 'rose' },
      { name: 'Ritika Goel', username: 'ritika_g', xp: 1450, streak: 4, avatarBg: 'teal' },
    ],
    'Class 10': [
      { name: 'Siddharth Menon', username: 'sid_m10', xp: 3120, streak: 22, avatarBg: 'indigo' },
      { name: 'Tarini Ghosh', username: 'tarini_g', xp: 2890, streak: 17, avatarBg: 'emerald' },
      { name: 'Utkarsh Bajpai', username: 'utkarsh_b', xp: 2640, streak: 15, avatarBg: 'amber' },
      { name: 'Vidya Balan', username: 'vidya_b', xp: 2410, streak: 12, avatarBg: 'sky' },
      { name: 'Waseem Akram', username: 'waseem_a', xp: 2180, streak: 10, avatarBg: 'violet' },
      { name: 'Yashasvi Singh', username: 'yashasvi_s', xp: 1870, streak: 7, avatarBg: 'rose' },
    ],
    'Class 11': [
      { name: 'Abhimanyu Rao', username: 'abhi_11', xp: 3450, streak: 25, avatarBg: 'indigo' },
      { name: 'Brinda Soni', username: 'brinda_s', xp: 3180, streak: 19, avatarBg: 'emerald' },
      { name: 'Chetan Bhagat', username: 'chetan_b', xp: 2920, streak: 16, avatarBg: 'amber' },
      { name: 'Drishti Murthy', username: 'drishti_m', xp: 2650, streak: 13, avatarBg: 'sky' },
    ],
    'Class 12': [
      { name: 'Eklavya Sharma', username: 'eklavya_12', xp: 3890, streak: 28, avatarBg: 'indigo' },
      { name: 'Falguni Shah', username: 'falguni_s', xp: 3520, streak: 21, avatarBg: 'emerald' },
      { name: 'Gautam Gambhir', username: 'gautam_g', xp: 3240, streak: 18, avatarBg: 'amber' },
      { name: 'Himani Kapoor', username: 'himani_k', xp: 2980, streak: 15, avatarBg: 'sky' },
    ],
  };

  const peers = seedPeers[classLevel] || seedPeers['Class 8'];

  // Combine with current student if provided
  let allEntries: LeaderboardEntry[] = peers.map((p, idx) => ({
    userId: `peer_${classLevel.toLowerCase().replace(' ', '')}_${idx}`,
    name: p.name,
    username: p.username,
    class: classLevel,
    xp: p.xp,
    rank: 0,
    streak: p.streak,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}&backgroundColor=4f46e5`,
    isCurrentUser: false,
  }));

  if (currentStudent) {
    const studentUsername = currentStudent.username || (currentStudent.name.toLowerCase().replace(/\s+/g, '_') + '_' + classLevel.replace('Class ', ''));
    allEntries.push({
      userId: currentStudent.id,
      name: currentStudent.name,
      username: studentUsername,
      class: classLevel,
      xp: currentStudent.xp || 0,
      rank: 0,
      streak: currentStudent.streak || 1,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentStudent.name)}&backgroundColor=0284c7`,
      isCurrentUser: true,
    });
  }

  // Sort descending by XP
  allEntries.sort((a, b) => b.xp - a.xp);

  // Assign ranks
  allEntries = allEntries.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return allEntries;
}
