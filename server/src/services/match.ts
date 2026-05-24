type Scholarship = {
  id: number;
  name: string;
  description: string;
  amount: number;
  currency: string;
  deadline: Date;
  country: string;
  field: string;
  degreeLevel: string;
  provider: string;
};

export type MatchInput = {
  gpa?: number;
  major?: string;
  nationality?: string;
  interests?: string[];
  degreeLevel?: string;
  targetCountry?: string;
};

export type MatchedScholarship = Scholarship & {
  score: number;
  reasons: string[];
};

function normalize(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

export function scoreScholarship(scholarship: Scholarship, profile: MatchInput): MatchedScholarship {
  let score = 0;
  const reasons: string[] = [];

  const major = normalize(profile.major);
  const field = normalize(scholarship.field);
  const interests = (profile.interests ?? []).map(normalize).filter(Boolean);
  const degree = normalize(profile.degreeLevel);
  const targetCountry = normalize(profile.targetCountry);
  const country = normalize(scholarship.country);
  const nationality = normalize(profile.nationality);
  const description = scholarship.description.toLowerCase();

  if (major && (field.includes(major) || major.includes(field))) {
    score += 22;
    reasons.push('Major aligns with the scholarship field');
  }

  const matchedInterest = interests.find((i) => field.includes(i) || description.includes(i));
  if (matchedInterest) {
    score += 22;
    reasons.push(`Interest match: ${matchedInterest}`);
  }

  if (degree && normalize(scholarship.degreeLevel) === degree) {
    score += 18;
    reasons.push('Correct degree level');
  }

  if (targetCountry && country === targetCountry) {
    score += 14;
    reasons.push('Preferred country match');
  }

  if (nationality && country !== nationality) {
    score += 6;
    reasons.push('International mobility fit');
  }

  if (profile.gpa && profile.gpa >= 3.7) {
    score += 10;
    reasons.push('Competitive GPA');
  } else if (profile.gpa && profile.gpa >= 3.3) {
    score += 6;
    reasons.push('Solid academic standing');
  }

  if (scholarship.amount >= 30000) {
    score += 8;
    reasons.push('Strong funding potential');
  } else if (scholarship.amount > 0) {
    score += 5;
    reasons.push('Meaningful funding support');
  }

  if (!reasons.length) {
    reasons.push('Broad opportunity worth reviewing');
    score += 5;
  }

  return { ...scholarship, score: Math.min(score, 100), reasons };
}
