export const site = {
  firstName: 'Abubakar',
  lastName: 'Mahmood',
  name: 'Abubakar Mahmood',
  shortName: 'am',
  role: 'Junior Software Engineer',
  title: 'Abubakar Mahmood - Junior Software Engineer',
  description:
    'Junior Software Engineer in Lahore focused on Flutter, backend APIs, offline-first systems, and practical production-minded software.',
  url: 'https://abubakarmahmood.com',
  email: 'theabubakar321@gmail.com',
  availability: 'open to opportunities',
  availabilityLong: 'available for opportunities',
  location: {
    city: 'Lahore',
    countryCode: 'PK',
    timeZone: 'UTC+05'
  },
  socials: {
    github: {
      url: 'https://github.com/AbubakarMahmood',
      display: 'github.com/AbubakarMahmood'
    },
    linkedin: {
      url: 'https://linkedin.com/in/abubakar-mahmood',
      display: 'linkedin.com/in/abubakar-mahmood'
    }
  },
  sections: [
    { id: 'intro', label: 'intro' },
    { id: 'work', label: 'work' },
    { id: 'stack', label: 'stack' },
    { id: 'contact', label: 'contact' }
  ]
} as const;

export type SiteSection = (typeof site.sections)[number];
