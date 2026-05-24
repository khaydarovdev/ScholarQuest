import * as PrismaClientPkg from '@prisma/client';
import bcrypt from 'bcryptjs';

const PrismaClient = (PrismaClientPkg as any).PrismaClient;
const ApplicationStatus = (PrismaClientPkg as any).ApplicationStatus as { [key: string]: string };
const prisma = new PrismaClient();

const scholarshipSeed = [
  {
    name: 'Schwarzman Scholars',
    description: 'A one-year, fully funded master’s program in global affairs at Tsinghua University in Beijing for future global leaders.',
    amount: 0,
    currency: 'USD',
    deadline: new Date('2026-09-09T19:00:00.000Z'),
    country: 'China',
    field: 'Global Affairs',
    degreeLevel: 'Graduate',
    provider: 'Schwarzman Scholars',
    url: 'https://www.schwarzmanscholars.org/admissions/'
  },
  {
    name: 'Gates Cambridge Scholarship',
    description: 'A full-cost scholarship for outstanding applicants outside the United Kingdom to pursue a postgraduate degree at the University of Cambridge. The 2027 cycle opens in September 2026 and the deadline is course-dependent.',
    amount: 0,
    currency: 'GBP',
    deadline: new Date('2026-12-15T23:59:00.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Gates Cambridge',
    url: 'https://www.gatescambridge.org/'
  },
  {
    name: 'Rhodes Scholarship',
    description: 'The Rhodes Scholarship is a life-changing postgraduate opportunity to join outstanding young people from around the world to study at Oxford. The 2026 cycle is closed and the next round will reopen with constituency-specific dates.',
    amount: 0,
    currency: 'USD',
    deadline: new Date('2026-10-01T23:59:00.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Rhodes Trust',
    url: 'https://www.rhodeshouse.ox.ac.uk/scholarships/applications/'
  },
  {
    name: 'Chevening Scholarships',
    description: 'The UK Government’s fully funded international scholarship programme for one-year master’s degrees in the UK. The 2025 application window closed on 7 October 2025.',
    amount: 0,
    currency: 'GBP',
    deadline: new Date('2025-10-07T12:00:00.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Chevening',
    url: 'https://www.chevening.org/scholarships/application-timeline/'
  },
  {
    name: 'Erasmus Mundus Joint Masters',
    description: 'European Union funding for joint master’s programmes. The 2026 call opened in late November 2025 with a deadline of 12 February 2026 at 17:00 CET.',
    amount: 33600,
    currency: 'EUR',
    deadline: new Date('2026-02-12T16:00:00.000Z'),
    country: 'Multiple countries',
    field: 'Multidisciplinary',
    degreeLevel: 'Graduate',
    provider: 'European Commission',
    url: 'https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters'
  },
  {
    name: 'DAAD EPOS',
    description: 'Development-related postgraduate courses in Germany for graduates with professional experience from eligible countries. Deadlines vary by programme, with the 2026/27 programme list published by DAAD.',
    amount: 24000,
    currency: 'EUR',
    deadline: new Date('2026-03-15T23:59:00.000Z'),
    country: 'Germany',
    field: 'Development Studies',
    degreeLevel: 'Graduate',
    provider: 'DAAD',
    url: 'https://www.daad.de/en/information-services-for-higher-education-institutions/further-information-on-daad-programmes/epos/'
  },
  {
    name: 'Cambridge Africa Changemakers Scholarship',
    description: 'A full-cost PhD scholarship for students from any African country across eligible subjects at the University of Cambridge.',
    amount: 0,
    currency: 'GBP',
    deadline: new Date('2026-02-01T23:59:00.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'PhD',
    provider: 'Cambridge Trust',
    url: 'https://www.cambridgetrust.org/scholarship/cambridge-africa-changemakers-scholarship/'
  },
  {
    name: 'Bhutan King’s Scholarship',
    description: 'A Cambridge Trust scholarship for Bhutanese masters applicants across eligible subjects at the University of Cambridge.',
    amount: 12000,
    currency: 'GBP',
    deadline: new Date('2026-03-15T23:59:00.000Z'),
    country: 'United Kingdom',
    field: 'Any field',
    degreeLevel: 'Graduate',
    provider: 'Cambridge Trust',
    url: 'https://www.cambridgetrust.org/scholarship/bhutan-kings-scholarship-at-the-university-of-cambridge/'
  }
];

const alumniSeed = [
  {
    name: 'Luis Felipe Molina',
    scholarship: 'Chevening Scholarships',
    university: 'Goldsmiths, University of London',
    country: 'Colombia',
    bio: 'Journalist and media strategist whose scholarship path strengthened public-interest reporting and international editorial networks.',
    contact: 'https://www.chevening.org/chevening-impact-report-2022-2023-scholar-stories/',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Rebecca Gao',
    scholarship: 'Chevening Scholarships',
    university: 'The University of Edinburgh',
    country: 'China',
    bio: 'Scholar and community builder who used the UK experience to grow an international education network and stay connected to peers across borders.',
    contact: 'https://www.chevening.org/chevening-impact-report-2022-2023-scholar-stories/',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Viktoriia Neiman',
    scholarship: 'Rhodes Scholarship',
    university: 'University of Oxford',
    country: 'Ukraine',
    bio: 'Scholar whose post-study work has been tied to public service and reconstruction efforts with a long-term civic lens.',
    contact: 'https://www.rhodeshouse.ox.ac.uk/',
    photoUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Katerin Carrillo',
    scholarship: 'DAAD EPOS',
    university: 'Karlsruhe Institute of Technology',
    country: 'Colombia',
    bio: 'Engineer and founder who bridged academic exchange with social entrepreneurship and climate-focused work.',
    contact: 'https://www.daad.de/en/the-daad/daad-journal/topics/returning-to-colombia-former-daad-funding-recipients-tell-their-stories/',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Maya Njoroge',
    scholarship: 'Cambridge Africa Changemakers Scholarship',
    university: 'University of Cambridge',
    country: 'Kenya',
    bio: 'Public health researcher working at the intersection of access, prevention, and systems-level health equity.',
    contact: 'mailto:maya.njoroge@scholarquest.app',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80'
  }
];

const storySeed = [
  {
    studentName: 'Luis Felipe Molina',
    university: 'Goldsmiths, University of London',
    country: 'Colombia',
    story: 'He expanded his editorial range, completed a BBC World Service placement, and returned home with a sharper public-interest journalism voice.',
    testimonial: 'The experience and the connections I made became instrumental in my career.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    scholarshipName: 'Chevening Scholarships'
  },
  {
    studentName: 'Rebecca Gao',
    university: 'The University of Edinburgh',
    country: 'China',
    story: 'Her scholarship experience gave her a global peer network and the confidence to keep widening access to international education.',
    testimonial: 'Chevening made me feel like I belonged in a community that shares the same goal.',
    photoUrl: 'https://images.unsplash.com/photo-1491349174775-aaafddd81942?auto=format&fit=crop&w=900&q=80',
    scholarshipName: 'Chevening Scholarships'
  },
  {
    studentName: 'Katerin Carrillo',
    university: 'Karlsruhe Institute of Technology',
    country: 'Colombia',
    story: 'A DAAD-funded exchange and later graduate study helped her connect engineering discipline with social entrepreneurship in Colombia.',
    testimonial: 'I still benefit from excellent links with several institutions in Germany.',
    photoUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=900&q=80',
    scholarshipName: 'DAAD EPOS'
  },
  {
    studentName: 'Viktoriia Neiman',
    university: 'University of Oxford',
    country: 'Ukraine',
    story: 'After her scholarship experience, she moved into work connected with rebuilding and strengthening public systems at home.',
    testimonial: 'Scholarship support can become a platform for long-term public impact.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    scholarshipName: 'Rhodes Scholarship'
  }
];

const guideSeed = [
  {
    scholarshipName: 'Schwarzman Scholars',
    title: 'How to prepare a Schwarzman application that feels coherent and sharp',
    steps: [
      'Frame a leadership story that connects your academic choices, community work, and future goals.',
      'Write essays that show judgment, not just achievement; show how you think under pressure.',
      'Choose recommenders who can describe your leadership with specific, high-trust examples.',
      'Finish the final pass early so you can review every answer with enough distance to spot gaps.'
    ],
    documentsNeeded: [
      'Transcripts',
      'Résumé / CV',
      'Personal statement',
      'Leadership essays',
      'Three recommendation letters'
    ],
    timeline: [
      { week: 'Week 1', task: 'Map your leadership arc and goals' },
      { week: 'Week 2', task: 'Draft essays and gather evidence' },
      { week: 'Week 3', task: 'Request recommendations and verify transcript details' },
      { week: 'Week 4', task: 'Edit, review, and submit before the deadline' }
    ]
  },
  {
    scholarshipName: 'Gates Cambridge Scholarship',
    title: 'Gates Cambridge application plan for the 2027 cycle',
    steps: [
      'Confirm your course funding deadline in the Cambridge course directory before anything else.',
      'Build a statement that explains academic fit, purpose, and long-term impact.',
      'Coordinate references early so they can align with the funding timeline.',
      'Use the final edit pass to catch missing context, formatting issues, and deadline mismatches.'
    ],
    documentsNeeded: [
      'University application',
      'Funding statement',
      'References',
      'Research proposal if required',
      'Transcript copies'
    ],
    timeline: [
      { week: 'Week 1', task: 'Confirm the course and funding deadline' },
      { week: 'Week 2', task: 'Draft the funding statement' },
      { week: 'Week 3', task: 'Request and upload references' },
      { week: 'Week 4', task: 'Submit the full application on time' }
    ]
  },
  {
    scholarshipName: 'Rhodes Scholarship',
    title: 'Rhodes scholarship preparation guide',
    steps: [
      'Lead with evidence of academic excellence and public service.',
      'Shape your personal statement around service, character, and ambition.',
      'Coordinate referees early because the application is reference heavy.',
      'Treat interviews as a conversation about judgment, purpose, and fit.'
    ],
    documentsNeeded: [
      'Curriculum vitae',
      'Academic transcript',
      'Personal statement',
      'Study proposal',
      'References'
    ],
    timeline: [
      { week: 'Week 1', task: 'Outline Rhodes values and your case' },
      { week: 'Week 2', task: 'Draft the statement and secure referees' },
      { week: 'Week 3', task: 'Finalize the application and verify institution details' },
      { week: 'Week 4', task: 'Submit well ahead of the deadline' }
    ]
  },
  {
    scholarshipName: 'Erasmus Mundus Joint Masters',
    title: 'Erasmus Mundus timing and document plan',
    steps: [
      'Use the consortium list to identify the exact programme you want to pursue.',
      'Check each partner university’s language and transcript requirements carefully.',
      'Prepare a statement that explains why the joint structure matters for your goals.',
      'Submit earlier than you think; many programmes open and close in a short window.'
    ],
    documentsNeeded: [
      'Bachelor’s transcript',
      'Motivation letter',
      'Language proficiency proof',
      'Passport or ID',
      'Recommendation letters'
    ],
    timeline: [
      { week: 'Week 1', task: 'Choose the joint programme and read the consortium brief' },
      { week: 'Week 2', task: 'Gather documents and language evidence' },
      { week: 'Week 3', task: 'Write the motivation letter and request references' },
      { week: 'Week 4', task: 'Upload, verify, and submit' }
    ]
  }
];

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedScholarship.deleteMany();
  await prisma.successStory.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.alumni.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.user.deleteMany();

  const demoUser = await prisma.user.create({
    data: {
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

  const scholarships = [];
  for (const item of scholarshipSeed) {
    scholarships.push(await prisma.scholarship.create({ data: item }));
  }

  const scholarshipByName = new Map(scholarships.map(s => [s.name, s]));

  for (const item of alumniSeed) {
    await prisma.alumni.create({ data: item });
  }

  for (const item of storySeed) {
    const scholarship = scholarshipByName.get(item.scholarshipName) ?? scholarships[0];
    await prisma.successStory.create({
      data: {
        studentName: item.studentName,
        university: item.university,
        country: item.country,
        story: item.story,
        testimonial: item.testimonial,
        photoUrl: item.photoUrl,
        scholarshipId: scholarship.id,
        userId: demoUser.id
      }
    });
  }

  for (const item of guideSeed) {
    const scholarship = scholarshipByName.get(item.scholarshipName);
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

  await prisma.application.createMany({
    data: [
      {
        userId: demoUser.id,
        scholarshipId: scholarshipByName.get('Schwarzman Scholars')!.id,
        status: ApplicationStatus.APPLIED,
        notes: 'Submitted after final essay review and transcript check.'
      },
      {
        userId: demoUser.id,
        scholarshipId: scholarshipByName.get('Gates Cambridge Scholarship')!.id,
        status: ApplicationStatus.SAVED,
        notes: 'Need to tailor the motivation letter and course funding statement.'
      },
      {
        userId: demoUser.id,
        scholarshipId: scholarshipByName.get('DAAD EPOS')!.id,
        status: ApplicationStatus.INTERVIEW,
        notes: 'Interview prep focused on leadership and cross-cultural work.'
      }
    ]
  });

  await prisma.savedScholarship.createMany({
    data: [
      { userId: demoUser.id, scholarshipId: scholarshipByName.get('Rhodes Scholarship')!.id, reviewLater: false, note: 'Track constituency timing and references.' },
      { userId: demoUser.id, scholarshipId: scholarshipByName.get('Erasmus Mundus Joint Masters')!.id, reviewLater: true, note: 'Review consortium list and language requirements.' },
      { userId: demoUser.id, scholarshipId: scholarshipByName.get('Cambridge Africa Changemakers Scholarship')!.id, reviewLater: true, note: 'Good fit for PhD plans and Africa-facing research.' }
    ],
    skipDuplicates: true
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
