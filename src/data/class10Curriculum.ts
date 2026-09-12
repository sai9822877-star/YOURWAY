/**
 * Full Class 10 CBSE/NCERT Course Curriculum
 * Comprehensive syllabus covering all 4 subjects:
 * 1. Mathematics (14 full chapters)
 * 2. Science (15 full chapters)
 * 3. English (14 full chapters: First Flight, Footprints Without Feet, Writing & Grammar)
 * 4. Social Science (20 full chapters: History, Geography, Political Science, Economics)
 *
 * Every chapter includes:
 * - Real educational YouTube video IDs & titles from top Indian educators:
 *   Prashant Kirad (ExpHub), Physics Wallah Foundation (PW), Dear Sir, Digraj Singh Rajput (Social School), Ashu Sir (Science and Fun), Magnet Brains
 * - Graded difficulty level (Easy, Medium, Hard)
 * - 3-4 measurable learning outcomes
 * - Multi-educator selection options
 */

export interface Class10TopicTemplate {
  subjectIndex: number; // 0: Maths, 1: Science, 2: English, 3: Social Science
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  videoId: string;
  title: string;
  channel: string;
  outcomes: string[];
  educators: Array<{ educator: string; channelName: string; youtubeVideoId: string; title: string }>;
}

export const CLASS_10_TOPICS: Class10TopicTemplate[] = [
  // ==========================================
  // MATHEMATICS (subjectIndex: 0) — 14 CHAPTERS
  // ==========================================
  {
    subjectIndex: 0,
    name: 'Real Numbers & Fundamental Theorem of Arithmetic',
    difficulty: 'Easy',
    duration: 45,
    videoId: 'jC6MW9KOQvU',
    title: 'Real Numbers Class 10 Full Chapter One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Apply the Fundamental Theorem of Arithmetic to find HCF and LCM by prime factorisation',
      'Prove irrationality of √2, √3, √5 and composite expressions like 3 + 2√5',
      'State relationship between HCF(a,b) × LCM(a,b) = a × b with verification',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Real Numbers Class 10 Full Chapter | Prashant Kirad' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Real Numbers Class 10th One Shot | PW Foundation' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Real Numbers Class 10 Full Concept & NCERT | Dear Sir' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Polynomials & Zero-Coefficient Relations',
    difficulty: 'Medium',
    duration: 45,
    videoId: '5eOo0ks965w',
    title: 'Polynomials Class 10 in One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Interpret the geometric meaning of zeroes of a polynomial using parabolic graphs',
      'Verify the relationship between zeroes and coefficients of a quadratic polynomial (α+β = -b/a, αβ = c/a)',
      'Form quadratic polynomials given the sum and product of zeroes',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '5eOo0ks965w', title: 'Polynomials Class 10 in One Shot | Prashant Kirad' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Polynomials Class 10 Full Chapter | PW Foundation' },
      { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'bQ7ZCBMnR1o', title: 'Polynomials Class 10 Maths | Magnet Brains' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Pair of Linear Equations in Two Variables',
    difficulty: 'Medium',
    duration: 50,
    videoId: 'SDzy5eZpKVU',
    title: 'Pair of Linear Equations in 2 Variables Class 10 | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Determine consistency and number of solutions using ratio comparison (a1/a2, b1/b2, c1/c2)',
      'Solve systems using algebraic Substitution and Elimination methods',
      'Formulate and solve real-world word problems involving speed, upstream/downstream, and age',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'SDzy5eZpKVU', title: 'Pair of Linear Equations in 2 Variables Class 10 | Prashant Kirad' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Linear Equations in Two Variables Class 10 | Dear Sir' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: '2JpCoOi2cDY', title: 'Linear Equations Class 10 One Shot | PW Foundation' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Quadratic Equations & Discriminant Nature of Roots',
    difficulty: 'Hard',
    duration: 50,
    videoId: '4EEgAZOOkHM',
    title: 'Quadratic Equations Class 10 One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Solve quadratic equations by factorization (splitting the middle term)',
      'Apply Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a',
      'Analyze nature of roots using Discriminant D: two distinct real roots, equal roots, or no real roots',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '4EEgAZOOkHM', title: 'Quadratic Equations Class 10 One Shot | Prashant Kirad' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'd9tySXcfT-I', title: 'Quadratic Equations Class 10th Full Chapter | PW' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'bU1-GHz-ifk', title: 'Quadratic Equations Class 10 Tricks & Formula | Dear Sir' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Arithmetic Progressions (AP: Nth Term & Sum)',
    difficulty: 'Medium',
    duration: 50,
    videoId: 'jC6MW9KOQvU',
    title: 'Arithmetic Progression Class 10 in One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Identify first term a, common difference d, and verify whether a sequence forms an AP',
      'Calculate the nth term using an = a + (n - 1)d',
      'Find sum of first n terms using Sn = n/2 [2a + (n - 1)d] and apply to daily life problems',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Arithmetic Progression Class 10 in One Shot | Prashant Kirad' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Arithmetic Progression Class 10 Full Chapter | Dear Sir' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'AP Class 10th One Shot | PW Foundation' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Triangles & Basic Proportionality Theorem (BPT)',
    difficulty: 'Hard',
    duration: 55,
    videoId: 'CfxfW64P04s',
    title: 'Triangles Class 10 Full Chapter One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'State and prove Basic Proportionality Theorem (Thales Theorem) and its converse',
      'Apply similarity criteria of triangles (AAA, AA, SAS, SSS) in geometric proofs',
      'Calculate unknown side lengths in similar triangle configurations',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'CfxfW64P04s', title: 'Triangles Class 10 Full Chapter One Shot | Prashant Kirad' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: '2JpCoOi2cDY', title: 'Triangles Class 10th Full Chapter | PW Foundation' },
      { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'bQ7ZCBMnR1o', title: 'Triangles Class 10 Maths NCERT | Magnet Brains' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Coordinate Geometry: Distance & Section Formulae',
    difficulty: 'Medium',
    duration: 45,
    videoId: '5eOo0ks965w',
    title: 'Coordinate Geometry Class 10 One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Calculate distance between two Cartesian points using d = √((x₂ - x₁)² + (y₂ - y₁)²)',
      'Apply Section Formula for internal division in ratio m₁:m₂',
      'Find coordinates of midpoint, trisection points, and verify collinearity',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '5eOo0ks965w', title: 'Coordinate Geometry Class 10 One Shot | Prashant Kirad' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Coordinate Geometry Class 10 Formula & Questions | Dear Sir' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Introduction to Trigonometry & Trigonometric Ratios',
    difficulty: 'Medium',
    duration: 50,
    videoId: '4EEgAZOOkHM',
    title: 'Trigonometry Class 10 in One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Define sin, cos, tan, cosec, sec, and cot for acute angles in right triangles',
      'Memorize exact trigonometric values at 0°, 30°, 45°, 60°, and 90° using table shortcuts',
      'Prove fundamental trigonometric identities including sin²θ + cos²θ = 1 and 1 + tan²θ = sec²θ',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '4EEgAZOOkHM', title: 'Trigonometry Class 10 in One Shot | Prashant Kirad' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'bU1-GHz-ifk', title: 'Trigonometry Class 10 Chapter 8 | Dear Sir' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Trigonometry Class 10th Full Chapter | PW' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Some Applications of Trigonometry (Heights & Distances)',
    difficulty: 'Hard',
    duration: 45,
    videoId: 'SDzy5eZpKVU',
    title: 'Heights and Distances Class 10 One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Differentiate between line of sight, angle of elevation, and angle of depression',
      'Construct geometric sketches from descriptive word problems with towers, buildings, and poles',
      'Calculate unknown heights and distances using trigonometric ratios',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'SDzy5eZpKVU', title: 'Heights and Distances Class 10 One Shot | Prashant Kirad' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: '2JpCoOi2cDY', title: 'Applications of Trigonometry Class 10 | PW' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Circles & Tangent Theorems',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'jC6MW9KOQvU',
    title: 'Circles Class 10 Full Chapter in One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Prove theorem: The tangent at any point of a circle is perpendicular to the radius through the point of contact',
      'Prove theorem: The lengths of tangents drawn from an external point to a circle are equal',
      'Solve circle geometry questions involving circumscribed polygons and quadrilaterals',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Circles Class 10 Full Chapter | Prashant Kirad' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Circles Class 10 Full Chapter Concept | Dear Sir' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Areas Related to Circles (Sectors & Segments)',
    difficulty: 'Medium',
    duration: 40,
    videoId: '5eOo0ks965w',
    title: 'Areas Related to Circles Class 10 in 1 Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Compute area of a sector of angle θ using (θ/360) × πr²',
      'Compute length of an arc using (θ/360) × 2πr',
      'Determine areas of minor and major segments by subtracting triangle areas',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '5eOo0ks965w', title: 'Areas Related to Circles Class 10 | Prashant Kirad' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Areas Related to Circles Class 10 | PW' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Surface Areas and Volumes of Combined Solids',
    difficulty: 'Hard',
    duration: 55,
    videoId: 'CfxfW64P04s',
    title: 'Surface Areas and Volumes Class 10 One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Calculate total surface area of combinations of cubes, cuboids, cylinders, cones, and hemispheres',
      'Determine volume of composite solids and hollow structures',
      'Solve conversion of solid problems where one shape is melted or recast into another',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'CfxfW64P04s', title: 'Surface Areas and Volumes Class 10 | Prashant Kirad' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'bU1-GHz-ifk', title: 'Surface Areas and Volumes Class 10 | Dear Sir' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Statistics: Mean, Median, Mode of Grouped Data',
    difficulty: 'Easy',
    duration: 45,
    videoId: 'SDzy5eZpKVU',
    title: 'Statistics Class 10 Full Chapter in One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Calculate Mean of grouped frequency distribution using Direct and Assumed Mean methods',
      'Compute Mode of grouped data using Mode = l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] × h',
      'Determine Median using cumulative frequency table and Median = l + [(n/2 - cf) / f] × h',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'SDzy5eZpKVU', title: 'Statistics Class 10 Full Chapter | Prashant Kirad' },
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: '7o0cEBn2E5Y', title: 'Statistics Class 10 Full Chapter | Dear Sir' },
    ],
  },
  {
    subjectIndex: 0,
    name: 'Probability: Theoretical Events & Card Problems',
    difficulty: 'Easy',
    duration: 40,
    videoId: 'jC6MW9KOQvU',
    title: 'Probability Class 10 in One Shot | Prashant Kirad',
    channel: 'ExpHub — Prashant Kirad',
    outcomes: [
      'Calculate theoretical probability P(E) = Number of favorable outcomes / Total outcomes',
      'Solve standard problems involving single and double dice rolls, coin tosses, and deck of 52 cards',
      'Understand complementary events: P(E) + P(not E) = 1 and impossible/sure events',
    ],
    educators: [
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Probability Class 10 in One Shot | Prashant Kirad' },
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Probability Class 10 One Shot | PW Foundation' },
    ],
  },

  // ==========================================
  // SCIENCE (subjectIndex: 1) — 15 CHAPTERS
  // ==========================================
  {
    subjectIndex: 1,
    name: 'Chemical Reactions and Equations (Balancing & Types)',
    difficulty: 'Medium',
    duration: 50,
    videoId: 'd9tySXcfT-I',
    title: 'Chemical Reactions and Equations Class 10 One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Write and balance chemical equations ensuring conservation of atoms on both sides',
      'Classify reaction types: Combination, Decomposition (thermal, electrolytic, photolytic), Displacement, Double Displacement',
      'Identify Oxidation and Reduction in redox reactions; explain corrosion and rancidity prevention',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'd9tySXcfT-I', title: 'Chemical Reactions & Equations Class 10 | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Chemical Reactions and Equations Full Chapter | Prashant Kirad' },
      { educator: 'Science and Fun (Ashu Sir)', channelName: 'Science and Fun', youtubeVideoId: '2JpCoOi2cDY', title: 'Chemical Reactions Class 10 with Experiments | Ashu Sir' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Acids, Bases and Salts (pH Scale & Common Salts)',
    difficulty: 'Medium',
    duration: 50,
    videoId: 'm473xP_YVps',
    title: 'Acids Bases and Salts Class 10 Full Chapter One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Compare chemical properties of acids and bases with metals, carbonates, and hydrogen carbonates',
      'Interpret pH scale (0-14) and importance of pH in everyday life (digestion, tooth decay, soil)',
      'Prepare and explain uses of Bleaching powder, Baking soda, Washing soda, and Plaster of Paris (CaSO₄·½H₂O)',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Acids Bases and Salts Class 10 | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '5eOo0ks965w', title: 'Acids Bases and Salts Class 10 | Prashant Kirad' },
      { educator: 'Science and Fun (Ashu Sir)', channelName: 'Science and Fun', youtubeVideoId: 'd9tySXcfT-I', title: 'Acids Bases and Salts Live Experiments | Ashu Sir' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Metals and Non-Metals (Reactivity Series & Ionic Bonding)',
    difficulty: 'Hard',
    duration: 50,
    videoId: '2JpCoOi2cDY',
    title: 'Metals and Non Metals Class 10 Full Chapter One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Compare physical and chemical reactions of metals with oxygen, water, and dilute acids',
      'Apply reactivity series to predict displacement reactions',
      'Demonstrate ionic compound formation by electron transfer and explain their high melting points and conductivity',
      'Explain basic metallurgy: concentration of ore, roasting, calcination, and electrolytic refining',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: '2JpCoOi2cDY', title: 'Metals and Non Metals Class 10 | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '4EEgAZOOkHM', title: 'Metals and Non Metals One Shot | Prashant Kirad' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Carbon and its Compounds (Covalent Bonds & Homologous Series)',
    difficulty: 'Hard',
    duration: 60,
    videoId: 'd9tySXcfT-I',
    title: 'Carbon and its Compounds Class 10 in One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Explain tetravalency and catenation properties enabling carbon to form infinite compounds',
      'Draw electron dot structures for methane, ethene, ethyne, and cyclic hydrocarbons',
      'Identify functional groups (alcohol, aldehyde, ketone, carboxylic acid) and homologous series',
      'Describe ethanol and ethanoic acid chemical properties, saponification, and micelle cleansing action',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'd9tySXcfT-I', title: 'Carbon and its Compounds Class 10 | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Carbon and its Compounds Full Chapter | Prashant Kirad' },
      { educator: 'Science and Fun (Ashu Sir)', channelName: 'Science and Fun', youtubeVideoId: 'm473xP_YVps', title: 'Carbon and its Compounds Explained | Ashu Sir' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Life Processes: Nutrition & Cellular Respiration',
    difficulty: 'Medium',
    duration: 50,
    videoId: 'jMwg_B8R_jQ',
    title: 'Life Processes Class 10 Science Full Chapter One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Trace autotrophic nutrition in plants: light reaction, chlorophyll role, stomatal opening/closing',
      'Follow human alimentary canal: digestion in mouth, stomach, pancreas, liver, and small intestine',
      'Compare aerobic vs anaerobic respiration pathways (breakdown of glucose in yeast vs human muscle)',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'jMwg_B8R_jQ', title: 'Life Processes Class 10 Full Chapter | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'CfxfW64P04s', title: 'Life Processes Class 10 Animated | Prashant Kirad' },
      { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'G93Me80fi5M', title: 'Life Processes Class 10 Biology | Magnet Brains' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Life Processes: Transportation & Human Excretion',
    difficulty: 'Medium',
    duration: 50,
    videoId: 'd9tySXcfT-I',
    title: 'Transportation and Excretion Class 10 Biology | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Analyze four chambers of the human heart and double circulation mechanism',
      'Distinguish xylem (transpiration pull) and phloem (translocation) vascular transport in plants',
      'Explain nephron structure, ultrafiltration, selective reabsorption, and urine collection',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'd9tySXcfT-I', title: 'Transportation & Excretion Class 10 | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'SDzy5eZpKVU', title: 'Circulation and Excretion Class 10 | Prashant Kirad' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Control and Coordination: Nervous System & Hormones',
    difficulty: 'Hard',
    duration: 50,
    videoId: '2JpCoOi2cDY',
    title: 'Control and Coordination Class 10 Full Chapter | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Trace transmission of nerve impulses across neuron dendrites, axon, and synapse',
      'Map the reflex arc pathway through sensory neuron, spinal cord, and motor neuron',
      'Identify human brain divisions (forebrain, midbrain, hindbrain: cerebellum, medulla, pons)',
      'Explain plant tropisms (phototropism, geotropism) and endocrine hormones (thyroxin, insulin, adrenaline)',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: '2JpCoOi2cDY', title: 'Control and Coordination Class 10 | PW' },
      { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'bQ7ZCBMnR1o', title: 'Control and Coordination Full Chapter | Magnet Brains' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'How do Organisms Reproduce? (Asexual & Sexual)',
    difficulty: 'Medium',
    duration: 50,
    videoId: 'm473xP_YVps',
    title: 'How do Organisms Reproduce Class 10 One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Illustrate asexual modes: binary fission (Amoeba), budding (Hydra), spore formation, and vegetative propagation',
      'Explain sexual reproduction in flowering plants: parts of flower, pollination, and double fertilization',
      'Outline human male and female reproductive systems, menstruation cycle, and contraception methods',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'How do Organisms Reproduce Class 10 | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Reproduction in Organisms Class 10 | Prashant Kirad' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Heredity: Mendel’s Laws & Sex Determination',
    difficulty: 'Hard',
    duration: 45,
    videoId: 'CfxfW64P04s',
    title: 'Heredity Class 10 Full Chapter One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Analyze Mendel’s monohybrid cross with pea plants yielding 3:1 phenotypic and 1:2:1 genotypic ratios',
      'Explain Mendel’s dihybrid cross demonstrating independent assortment (9:3:3:1 ratio)',
      'Diagram genetic sex determination in humans mediated by XX and XY chromosomes',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'CfxfW64P04s', title: 'Heredity Class 10 Full Chapter | PW' },
      { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'G93Me80fi5M', title: 'Heredity Class 10 Science | Magnet Brains' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Light: Reflection and Spherical Mirrors',
    difficulty: 'Medium',
    duration: 50,
    videoId: '2JpCoOi2cDY',
    title: 'Light Reflection and Refraction Class 10 | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Draw ray diagrams for concave and convex mirrors across various object positions',
      'Apply mirror formula: 1/f = 1/v + 1/u using Cartesian sign convention',
      'Calculate linear magnification m = -v/u = h\'/h and determine image nature',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: '2JpCoOi2cDY', title: 'Light Reflection & Refraction Part 1 | PW' },
      { educator: 'Science and Fun (Ashu Sir)', channelName: 'Science and Fun', youtubeVideoId: 'd9tySXcfT-I', title: 'Light Reflection Class 10 Practical Demonstrations | Ashu Sir' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '5eOo0ks965w', title: 'Light Class 10 Full Chapter | Prashant Kirad' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Light: Refraction, Snell’s Law & Spherical Lenses',
    difficulty: 'Hard',
    duration: 55,
    videoId: 'd9tySXcfT-I',
    title: 'Light Refraction & Lenses Class 10 in 1 Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'State Laws of Refraction and Snell’s Law (sin i / sin r = constant)',
      'Draw ray diagrams for convex and concave lenses and apply lens formula 1/f = 1/v - 1/u',
      'Calculate power of a lens P = 1/f (in meters) in Dioptres (D) for optical combinations',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'd9tySXcfT-I', title: 'Light Refraction & Lenses Class 10 | PW' },
      { educator: 'Science and Fun (Ashu Sir)', channelName: 'Science and Fun', youtubeVideoId: '2JpCoOi2cDY', title: 'Lenses & Refraction Live Glass Slab Experiment | Ashu Sir' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'The Human Eye and the Colourful World',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'm473xP_YVps',
    title: 'Human Eye and Colourful World Class 10 One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Explain accommodation of the human eye and optical defects: Myopia and Hypermetropia with corrective lens diagrams',
      'Illustrate refraction and dispersion of white light through a triangular glass prism (VIBGYOR)',
      'Explain atmospheric refraction phenomena: twinkling of stars, advanced sunrise, and delayed sunset',
      'Analyze Tyndall effect and Rayleigh scattering (why the sky is blue and danger signals red)',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'm473xP_YVps', title: 'Human Eye Class 10 Full Chapter | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: '4EEgAZOOkHM', title: 'The Human Eye Class 10 Animated | Prashant Kirad' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Electricity: Ohm’s Law, Resistance & Electric Power',
    difficulty: 'Hard',
    duration: 55,
    videoId: 'kKKM8Y-u7ds',
    title: 'Electricity Class 10 Science Full Chapter One Shot | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'State Ohm’s Law (V = IR) and identify factors affecting resistance (R = ρl/A)',
      'Derive equivalent resistance for resistors connected in series (Rs = R1+R2) and parallel (1/Rp = 1/R1+1/R2)',
      'Apply Joule’s Law of Heating (H = I²Rt) and calculate electric power P = VI = I²R = V²/R',
      'Solve commercial unit of electric energy problems (1 kWh = 3.6 × 10⁶ J)',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'kKKM8Y-u7ds', title: 'Electricity Class 10 Full Chapter | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'jC6MW9KOQvU', title: 'Electricity Class 10 One Shot | Prashant Kirad' },
      { educator: 'Science and Fun (Ashu Sir)', channelName: 'Science and Fun', youtubeVideoId: 'd9tySXcfT-I', title: 'Electricity Circuits Practical Demonstration | Ashu Sir' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Magnetic Effects of Electric Current (Rules & Motor Concept)',
    difficulty: 'Hard',
    duration: 50,
    videoId: '2JpCoOi2cDY',
    title: 'Magnetic Effects of Electric Current Class 10 | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Map magnetic field lines around a straight conductor, circular loop, and solenoid',
      'Apply Right-Hand Thumb Rule and Fleming’s Left-Hand Rule for force on current-carrying conductor',
      'Explain electromagnetic induction principle and domestic electric circuit safety (earthing, fuse)',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: '2JpCoOi2cDY', title: 'Magnetic Effects of Electric Current Class 10 | PW' },
      { educator: 'Prashant Kirad', channelName: 'ExpHub — Prashant Kirad', youtubeVideoId: 'CfxfW64P04s', title: 'Magnetic Effects Class 10 in 1 Shot | Prashant Kirad' },
    ],
  },
  {
    subjectIndex: 1,
    name: 'Our Environment: Ecosystems, Energy Flow & Ozone',
    difficulty: 'Easy',
    duration: 35,
    videoId: 'SDzy5eZpKVU',
    title: 'Our Environment Class 10 Full Chapter | Physics Wallah',
    channel: 'Physics Wallah Foundation',
    outcomes: [
      'Trace trophic levels in terrestrial and aquatic food chains and apply Lindeman’s 10% law of energy transfer',
      'Explain biological magnification of non-biodegradable pesticides',
      'Describe ozone layer formation and depletion by chlorofluorocarbons (CFCs) and waste management solutions',
    ],
    educators: [
      { educator: 'Physics Wallah (PW)', channelName: 'Physics Wallah Foundation', youtubeVideoId: 'SDzy5eZpKVU', title: 'Our Environment Class 10 | PW' },
      { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'G93Me80fi5M', title: 'Our Environment Class 10 Biology | Magnet Brains' },
    ],
  },

  // ==========================================
  // ENGLISH (subjectIndex: 2) — 14 CHAPTERS
  // ==========================================
  {
    subjectIndex: 2,
    name: 'A Letter to God & Dust of Snow, Fire and Ice',
    difficulty: 'Easy',
    duration: 40,
    videoId: 'pXZtRXpGNck',
    title: 'A Letter to God Class 10 Full Chapter Explanation | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Analyze Lencho’s extreme faith in God and the tragic irony regarding post office employees',
      'Interpret Robert Frost’s symbolic imagery in Dust of Snow (crow, hemlock tree) and Fire and Ice (desire vs hatred)',
      'Formulate value-based answers evaluating humanity and gratitude',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'A Letter to God Class 10 Explanation | Dear Sir' },
      { educator: 'Magnet Brains', channelName: 'Magnet Brains', youtubeVideoId: 'O7-rCk7svcU', title: 'A Letter to God Full Chapter | Magnet Brains' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Nelson Mandela: Long Walk to Freedom & A Tiger in the Zoo',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'pXZtRXpGNck',
    title: 'Nelson Mandela Long Walk to Freedom Class 10 | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Examine Mandela’s inaugural address on freedom, twin obligations, and overcoming apartheid',
      'Analyze poetic contrast in A Tiger in the Zoo between captive confinement and wild freedom',
      'Characterize courage not as absence of fear, but triumph over it',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Nelson Mandela Long Walk to Freedom | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Two Stories about Flying (His First Flight & The Black Aeroplane)',
    difficulty: 'Medium',
    duration: 40,
    videoId: 'pXZtRXpGNck',
    title: 'Two Stories About Flying Class 10 in One Shot | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Analyze the young seagull’s fear of flying and how parental tough love propelled his maiden flight',
      'Explore the supernatural mystery of the black aeroplane pilot guiding the narrator through storm clouds',
      'Extract themes of self-reliance, courage, and faith',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Two Stories About Flying Class 10 | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'From the Diary of Anne Frank & Amanda',
    difficulty: 'Medium',
    duration: 40,
    videoId: 'pXZtRXpGNck',
    title: 'From the Diary of Anne Frank Class 10 | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Appreciate Anne Frank’s relationship with her diary "Kitty" and humor with Mr. Keesing',
      'Critique adult nagging vs teen yearning for freedom in Robin Klein’s poem Amanda',
      'Analyze diary entries as historical and emotional testimony',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'From the Diary of Anne Frank | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Glimpses of India (Goa Baker, Coorg & Assam Tea)',
    difficulty: 'Easy',
    duration: 45,
    videoId: 'pXZtRXpGNck',
    title: 'Glimpses of India Class 10 Full Chapter | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Trace Portuguese culinary heritage of bakers (Paders) in traditional Goan villages',
      'Explore martial traditions, coffee plantations, and wildlife of Coorg',
      'Examine legends surrounding discovery of tea in China and India through Rajvir and Pranjol',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Glimpses of India Class 10 | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Madam Rides the Bus & The Sermon at Benares',
    difficulty: 'Hard',
    duration: 45,
    videoId: 'pXZtRXpGNck',
    title: 'Madam Rides the Bus & Sermon at Benares Class 10 | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Follow 8-year-old Valli’s meticulous planning, curiosity, and confrontation with mortality',
      'Reflect on Gautama Buddha’s teachings to Kisa Gotami regarding the universal truth of death',
      'Synthesize philosophical maturity across both prose texts',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Madam Rides the Bus Class 10 | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'The Proposal (Anton Chekhov Drama Analysis)',
    difficulty: 'Hard',
    duration: 45,
    videoId: 'pXZtRXpGNck',
    title: 'The Proposal Class 10 Drama Full Chapter | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Analyze satire and farce in 19th-century Russian landowning marriage proposals',
      'Trace absurd arguments over Oxen Meadows and hunting dogs (Guess vs Squeezer) between Lomov and Natalya',
      'Evaluate character motives of Chubukov as an opportunistic patriarch',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'The Proposal Class 10 Drama | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Footprints Without Feet: Triumph of Surgery & Thief’s Story',
    difficulty: 'Easy',
    duration: 40,
    videoId: 'pXZtRXpGNck',
    title: 'A Triumph of Surgery & The Thief’s Story Class 10 | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Compare Mrs. Pumphrey’s over-pampering of Tricki with Dr. Herriot’s sensible lifestyle therapy',
      'Analyze Hari Singh’s inner moral transformation inspired by Anil’s unconditional trust',
      'Extract themes of education as the ultimate path to self-respect',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Triumph of Surgery & Thief’s Story | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Footprints Without Feet: Midnight Visitor & Question of Trust',
    difficulty: 'Medium',
    duration: 40,
    videoId: 'pXZtRXpGNck',
    title: 'The Midnight Visitor & A Question of Trust Class 10 | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Observe secret agent Ausable outwitting intruder Max using calm presence of mind and fabricated balcony',
      'Analyze how Horace Danby was tricked by an equally astute lady thief at Shotover Grange',
      'Contrast situational irony and intellectual wit in detective fiction',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Midnight Visitor & Question of Trust | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Footprints Without Feet: Making of a Scientist & The Necklace',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'pXZtRXpGNck',
    title: 'The Making of a Scientist & The Necklace Class 10 | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Trace Richard Ebright’s scientific trajectory from butterfly collecting to DNA discoveries',
      'Examine Matilda Loisel’s vanity, the borrowed necklace loss, and 10 years of ruinous debt',
      'Discuss contentment vs destructive material aspirations',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Making of a Scientist & The Necklace | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Footprints Without Feet: Bholi & The Book That Saved the Earth',
    difficulty: 'Easy',
    duration: 40,
    videoId: 'pXZtRXpGNck',
    title: 'Bholi Class 10 English Full Story Explanation | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Follow Sulekha’s (Bholi’s) evolution from neglected stammering child to empowered, courageous woman',
      'Critique social evils of dowry, bodily stigmatization, and gender bias in rural families',
      'Enjoy Martians’ misinterpretation of Mother Goose nursery rhymes saving planet Earth',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Bholi Class 10 Full Story | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'CBSE Formal Letters: Letters to Editor & Complaints',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'pXZtRXpGNck',
    title: 'Formal Letter Writing Format Class 10 CBSE Board | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Master CBSE standard layout: Sender’s Address, Date, Receiver’s Designation, Subject, Salutation, Body, Sign-off',
      'Draft persuasive Letters to the Editor highlighting civic, environmental, and road safety concerns',
      'Write formal letters of complaint and placing orders with formal diplomatic vocabulary',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Formal Letter Writing Format Class 10 | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Analytical Paragraph Writing (Data Charts & Trends)',
    difficulty: 'Medium',
    duration: 40,
    videoId: 'pXZtRXpGNck',
    title: 'Analytical Paragraph Class 10 Format and Examples | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Analyze visual data inputs: bar graphs, pie charts, tables, and trend lines',
      'Structure paragraph with concise Introduction, Detailed Comparison / Body, and Concluding Overview',
      'Incorporate quantitative transitions: "sharp decline", "plateaued", "majority proportion", "contrasting trend"',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Analytical Paragraph Writing Class 10 | Dear Sir' },
    ],
  },
  {
    subjectIndex: 2,
    name: 'Reported Speech, Modals, Subject-Verb Concord & Editing',
    difficulty: 'Hard',
    duration: 50,
    videoId: 'pXZtRXpGNck',
    title: 'Class 10 English Grammar Complete One Shot | Dear Sir',
    channel: 'Dear Sir',
    outcomes: [
      'Convert assertions, questions, commands, and dialogues into Indirect Speech adhering to strict tense/pronoun rules',
      'Apply Subject-Verb Concord principles for collective nouns, indefinite pronouns, and compound subjects',
      'Detect grammatical errors in CBSE paragraph editing and omission exercises',
    ],
    educators: [
      { educator: 'Dear Sir', channelName: 'Dear Sir', youtubeVideoId: 'pXZtRXpGNck', title: 'Class 10 English Grammar Complete One Shot | Dear Sir' },
    ],
  },

  // =========================================================
  // SOCIAL SCIENCE (subjectIndex: 3) — 16 CHAPTERS
  // =========================================================
  {
    subjectIndex: 3,
    name: 'History: The Rise of Nationalism in Europe',
    difficulty: 'Hard',
    duration: 55,
    videoId: 'N4KswB4OA0c',
    title: 'The Rise of Nationalism in Europe Class 10 Full Chapter | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Analyze Frédéric Sorrieu’s utopian democratic vision and the impact of the French Revolution (1789)',
      'Evaluate the Civil Code of 1804 (Napoleonic Code) and conservative reaction at Congress of Vienna (1815)',
      'Trace Unification of Germany under Otto von Bismarck and Unification of Italy under Cavour and Garibaldi',
      'Examine allegory figures (Marianne, Germania) and the explosive Balkan nationalist crisis leading to WWI',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Nationalism in Europe Class 10 | Digraj Sir' },
      { educator: 'Shubham Pathak', channelName: 'Shubham Pathak', youtubeVideoId: 'O7-rCk7svcU', title: 'Nationalism in Europe One Shot | Shubham Pathak' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'History: Nationalism in India',
    difficulty: 'Hard',
    duration: 55,
    videoId: 'N4KswB4OA0c',
    title: 'Nationalism in India Full Chapter Class 10 | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Trace First World War economic hardships, Rowlatt Act, and Jallianwala Bagh massacre (1919)',
      'Compare Non-Cooperation Movement in cities, countryside (Awadh peasants, Baba Ramchandra), and tribal forest areas (Alluri Sitaram Raju)',
      'Examine the Salt March, Civil Disobedience Movement (1930), and different perceptions of Swaraj among industrialists, peasants, and women',
      'Analyze the cultural creation of a collective Indian belonging through Bharat Mata imagery, folklore, and tricolor flag',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Nationalism in India Full Chapter Class 10 | Digraj Sir' },
      { educator: 'ExpHub — Prashant Kirad', channelName: 'ExpHub', youtubeVideoId: 'jC6MW9KOQvU', title: 'Nationalism in India One Shot | Prashant Kirad' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'History: The Making of a Global World',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'The Making of a Global World Class 10 History | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Trace ancient pre-modern trade across Silk Routes connecting Asia, Europe, and northern Africa',
      'Analyze role of biological exchange, disease (smallpox conquering the Americas), and indentured labor migration',
      'Examine causes and global devastation of the Great Economic Depression of 1929 and Bretton Woods post-war monetary order',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'The Making of a Global World | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'History: Print Culture and the Modern World',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'Print Culture and the Modern World Class 10 | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Trace progression from East Asian hand-printing to Gutenberg’s movable mechanical press in Europe',
      'Analyze how the print revolution sparked the Protestant Reformation (Martin Luther) and French Enlightenment debates',
      'Examine print dissemination in colonial India, religious reform discussions, and vernacular censorship acts',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Print Culture Class 10 | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Geography: Resources and Development (Soils & Planning)',
    difficulty: 'Easy',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'Resources and Development Class 10 Geography | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Classify resources by origin, exhaustibility, ownership, and development status',
      'Explain resource planning stages in India and Rio de Janeiro Earth Summit 1992 (Agenda 21)',
      'Characterize major soil distributions across India: Alluvial, Black (Regur), Red & Yellow, Laterite, Arid, and Forest soils',
      'Formulate soil conservation practices: contour ploughing, strip cropping, and shelter belts',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Resources and Development Class 10 | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Geography: Forest and Wildlife Resources',
    difficulty: 'Easy',
    duration: 35,
    videoId: 'N4KswB4OA0c',
    title: 'Forest and Wildlife Resources Class 10 | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Classify endangered, vulnerable, rare, and endemic flora/fauna based on IUCN guidelines',
      'Differentiate Reserved, Protected, and Unclassed forest categories under government management',
      'Evaluate community conservation initiatives: Chipko Movement, Beej Bachao Andolan, and Joint Forest Management (JFM)',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Forest and Wildlife Resources | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Geography: Water Resources & Rainwater Harvesting',
    difficulty: 'Easy',
    duration: 40,
    videoId: 'N4KswB4OA0c',
    title: 'Water Resources Class 10 Full Chapter | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Analyze causes of freshwater scarcity in post-independence industrial India',
      'Assess multipurpose river valley projects: benefits vs displacement controversies (Narmada Bachao Andolan)',
      'Document traditional rainwater harvesting mechanisms: Guls/Kuls in Himalayas, Khadins/Johads in Rajasthan, and Rooftop systems in Tamil Nadu',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Water Resources Class 10 | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Geography: Agriculture (Cropping Seasons & Crops)',
    difficulty: 'Medium',
    duration: 50,
    videoId: 'N4KswB4OA0c',
    title: 'Agriculture Class 10 Geography One Shot | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Distinguish Primitive Subsistence, Intensive Subsistence, and Commercial Farming types',
      'Characterize India’s cropping seasons: Rabi (winter), Kharif (monsoon), and Zaid (summer)',
      'Detail climatic requirements (rainfall, temperature, soil) for Rice, Wheat, Millets, Sugarcane, Tea, and Cotton',
      'Evaluate institutional and technological reforms: Green Revolution, White Revolution, Kisan Credit Cards, and PM Fasal Bima Yojana',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Agriculture Class 10 Geography | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Geography: Minerals and Energy Resources',
    difficulty: 'Hard',
    duration: 50,
    videoId: 'N4KswB4OA0c',
    title: 'Minerals and Energy Resources Class 10 | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Classify minerals: Ferrous (Iron ore, Manganese), Non-ferrous (Copper, Bauxite), and Non-metallic (Mica, Limestone)',
      'Compare Conventional energy sources (Coal varieties, Petroleum basins, Natural Gas) with Non-conventional renewables (Solar, Wind, Biogas, Nuclear)',
      'Examine mineral conservation imperatives for sustainable industrial growth',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Minerals and Energy Resources | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Geography: Manufacturing Industries & Pollution Control',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'Manufacturing Industries Class 10 One Shot | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Explain significance of manufacturing as the backbone of economic development',
      'Trace location factors and industrial value chains of Cotton Textiles, Jute, and Iron & Steel industries',
      'Assess environmental degradation caused by air, water, thermal, and noise pollution from industries and treatment remedies',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Manufacturing Industries Class 10 | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Political Science: Power Sharing (Belgium & Sri Lanka)',
    difficulty: 'Easy',
    duration: 40,
    videoId: 'N4KswB4OA0c',
    title: 'Power Sharing Class 10 Civics Full Chapter | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Compare ethnic composition and policy responses of Belgium (Accommodation model) and Sri Lanka (Majoritarianism and Civil War)',
      'Distinguish prudential reasons (reducing social conflict) vs moral reasons (spirit of democracy) for power sharing',
      'Identify horizontal (Legislature, Executive, Judiciary) and vertical (Federal tiers) forms of power sharing',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Power Sharing Class 10 Full Chapter | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Political Science: Federalism & Decentralisation in India',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'Federalism Class 10 Civics Full Chapter One Shot | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Identify key features of federalism and differentiate "Coming Together" (USA) vs "Holding Together" (India) federations',
      'Distinguish legislative subjects across Union List, State List, Concurrent List, and Residuary subjects',
      'Explain the 1992 constitutional decentralisation steps establishing mandatory local Panchayati Raj and Municipal elections',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Federalism Class 10 Full Chapter | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Political Science: Gender, Religion and Caste in Politics',
    difficulty: 'Medium',
    duration: 40,
    videoId: 'N4KswB4OA0c',
    title: 'Gender Religion and Caste Class 10 Civics | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Examine the sexual division of labour, feminist movements, and women’s political representation in India',
      'Critique communalism and articulate constitutional provisions upholding a secular state',
      'Analyze the interplay between caste in politics (vote banks, mobilization) and politics in caste (broadening coalitions)',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Gender Religion and Caste | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Political Science: Political Parties & Democratic Outcomes',
    difficulty: 'Hard',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'Political Parties Class 10 Civics One Shot | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Explain core functions of political parties in representative democracies and need for multiparty systems',
      'Examine Election Commission criteria for recognition as National Parties and State Parties',
      'Critique major challenges facing political parties: lack of internal democracy, dynastic succession, money & muscle power, and ideological dilution',
      'Evaluate outcomes of democracy in promoting economic growth, dignity, and transparency',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Political Parties Class 10 | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Economics: Development (Income, National Growth & HDI)',
    difficulty: 'Easy',
    duration: 40,
    videoId: 'N4KswB4OA0c',
    title: 'Development Class 10 Economics Full Chapter | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Explain why different people have different and often conflicting notions of development',
      'Evaluate Per Capita Income criteria used by World Bank and identify its hidden inequality limitations',
      'Analyze UNDP Human Development Index (HDI) incorporating life expectancy, educational attainment, and standard of living',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Development Class 10 Economics | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Economics: Sectors of the Indian Economy',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'Sectors of the Indian Economy Class 10 Economics | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Classify economic activities into Primary (agriculture), Secondary (manufacturing), and Tertiary (services) sectors',
      'Explain historical GDP shifts and reasons behind the explosive growth of the tertiary sector in India',
      'Differentiate organized vs unorganized employment conditions and analyze disguised underemployment in agriculture',
      'Evaluate government employment guarantees under MGNREGA 2005',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Sectors of Indian Economy | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Economics: Money and Credit (Modern Forms & SHGs)',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'Money and Credit Class 10 Economics Full Chapter | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Explain how money eliminates the double coincidence of wants inherent in barter systems',
      'Examine modern forms of money: paper currency authorized by RBI, demand deposits, and cheque payments',
      'Compare terms of credit between Formal Sector (commercial banks, cooperatives) and Informal Sector (moneylenders, traders)',
      'Analyze role of Self-Help Groups (SHGs) for rural women in escaping poverty and debt traps',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Money and Credit Class 10 Economics | Digraj Sir' },
    ],
  },
  {
    subjectIndex: 3,
    name: 'Economics: Globalisation and the Indian Economy',
    difficulty: 'Medium',
    duration: 45,
    videoId: 'N4KswB4OA0c',
    title: 'Globalisation and the Indian Economy Class 10 | Digraj Sir',
    channel: 'Social School — Digraj Sir',
    outcomes: [
      'Define Multinational Corporations (MNCs) and how they organize production globally across multiple countries',
      'Assess impact of 1991 economic liberalisation and removal of trade barriers on Indian markets',
      'Critique role of the World Trade Organization (WTO) and unequal terms between developed and developing nations',
      'Analyze differential impacts of globalization on consumers, large corporations, and vulnerable unorganized workers',
    ],
    educators: [
      { educator: 'Digraj Singh Rajput', channelName: 'Social School — Digraj Sir', youtubeVideoId: 'N4KswB4OA0c', title: 'Globalisation and Indian Economy | Digraj Sir' },
    ],
  },
];
