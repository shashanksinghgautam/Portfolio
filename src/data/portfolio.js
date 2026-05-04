// Single source of truth for portfolio content. Edit here to update the site.

export const profile = {
  name: 'Shashank Singh Gautam',
  role: 'Full Stack Developer · Backend Specialist',
  tagline: 'Backend engineer building scalable, event-driven systems.',
  blurb:
    'I design and ship Java Spring Boot microservices and cloud-native platforms - focused on distributed systems, low-latency APIs, and developer-friendly architecture.',
  location: 'Bangalore, India',
  email: 'shashank.sde.singh@gmail.com',
  phone: '+91 7007680363',
  github: 'https://github.com/shashanksinghgautam',
  linkedin: 'https://www.linkedin.com/in/shashank0512',
  resumeUrl: '/Shashank_Resume_Java_4_years.pdf',
  yearsExperience: 4,
  metrics: [
    { value: '70%', label: 'Reduction in manual ops' },
    { value: '90%', label: 'Boost in processing efficiency' },
    { value: '60%', label: 'Faster API response time' },
    { value: '2K+',  label: 'Records processed/hour' },
  ],
};

export const about = {
  paragraphs: [
    "I'm a Full Stack Developer with 4+ years of experience designing scalable Java Spring Boot microservices and cloud-native applications. Currently at CGI India on the Bell Canada SmartHub platform, where I architect distributed systems that move thousands of records per hour with real-time guarantees.",
    'My toolkit spans HLD/LLD, design patterns, event-driven architecture, AWS, and modern frontend with React. I obsess over latency, fault tolerance, and clean code - and I love translating fuzzy product requirements into resilient backend systems.',
    'Outside work, I sharpen my craft with system-design deep dives and unwind with table tennis and cricket.',
  ],
  highlights: [
    'Distributed systems & event-driven architecture',
    'Spring Boot, Spring Security, Spring Data JPA',
    'AWS EC2, Lambda, ECR · Docker · Jenkins',
    'Kafka, MySQL, PostgreSQL, MongoDB, Redis',
    'React.js dashboards with real-time analytics',
    'System Design (HLD + LLD), Design Patterns, SOLID',
  ],
};

export const skillGroups = [
  {
    title: 'Languages',
    items: ['Java', 'JavaScript', 'TypeScript', 'SQL', 'Python'],
  },
  {
    title: 'Backend & Frameworks',
    items: ['Spring Boot', 'Spring MVC', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'Django'],
  },
  {
    title: 'Frontend',
    items: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    title: 'Databases',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    title: 'Cloud & DevOps',
    items: ['AWS EC2', 'AWS Lambda', 'Docker', 'Jenkins', 'CI/CD', 'Git'],
  },
  {
    title: 'Systems & Messaging',
    items: ['Apache Kafka', 'Event-Driven Architecture', 'Distributed Systems', 'Multithreading', 'REST APIs', 'GraphQL'],
  },
  {
    title: 'Testing & Tools',
    items: ['JUnit', 'Mockito', 'Selenium', 'Postman'],
  },
  {
    title: 'Architecture',
    items: ['Microservices', 'System Design (HLD/LLD)', 'Design Patterns', 'SOLID', 'Resilience Patterns'],
  },
];

export const projects = [
  {
    title: 'SmartHub Microservices Pipeline',
    subtitle: 'Bell Canada · CGI',
    description:
      'Architected a distributed microservices pipeline using JSON messaging, AWS EC2, and Lambda for event-driven processing - improving processing efficiency by 90%.',
    tech: ['Spring Boot', 'AWS EC2', 'AWS Lambda', 'Kafka', 'PostgreSQL'],
    impact: '90% efficiency boost',
    link: null,
  },
  {
    title: 'Real-time ITSM Notification System',
    subtitle: 'Bell SmartHub · CGI',
    description:
      'Designed an event-driven notification system using async messaging + multithreading for ITSM workflows - slashing incident response time by 70%.',
    tech: ['Spring Boot', 'Multithreading', 'Kafka', 'Resilience4j', 'Redis'],
    impact: '70% faster incident response',
    link: null,
  },
  {
    title: 'Automated Data Extraction Pipeline',
    subtitle: 'Bell SmartHub · CGI',
    description:
      'Built an automated extraction pipeline using Selenium + Django APIs that replaced manual data entry - cutting manual effort by 70% and lifting data accuracy by 80%.',
    tech: ['Python', 'Django', 'Selenium', 'REST APIs', 'MongoDB'],
    impact: '70% less manual work',
    link: null,
  },
  {
    title: 'High-throughput ServiceNow Integration',
    subtitle: 'Bell SmartHub · CGI',
    description:
      'Developed APIs integrating with ServiceNow GraphQL - processing 2,000+ records/hour using JPA/Hibernate with optimized schema, indexing, and connection pooling.',
    tech: ['Spring Boot', 'GraphQL', 'JPA/Hibernate', 'PostgreSQL'],
    impact: '60% faster API responses',
    link: null,
  },
  {
    title: 'Operational Analytics Dashboard',
    subtitle: 'Bell SmartHub · CGI',
    description:
      'Built responsive React.js dashboards with real-time analytics for operational insights - used daily by support and engineering teams.',
    tech: ['React.js', 'TypeScript', 'REST APIs', 'Charting'],
    impact: 'Real-time visibility',
    link: null,
  },
  {
    title: 'Secure API Layer with RBAC',
    subtitle: 'Bell SmartHub · CGI',
    description:
      'Implemented secure APIs with Spring Security, role-based access control, request validation, and audit logging - meeting enterprise compliance requirements.',
    tech: ['Spring Security', 'JWT', 'RBAC', 'Audit Logging'],
    impact: 'Enterprise-grade security',
    link: null,
  },
];

export const experience = [
  {
    company: 'CGI India',
    role: 'Full Stack Developer - Specialist · Bell SmartHub Team',
    period: 'Jun 2022 - Present',
    location: 'Bangalore, India',
    bullets: [
      'Architected distributed Spring Boot microservices on AWS, applying LLD/HLD and design patterns for high availability.',
      'Built an automated extraction pipeline (Selenium + Django) cutting manual ops 70% and lifting accuracy 80%.',
      'Designed an event-driven ITSM notification system reducing incident response time 70%.',
      'Developed high-throughput APIs integrating ServiceNow GraphQL - 2K+ records/hour via JPA/Hibernate.',
      'Tuned schemas, indexing, and queries - improved API response time 60%.',
      'Implemented logging, monitoring, and observability for faster production issue resolution.',
      'Built secure APIs with Spring Security, RBAC, validation, and audit logging.',
      'Shipped responsive React.js dashboards with real-time operational analytics.',
    ],
    awards: ['Silver Award 2026', 'Bronze Award 2025', 'Bronze Award 2024'],
  },
];

export const education = [
  {
    school: 'Indian Institute of Information Technology, Senapati',
    degree: 'B.Tech, Electronics and Communications Engineering',
    period: 'Aug 2018 - May 2022',
    location: 'Imphal, India',
    detail: 'CGPA: 7.66 / 10.0',
  },
];

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];
