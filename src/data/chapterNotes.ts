export interface ChapterNoteSection {
  title: string;
  content: string;
  points?: string[];
  formulas?: Array<{ name: string; formula: string; explanation: string }>;
  examples?: Array<{ question: string; stepByStepSolution: string[]; tip?: string }>;
}

export interface ChapterNote {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterNumber: number;
  chapterTitle: string;
  classLevel: string;
  readingTimeMinutes: number;
  badge: string;
  summary: string;
  sections: ChapterNoteSection[];
  keyTakeaways: string[];
  examTips: string[];
}

export const CHAPTER_NOTES: Record<string, ChapterNote> = {
  // 1. Class 9 Mathematics - Polynomials
  'poly_class9': {
    id: 'poly_class9',
    subjectId: 'sub_maths',
    subjectName: 'Mathematics',
    chapterNumber: 2,
    chapterTitle: 'Polynomials & Algebraic Identities',
    classLevel: 'Class 9',
    readingTimeMinutes: 12,
    badge: 'NCERT Chapter 2 • High Yield',
    summary: 'A polynomial is an algebraic expression composed of variables and coefficients involving only non-negative integer exponents. This chapter establishes the foundation for remainder theorem, factor theorem, and algebraic identities.',
    sections: [
      {
        title: '1. Definition & Classification of Polynomials',
        content: 'An expression of the form P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀, where aₙ ≠ 0 and n is a whole number (non-negative integer).',
        points: [
          'Degree of a Polynomial: Highest power of the variable x in P(x). For a constant non-zero polynomial, degree = 0. For zero polynomial, degree is undefined.',
          'Monomial: Exactly 1 term (e.g., 5x³)',
          'Binomial: Exactly 2 terms (e.g., 2x² - 7)',
          'Trinomial: Exactly 3 terms (e.g., x² + 5x + 6)',
          'Linear Polynomial: Degree = 1 (Standard form: ax + b, a ≠ 0)',
          'Quadratic Polynomial: Degree = 2 (Standard form: ax² + bx + c, a ≠ 0)',
          'Cubic Polynomial: Degree = 3 (Standard form: ax³ + bx² + cx + d, a ≠ 0)',
        ],
      },
      {
        title: '2. Zeroes of a Polynomial & Remainder Theorem',
        content: 'A real number k is said to be a zero of P(x) if P(k) = 0. Geometrically, the zeroes are the x-coordinates of points where the graph y = P(x) intersects the X-axis.',
        points: [
          'A linear polynomial has exactly one zero: k = -b/a.',
          'A quadratic polynomial has at most 2 zeroes.',
          'A polynomial of degree n has at most n real zeroes.',
          'Remainder Theorem: Let P(x) be any polynomial of degree ≥ 1 and a be any real number. If P(x) is divided by the linear polynomial (x - a), then the remainder is equal to P(a).',
          'Factor Theorem: (x - a) is a factor of P(x) if and only if P(a) = 0. Also, if (x - a) is a factor, then P(a) = 0.',
        ],
      },
      {
        title: '3. Master Algebraic Identities (Must-Memorize)',
        content: 'These 8 core identities are tested in 90% of school and board examinations:',
        formulas: [
          {
            name: 'Identity I (Square of Sum)',
            formula: '(x + y)² = x² + 2xy + y²',
            explanation: 'Used for binomial expansions and mental multiplication e.g., 105² = (100 + 5)²',
          },
          {
            name: 'Identity II (Square of Difference)',
            formula: '(x - y)² = x² - 2xy + y²',
            explanation: 'Remember the negative sign applies only to the cross product term -2xy.',
          },
          {
            name: 'Identity III (Difference of Squares)',
            formula: 'x² - y² = (x + y)(x - y)',
            explanation: 'Vital for fast factoring and rationalizing denominators.',
          },
          {
            name: 'Identity IV (Product of Linear Factors)',
            formula: '(x + a)(x + b) = x² + (a + b)x + ab',
            explanation: 'Basis of the middle-term splitting method for quadratics.',
          },
          {
            name: 'Identity V (Square of Trinomial)',
            formula: '(x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx',
            explanation: 'Watch the sign of individual terms when evaluating negative variables.',
          },
          {
            name: 'Identity VI & VII (Cubes of Binomials)',
            formula: '(x + y)³ = x³ + y³ + 3xy(x + y)  |  (x - y)³ = x³ - y³ - 3xy(x - y)',
            explanation: 'Can also be expanded into x³ + 3x²y + 3xy² + y³ and x³ - 3x²y + 3xy² - y³.',
          },
          {
            name: 'Identity VIII (Conditional Cubic Sum)',
            formula: 'x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx)',
            explanation: 'CRITICAL THEOREM: If x + y + z = 0, then x³ + y³ + z³ = 3xyz!',
          },
        ],
      },
      {
        title: '4. Step-by-Step Solved NCERT Model Examples',
        content: 'Classic examination questions worked out methodically:',
        examples: [
          {
            question: 'Factorise 6x² + 17x + 5 using the splitting the middle term method.',
            stepByStepSolution: [
              'Step 1: Identify coefficients a = 6, b = 17, c = 5.',
              'Step 2: Find two numbers p and q such that p + q = 17 and p × q = a × c = 6 × 5 = 30.',
              'Step 3: Factor pairs of 30: (1, 30), (2, 15), (3, 10), (5, 6). Clearly, 2 + 15 = 17.',
              'Step 4: Split the middle term: 6x² + 2x + 15x + 5.',
              'Step 5: Group and factor: 2x(3x + 1) + 5(3x + 1) = (3x + 1)(2x + 5).',
            ],
            tip: 'Always check your factors by mentally expanding the first and last terms.',
          },
          {
            question: 'Evaluate 103 × 107 without multiplying directly.',
            stepByStepSolution: [
              'Step 1: Express numbers in terms of 100: (100 + 3)(100 + 7).',
              'Step 2: Apply Identity IV: (x + a)(x + b) = x² + (a + b)x + ab, with x = 100, a = 3, b = 7.',
              'Step 3: Compute: 100² + (3 + 7)(100) + (3 × 7) = 10,000 + 1,000 + 21 = 11,021.',
            ],
            tip: 'Never multiply directly when the prompt specifies "using algebraic identities". Direct calculation receives 0 marks.',
          },
          {
            question: 'Without actually calculating the cubes, find the value of: (-12)³ + 7³ + 5³.',
            stepByStepSolution: [
              'Step 1: Let x = -12, y = 7, z = 5.',
              'Step 2: Test the condition x + y + z: (-12) + 7 + 5 = 0.',
              'Step 3: Recall the conditional theorem: If x + y + z = 0, then x³ + y³ + z³ = 3xyz.',
              'Step 4: Substitute values: 3 × (-12) × 7 × 5 = 3 × (-12) × 35 = -36 × 35 = -1260.',
            ],
            tip: 'Write the complete conditional theorem statement before doing the arithmetic for full board credits.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'Exponents of variable x must strictly be whole numbers (0, 1, 2, ...); 1/x or √x disqualify an expression from being a polynomial.',
      'The factor theorem is the bedrock of algebraic factoring for cubic polynomials using synthetic/long division.',
      'If (x - 1) is a factor, the sum of all coefficients is always 0: P(1) = 0.',
      'If (x + 1) is a factor, the sum of even-power coefficients equals the sum of odd-power coefficients: P(-1) = 0.',
    ],
    examTips: [
      'Write the identity formula on the right margin with "Since [Formula]" before substituting numbers.',
      'When splitting the middle term with negative signs, bracket carefully: -(ax + b) flips both signs.',
      'Never skip steps in long division; clearly display Quotient, Divisor, Remainder, and Dividend.',
    ],
  },

  // 2. Class 9 Science - Matter in Our Surroundings & Motion
  'sci_class9': {
    id: 'sci_class9',
    subjectId: 'sub_science',
    subjectName: 'Science',
    chapterNumber: 1,
    chapterTitle: 'Matter in Our Surroundings & Kinetic Theory',
    classLevel: 'Class 9',
    readingTimeMinutes: 10,
    badge: 'NCERT Chapter 1 • Core Physics/Chemistry',
    summary: 'Everything in the universe is made of particles. Matter occupies space and has mass. Physical states of matter (Solid, Liquid, Gas) are governed by kinetic energy and intermolecular forces.',
    sections: [
      {
        title: '1. Characteristics of Particles of Matter',
        content: 'Matter consists of tiny particles that behave according to the Kinetic Molecular Model.',
        points: [
          'Particles have spaces between them (Intermolecular space: Gas > Liquid > Solid).',
          'Particles are continuously moving (possess Kinetic Energy which increases with Temperature).',
          'Diffusion: Intermixing of particles of two different types of matter on their own. Rate of diffusion increases with temperature.',
          'Particles attract each other (Intermolecular force of attraction: Solid > Liquid > Gas).',
        ],
      },
      {
        title: '2. States of Matter Comparison Table',
        content: 'Key physical parameters distinguishing the three states:',
        points: [
          'Shape & Volume: Solids have fixed shape & fixed volume. Liquids have indefinite shape & fixed volume. Gases have indefinite shape & volume.',
          'Compressibility: Solids are negligible, Liquids are low, Gases are highly compressible (e.g., LPG, CNG cylinders).',
          'Density: Solid (Highest) > Liquid > Gas (Lowest). Exception: Ice floats on water because its open cage-like hexagonal structure creates a lower density than liquid water at 4°C.',
          'Fluidity: Liquids and gases flow and are termed fluids.',
        ],
      },
      {
        title: '3. Temperature Scales & Latent Heat Formulations',
        content: 'Conversion formulas and thermal energy relations:',
        formulas: [
          {
            name: 'Kelvin to Celsius Scale Conversion',
            formula: 'Temperature in Kelvin (K) = Temperature in °C + 273.15',
            explanation: 'SI unit of temperature is Kelvin (K). Zero Kelvin is Absolute Zero (-273.15°C).',
          },
          {
            name: 'Latent Heat of Fusion',
            formula: 'Heat energy required to change 1 kg of solid into liquid at atmospheric pressure at its melting point',
            explanation: 'Particles in water at 0°C (273 K) have MORE energy than particles in ice at 0°C.',
          },
          {
            name: 'Latent Heat of Vaporisation',
            formula: 'Heat energy required to change 1 kg of liquid into gas at atmospheric pressure at its boiling point',
            explanation: 'Steam at 100°C causes much more severe burns than boiling water at 100°C due to extra latent heat.',
          },
          {
            name: 'Sublimation',
            formula: 'Solid ⇄ Gas (Direct transition without liquid phase)',
            explanation: 'Examples: Camphor, Ammonium Chloride (NH₄Cl), Naphthalene, Dry Ice (Solid CO₂).',
          },
        ],
      },
      {
        title: '4. Evaporation & Cooling Effect',
        content: 'Evaporation is a surface phenomenon where liquid particles at the surface gain enough kinetic energy to overcome intermolecular attractions and escape as vapour at ANY temperature below its boiling point.',
        points: [
          'Factors increasing rate of evaporation: (1) Surface area increase, (2) Temperature increase, (3) Wind speed increase, (4) Humidity decrease.',
          'Mechanism of Cooling: Liquid absorbs latent heat of vaporisation from the surroundings, lowering surrounding temperature.',
          'Everyday examples: Water kept in earthen pots (matka) stays cool; wearing cotton clothes in summer; cooling effect of acetone or perfume on the palm.',
        ],
      },
    ],
    keyTakeaways: [
      'Boiling is a bulk phenomenon (occurs throughout liquid); evaporation is strictly a surface phenomenon.',
      'Kelvin scale temperature can never be negative in ordinary physical systems.',
      'Dry ice is solid carbon dioxide stored under high pressure; releasing pressure converts it directly to gas without wetting.',
    ],
    examTips: [
      'Always mention "Latent heat of vaporisation" when explaining why steam burns worse than boiling water.',
      'Cite all 4 factors when answering questions on rate of evaporation for full marks.',
    ],
  },

  // 3. Class 10 Mathematics - Real Numbers & Quadratic Equations
  'math_class10': {
    id: 'math_class10',
    subjectId: 'sub_maths',
    subjectName: 'Mathematics',
    chapterNumber: 1,
    chapterTitle: 'Real Numbers & Fundamental Theorem of Arithmetic',
    classLevel: 'Class 10',
    readingTimeMinutes: 11,
    badge: 'NCERT Chapter 1 • Board Exam Favorite',
    summary: 'Every composite number can be expressed as a unique product of primes. Proving irrationality of √2, √3, √5 through contradiction and analyzing prime factorizations.',
    sections: [
      {
        title: '1. Fundamental Theorem of Arithmetic',
        content: 'Every composite number can be uniquely factored as a product of prime numbers, except for the order in which prime factors occur.',
        points: [
          'Canonical Form: Composite number N = p₁ᵃ¹ · p₂ᵃ² · ... · pₖᵃᵏ where p are primes in ascending order.',
          'HCF: Product of smallest power of each common prime factor.',
          'LCM: Product of greatest power of each prime factor involved in the numbers.',
          'Product Formula (Valid ONLY for 2 numbers): HCF(a, b) × LCM(a, b) = a × b.',
        ],
      },
      {
        title: '2. Proving Irrationality (Proof by Contradiction)',
        content: 'Standard rigorous proof template for proving √p is irrational (where p is prime):',
        points: [
          'Step 1: Assume to the contrary that √p is rational. Hence √p = a/b, where a and b are co-prime integers and b ≠ 0.',
          'Step 2: Cross multiply and square both sides: p · b² = a². Therefore, p divides a².',
          'Step 3: Theorem 1.3: If a prime p divides a², then p divides a. Hence a = p · c for some integer c.',
          'Step 4: Substitute back: p · b² = (p · c)² = p² · c² ⇒ b² = p · c². Thus p divides b², which means p divides b.',
          'Step 5: Conclusion: Both a and b have at least p as a common factor. This contradicts our hypothesis that a and b are co-prime! Hence, √p is irrational.',
        ],
      },
      {
        title: '3. Key Formulas & Identities',
        content: 'Core quantitative tools for Chapter 1:',
        formulas: [
          {
            name: 'Two-Number Relation',
            formula: 'HCF(a, b) × LCM(a, b) = a × b',
            explanation: 'Warning: This does NOT hold for three numbers: HCF(a,b,c) × LCM(a,b,c) ≠ a·b·c.',
          },
          {
            name: 'Prime Factorization of 6ⁿ or 4ⁿ Ending in Zero',
            formula: 'Prime factorization must contain both 2 and 5 (2ᵐ × 5ⁿ)',
            explanation: 'Since 6 = 2 × 3, 6ⁿ = (2 × 3)ⁿ lacks the factor 5, so 6ⁿ can NEVER end with the digit 0 for any natural number n.',
          },
        ],
      },
    ],
    keyTakeaways: [
      'If p is prime, √p is always irrational.',
      'Sum, difference, product, and quotient of a non-zero rational and an irrational number is always irrational.',
      'HCF of two co-prime numbers is always 1, and their LCM is simply their product.',
    ],
    examTips: [
      'In irrationality proofs, explicitly define co-prime: "having no common factor other than 1".',
      'Never skip the theorem quotation: "If a prime p divides a², then p divides a".',
    ],
  },

  // 4. Class 9 English - The Fun They Had & Literature
  'eng_class9': {
    id: 'eng_class9',
    subjectId: 'sub_english',
    subjectName: 'English',
    chapterNumber: 1,
    chapterTitle: 'The Fun They Had (Beehive Chapter 1)',
    classLevel: 'Class 9',
    readingTimeMinutes: 8,
    badge: 'NCERT Beehive Chapter 1 • Isaac Asimov',
    summary: 'Set in the futuristic year 2157, Margie and Tommy discover an ancient printed paper book. The story contrasts hyper-individualized automated mechanical schooling with the warmth of shared communal human education.',
    sections: [
      {
        title: '1. Character Sketch & Setting',
        content: 'Key figures and dystopian futuristic backdrop:',
        points: [
          'Margie Jones (Age 11): Hates mechanical school, struggling with geography tests, longs for human companionship and shared social laughter.',
          'Tommy (Age 13): Pragmatic, curious, finds the century-old book in his attic and explains traditional schools to Margie.',
          'County Inspector: Friendly, round little man with a red face and box of tools who resets Margie’s mechanical teacher to an average 10-year-old level.',
          'Setting: Year 2157; students study individually in a room adjacent to their bedrooms through illuminated screen teachers.',
        ],
      },
      {
        title: '2. Key Themes & Central Message',
        content: 'Asimov’s visionary exploration of technological vs human learning:',
        points: [
          'The Power of Human Connection: Learning together in a common building creates empathy, camaraderie, and mutual academic support.',
          'Pitfalls of Over-Mechanization: Mechanical teachers cannot sense emotional burnout, boredom, or individual creative nuance.',
          'The Nostalgia of the "Real Book": Tangible paper books preserved static words that did not move like tele-books on screens.',
        ],
      },
    ],
    keyTakeaways: [
      'The title "The Fun They Had" refers to children of the past who went to school together, laughed, and helped each other with homework.',
      'Isaac Asimov predicted modern tele-learning and digital interfaces in 1951, while warning against total isolation from peer interaction.',
    ],
    examTips: [
      'Compare Margie’s mechanical teacher with traditional teachers in value-based long-answer questions (6 marks).',
      'Quote Margie’s diary opening: "17 May 2157: Today Tommy found a real book!"',
    ],
  },
};

export function getChapterNotesForSubject(subjectId: string, classLevel: string = 'Class 9'): ChapterNote {
  if (subjectId.includes('math') || subjectId === 'sub_maths') {
    return classLevel === 'Class 10' ? CHAPTER_NOTES['math_class10'] : CHAPTER_NOTES['poly_class9'];
  }
  if (subjectId.includes('sci') || subjectId === 'sub_science') {
    return CHAPTER_NOTES['sci_class9'];
  }
  if (subjectId.includes('eng') || subjectId === 'sub_english') {
    return CHAPTER_NOTES['eng_class9'];
  }
  // Default to Mathematics notes
  return CHAPTER_NOTES['poly_class9'];
}
