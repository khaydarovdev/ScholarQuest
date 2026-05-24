
import bcrypt from 'bcryptjs';
import { prisma } from './prisma.js';
import { ApplicationStatus } from '@prisma/client';

const scholarshipSeed = [
  {
    name: 'Schwarzman Scholars',
    description: 'A one-year, fully funded master’s program at Tsinghua University that brings together future leaders from around the world.',
    amount: 90000,
    currency: 'USD',
    deadline: new Date('2026-09-01T23:59:59.000Z'),
    country: 'China',
    field: 'Global Affairs',
    degreeLevel: 'Graduate',
    provider: 'Schwarzman Scholars',
    url: 'https://www.schwarzmanscholars.org/'
  },
  {
    name: 'Gates Cambridge Scholarship',
    description: 'Funding for outstanding applicants to the University of Cambridge who demonstrate academic excellence and a commitment to improving the lives of others.',
    amount: 85000,
    currency: 'USD',
    deadline: new Date('2026-12-01T23:59:59.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Gates Cambridge',
    url: 'https://www.gatescambridge.org/'
  },
  {
    name: 'Rhodes Scholarship',
    description: 'A historic postgraduate scholarship that supports exceptional students at the University of Oxford with a strong record of leadership and service.',
    amount: 80000,
    currency: 'USD',
    deadline: new Date('2026-10-15T23:59:59.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Rhodes Trust',
    url: 'https://www.rhodeshouse.ox.ac.uk/'
  },
  {
    name: 'Chevening Scholarship',
    description: 'UK Government scholarship for future leaders who want to study a one-year master’s degree at a UK university.',
    amount: 70000,
    currency: 'USD',
    deadline: new Date('2026-11-05T23:59:59.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Chevening',
    url: 'https://www.chevening.org/'
  },
  {
    name: 'DAAD EPOS',
    description: 'DAAD supports development-related postgraduate studies in Germany for highly qualified professionals from developing countries.',
    amount: 45000,
    currency: 'USD',
    deadline: new Date('2026-08-31T23:59:59.000Z'),
    country: 'Germany',
    field: 'Development Studies',
    degreeLevel: 'Graduate',
    provider: 'DAAD',
    url: 'https://www.daad.de/'
  },
  {
    name: 'Erasmus Mundus Joint Masters',
    description: 'Fully funded joint master’s degrees across multiple European universities with travel, tuition, and living support.',
    amount: 60000,
    currency: 'USD',
    deadline: new Date('2026-01-31T23:59:59.000Z'),
    country: 'Europe',
    field: 'Multidisciplinary',
    degreeLevel: 'Graduate',
    provider: 'European Commission',
    url: 'https://erasmus-plus.ec.europa.eu/'
  },
  {
    name: 'Fulbright Foreign Student Program',
    description: 'A flagship international exchange program supporting graduate study and research in the United States.',
    amount: 55000,
    currency: 'USD',
    deadline: new Date('2026-07-15T23:59:59.000Z'),
    country: 'United States',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Fulbright',
    url: 'https://foreign.fulbrightonline.org/'
  },
  {
    name: 'Knight-Hennessy Scholars',
    description: 'Stanford’s interdisciplinary graduate scholarship community for leaders who want to tackle big problems.',
    amount: 90000,
    currency: 'USD',
    deadline: new Date('2026-10-01T23:59:59.000Z'),
    country: 'United States',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Knight-Hennessy Scholars',
    url: 'https://knight-hennessy.stanford.edu/'
  },
  {
    name: 'Commonwealth Scholarship',
    description: 'Scholarships for talented individuals from eligible Commonwealth countries to study in the UK.',
    amount: 65000,
    currency: 'USD',
    deadline: new Date('2026-12-15T23:59:59.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Commonwealth Scholarship Commission',
    url: 'https://cscuk.fcdo.gov.uk/'
  },
  {
    name: 'MEXT Scholarship',
    description: 'The Japanese government scholarship for international students pursuing undergraduate and graduate study in Japan.',
    amount: 50000,
    currency: 'USD',
    deadline: new Date('2026-05-31T23:59:59.000Z'),
    country: 'Japan',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'MEXT',
    url: 'https://www.studyinjapan.go.jp/en/'
  }
];

const alumniSeed = [
  { name: 'Amina Patel', scholarship: 'Gates Cambridge', university: 'University of Cambridge', country: 'Kenya', bio: 'Researcher and public policy advocate focused on climate resilience and youth opportunity.', contact: 'mailto:amina@scholarquest.app', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80' },
  { name: 'Daniel Okoye', scholarship: 'Chevening', university: 'University of Edinburgh', country: 'Nigeria', bio: 'Product strategist who turned his scholarship network into a social-impact startup pipeline.', contact: 'https://www.linkedin.com/', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' },
  { name: 'Sara Mendoza', scholarship: 'Rhodes Scholarship', university: 'University of Oxford', country: 'Colombia', bio: 'Public service leader now mentoring first-generation applicants and building civic tech tools.', contact: 'mailto:sara@scholarquest.app', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80' },
  { name: 'Hassan Ibrahim', scholarship: 'DAAD EPOS', university: 'Karlsruhe Institute of Technology', country: 'Jordan', bio: 'Engineer working on climate adaptation systems and international research partnerships.', contact: 'mailto:hassan@scholarquest.app', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80' },
  { name: 'Maya Njoroge', scholarship: 'Commonwealth Scholarship', university: 'University of Bristol', country: 'Kenya', bio: 'Health systems researcher focused on access, equity, and long-term community impact.', contact: 'mailto:maya@scholarquest.app', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80' },
  { name: 'Luis Molina', scholarship: 'Erasmus Mundus', university: 'University of Amsterdam', country: 'Chile', bio: 'Journalist building a cross-border reporting career through a multilingual graduate path.', contact: 'https://www.linkedin.com/', photoUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=900&q=80' }
];

const storySeed = [
  {
    studentName: 'Amina Patel',
    university: 'University of Cambridge',
    country: 'Kenya',
    story: 'Used a Gates Cambridge scholarship to sharpen her public policy lens and build a global climate network.',
    testimonial: 'ScholarQuest would have saved me weeks of searching and guessing.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    scholarshipName: 'Gates Cambridge Scholarship'
  },
  {
    studentName: 'Sara Mendoza',
    university: 'University of Oxford',
    country: 'Colombia',
    story: 'Turned a Rhodes application into a leadership narrative focused on service, judgment, and public value.',
    testimonial: 'The structure mattered as much as the scholarship itself.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
    scholarshipName: 'Rhodes Scholarship'
  },
  {
    studentName: 'Daniel Okoye',
    university: 'University of Edinburgh',
    country: 'Nigeria',
    story: 'Chevening helped him expand his product thinking and connect with peers building civic tools across Europe.',
    testimonial: 'It felt like the beginning of a long-term professional network.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    scholarshipName: 'Chevening Scholarship'
  },
  {
    studentName: 'Hassan Ibrahim',
    university: 'Karlsruhe Institute of Technology',
    country: 'Jordan',
    story: 'DAAD EPOS supported graduate study that turned technical work into climate-adaptation outcomes.',
    testimonial: 'The scholarship opened the door to impact at scale.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    scholarshipName: 'DAAD EPOS'
  }
];

const guideSeed = [
  {
    scholarshipName: 'Schwarzman Scholars',
    title: 'Build a cohesive Schwarzman application',
    steps: [
      'Map your leadership story across academics, service, and ambition.',
      'Write concise essays that show judgment and future direction.',
      'Choose recommenders who can give high-signal examples.',
      'Review all materials early and submit before the final rush.'
    ],
    documentsNeeded: ['Transcripts', 'CV', 'Essays', 'Recommendations', 'English proficiency'],
    timeline: [
      { week: 'Week 1', task: 'Clarify goals and leadership narrative' },
      { week: 'Week 2', task: 'Draft essays and gather documents' },
      { week: 'Week 3', task: 'Request recommendations and verify transcript details' },
      { week: 'Week 4', task: 'Final proof, upload, and submit' }
    ]
  },
  {
    scholarshipName: 'Gates Cambridge Scholarship',
    title: 'Plan a Gates Cambridge application',
    steps: [
      'Confirm your course and funding deadline.',
      'Draft a strong statement of fit and impact.',
      'Request references early and align the timeline.',
      'Do a final pass for clarity and format.'
    ],
    documentsNeeded: ['University application', 'Funding statement', 'References', 'Transcript copies'],
    timeline: [
      { week: 'Week 1', task: 'Confirm course and deadline' },
      { week: 'Week 2', task: 'Write the funding statement' },
      { week: 'Week 3', task: 'Collect references and transcript copies' },
      { week: 'Week 4', task: 'Submit all materials' }
    ]
  },
  {
    scholarshipName: 'Rhodes Scholarship',
    title: 'Prepare a Rhodes application that reads with purpose',
    steps: [
      'Lead with service and academic excellence.',
      'Shape your statement around character and ambition.',
      'Coordinate referees early.',
      'Use interviews to demonstrate judgment and clarity.'
    ],
    documentsNeeded: ['CV', 'Transcript', 'Statement', 'Proposal', 'References'],
    timeline: [
      { week: 'Week 1', task: 'Outline the Rhodes case' },
      { week: 'Week 2', task: 'Draft and refine the statement' },
      { week: 'Week 3', task: 'Secure referees and verify the plan' },
      { week: 'Week 4', task: 'Submit ahead of schedule' }
    ]
  },
  {
    scholarshipName: 'Erasmus Mundus Joint Masters',
    title: 'Stay organized for Erasmus Mundus deadlines',
    steps: [
      'Pick the exact consortium you want to pursue.',
      'Check language and transcript rules carefully.',
      'Write why the joint structure matters to you.',
      'Submit earlier than you think you need to.'
    ],
    documentsNeeded: ['Bachelor transcript', 'Motivation letter', 'Language proof', 'Passport', 'References'],
    timeline: [
      { week: 'Week 1', task: 'Select the programme and read the brief' },
      { week: 'Week 2', task: 'Gather proof and documents' },
      { week: 'Week 3', task: 'Write the motivation letter' },
      { week: 'Week 4', task: 'Upload and submit' }
    ]
  }
];

export async function ensureBootstrapData() {
  const [scholarshipCount, alumniCount, storyCount, guideCount, appCount, savedCount] = await prisma.$transaction([
    prisma.scholarship.count(),
    prisma.alumni.count(),
    prisma.successStory.count(),
    prisma.guide.count(),
    prisma.application.count(),
    prisma.savedScholarship.count()
  ]);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@scholarquest.app' },
    update: {},
    create: {
      name: 'Demo Student',
      email: 'demo@scholarquest.app',
      password: await bcrypt.hash('ScholarQuest123!', 12),
      gpa: 3.88,
      major: 'Public Policy and Computer Science',
      nationality: 'Kenya',
      interests: ['leadership', 'global development', 'AI for social good'],
      degreeLevel: 'Graduate',
      targetCountry: 'United Kingdom',
      bio: 'A student profile used for live matching, shortlist testing, and dashboard previews.',
      profileComplete: true
    }
  });

  let scholarships = await prisma.scholarship.findMany({ orderBy: { id: 'asc' } });
  if (scholarshipCount === 0) {
    scholarships = await prisma.$transaction(
      scholarshipSeed.map((data) => prisma.scholarship.create({ data }))
    );
  }

  const byName = new Map(scholarships.map((s) => [s.name, s]));
  const pickScholarshipId = (name: string) => byName.get(name)?.id ?? scholarships[0]?.id;

  if (alumniCount === 0) {
    await prisma.alumni.createMany({ data: alumniSeed });
  }

  if (storyCount === 0) {
    await prisma.successStory.createMany({
      data: storySeed.map((item) => ({
        ...item,
        scholarshipId: pickScholarshipId(item.scholarshipName),
        userId: demoUser.id
      }))
    });
  }

  if (guideCount === 0) {
    for (const item of guideSeed) {
      const scholarship = byName.get(item.scholarshipName);
      if (!scholarship) continue;
      await prisma.guide.create({
        data: {
          scholarshipId: scholarship.id,
          title: item.title,
          steps: item.steps,
          documentsNeeded: item.documentsNeeded,
          timeline: item.timeline
        }
      });
    }
  }

  if (appCount === 0) {
    await prisma.application.createMany({
      data: [
        {
          userId: demoUser.id,
          scholarshipId: pickScholarshipId('Schwarzman Scholars'),
          status: ApplicationStatus.APPLIED,
          notes: 'Submitted after final essay review and transcript check.'
        },
        {
          userId: demoUser.id,
          scholarshipId: pickScholarshipId('Gates Cambridge Scholarship'),
          status: ApplicationStatus.SAVED,
          notes: 'Need to tailor the motivation letter.'
        }
      ]
    });
  }

  if (savedCount === 0) {
    await prisma.savedScholarship.createMany({
      data: [
        { userId: demoUser.id, scholarshipId: pickScholarshipId('Rhodes Scholarship'), reviewLater: false, note: 'Track constituency timing and references.' },
        { userId: demoUser.id, scholarshipId: pickScholarshipId('Erasmus Mundus Joint Masters'), reviewLater: true, note: 'Review consortium list and language requirements.' }
      ]
    });
  }
}
