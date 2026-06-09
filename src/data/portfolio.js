// Single source of truth for portfolio content. Edit here to update the site.

export const profile = {
  name: 'Shashank Singh Gautam',
  role: 'Python Full Stack Developer',
  tagline: 'Python full-stack engineer building enterprise platforms with Django, FastAPI & React.',
  blurb:
    'I design and ship production Django and FastAPI backends, REST APIs, and React frontends - focused on clean architecture, measurable performance, and automation that removes manual work for enterprise teams.',
  location: 'Bangalore, India',
  email: 'shashank.sde.singh@gmail.com',
  phone: '+91 7007680363',
  github: 'https://github.com/shashanksinghgautam',
  linkedin: 'https://www.linkedin.com/in/shashank0512',
  resumeUrl: '/Shashank_Resume_Py_4.pdf',
  awardsPdfUrl: '/CGI_AWARDS.pdf',
  yearsExperience: 4,
  metrics: [
    { value: '90%', label: 'Less manual processing' },
    { value: '70%', label: 'Faster incident response' },
    { value: '99%', label: 'Cross-platform sync success' },
    { value: '60%', label: 'Query performance gain' },
  ],
};

export const about = {
  paragraphs: [
    "I'm a Full Stack Developer with 4+ years of experience at CGI India, building enterprise systems with Django, FastAPI, and React.js. I work across the Bell Automation portfolio, where I deliver backend architecture, REST APIs, and automation pipelines that move high volumes of data reliably.",
    'My focus is backend craft: well-normalized schemas, efficient Django ORM query layers, reusable API frameworks, and event-driven workflows backed by RabbitMQ. I pair that with React frontends so the systems I design are genuinely usable end to end.',
    'I have shipped measurable impact across multiple production platforms - from a 90% cut in manual processing to a 99% cross-platform transaction success rate - and have been recognized with three CGI performance awards. Outside work, I enjoy system-design deep dives, table tennis, cricket, and cooking.',
  ],
  highlights: [
    'Django & FastAPI backend architecture',
    'Django REST Framework & reusable API design',
    'Event-driven workflows · RabbitMQ',
    'PostgreSQL, MongoDB & query optimization',
    'React.js dashboards with role-based access',
    'Automation, data sync & process engineering',
  ],
};

export const skillGroups = [
  {
    title: 'Languages',
    items: ['Python', 'JavaScript', 'Java', 'SQL'],
  },
  {
    title: 'Backend & Frameworks',
    items: ['Django', 'Django REST Framework', 'FastAPI', 'REST APIs', 'Microservices', 'Multithreading', 'Pandas'],
  },
  {
    title: 'Frontend',
    items: ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'Bootstrap', 'HTML5', 'Vite'],
  },
  {
    title: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'NeonDB', 'Elasticsearch'],
  },
  {
    title: 'AI & Cloud',
    items: ['LangChain', 'LangGraph', 'Azure OpenAI (GPT-4o)', 'Google ADK', 'Agentic AI', 'RAG', 'AWS'],
  },
  {
    title: 'Messaging & Async',
    items: ['RabbitMQ', 'Event-Driven Architecture', 'asyncio', 'ThreadPoolExecutor'],
  },
  {
    title: 'Testing & Tools',
    items: ['PyTest', 'Selenium', 'Postman', 'Swagger', 'API Testing'],
  },
  {
    title: 'DevOps & Concepts',
    items: ['Docker', 'Nginx', 'Gunicorn', 'Linux', 'CI/CD', 'Git', 'OOP', 'SOLID'],
  },
];

export const projects = [
  {
    title: 'Agentic AI Operations Platform (AIOps)',
    subtitle: 'Bell Automation · CGI',
    description:
      'Built an agentic reasoning loop with LangChain and GPT-4o supporting up to 15-step iterative tool invocation, dynamic REST API execution, and contextual responses. Backed by an async FastAPI service with RabbitMQ distributed logging and real-time activity streaming to a React chat UI.',
    tech: ['Python', 'FastAPI', 'LangChain', 'Azure OpenAI', 'RabbitMQ', 'React.js'],
    impact: '80% lower init overhead',
    link: null,
  },
  {
    title: 'Shift Roster Management System',
    subtitle: 'Bell Automation · CGI',
    description:
      'Architected a normalized, microservice-oriented roster platform for team setup, roster cloning, automated email distribution, and high-volume scheduling. Added an interactive React scheduling module with on-call linking, exports, Twilio voice conferencing, and SDM-level role-based access.',
    tech: ['Django', 'Django REST Framework', 'React.js', 'PostgreSQL', 'Twilio'],
    impact: 'Manual coordination removed',
    link: null,
  },
  {
    title: 'Adhoc Opportunity Management Platform',
    subtitle: 'Bell Automation · CGI',
    description:
      'Delivered a full-stack, event-driven workflow platform for SDMs, Directors, and Clients to onboard and track adhoc opportunities with real-time funding and approval visibility. Built role-based KPI dashboards and a multi-level email approval chaining engine with dynamic stakeholder selection.',
    tech: ['Django', 'React.js', 'PostgreSQL', 'Docker', 'REST APIs'],
    impact: 'Leadership-level tracking',
    link: null,
  },
  {
    title: 'Generic Pagination & Dynamic API Framework',
    subtitle: 'Bell Automation · CGI',
    description:
      'Engineered a reusable Django REST Framework pagination engine with dynamic searching, sorting, advanced filtering, and metadata-driven responses. Class-based views with serializer abstraction and reusable filter utilities cut duplicate backend work across enterprise modules and improved dashboard usability.',
    tech: ['Python', 'Django REST Framework', 'PostgreSQL', 'API Design'],
    impact: 'Reused across modules',
    link: null,
  },
  {
    title: 'Subscription & Notification Engine',
    subtitle: 'Bell Automation · CGI',
    description:
      'Built an event-driven pub-sub notification engine for real-time ITSM incident alerts, reducing response times by 70%. Refactored the database schema and Django ORM query layer to resolve normalization bottlenecks and improve query performance by 60%, with RBAC, crontab scheduling, and caching.',
    tech: ['Django', 'PostgreSQL', 'RabbitMQ', 'Event-Driven', 'RBAC'],
    impact: '70% faster incident response',
    link: null,
  },
  {
    title: 'Application 360°',
    subtitle: 'Bell Automation · CGI',
    description:
      'Architected a microservices ecosystem with Django, React.js, and REST APIs for seamless SmartOps–SmartHub synchronization at a 99% transaction success rate. Automated cross-platform JSON sync pipelines between India and Canada, improving processing efficiency by 90%, with JWT auth and audit logging.',
    tech: ['Django', 'React.js', 'REST APIs', 'PostgreSQL', 'JWT'],
    impact: '99% sync success rate',
    link: null,
  },
];

export const experience = [
  {
    company: 'CGI India',
    role: 'Full Stack Developer',
    period: 'Jun 2022 - Present',
    location: 'Bangalore, India · Bell Automation Team',
    bullets: [
      'Delivered enterprise platforms across the Bell Automation portfolio using Django, FastAPI, Django REST Framework, and React.js.',
      'Built an agentic reasoning loop with LangChain + GPT-4o and an async FastAPI backend with RabbitMQ distributed logging and real-time streaming.',
      'Architected microservices for SmartOps–SmartHub synchronization at a 99% transaction success rate and 90% better processing efficiency.',
      'Engineered a pub-sub notification engine for real-time ITSM alerts, cutting incident response time by 70%.',
      'Refactored database schemas and the Django ORM query layer, improving query performance by 60%.',
      'Created a reusable DRF pagination and dynamic API framework that reduced duplicate backend development across modules.',
      'Implemented JWT authentication, class-based API authorization, and RBAC to enforce secure role-based access.',
      'Containerized platforms with Docker and deployed demo environments for multiple enterprise clients.',
    ],
    awards: ['Silver Award 2026', 'Bronze Award 2025', 'Bronze Award 2024'],
  },
];

export const achievements = [
  {
    metric: '3×',
    title: 'CGI Performance Awards',
    description:
      'Recognized with one Silver (2026) and two Bronze (2024, 2025) awards for full-stack development and automation contributions.',
  },
  {
    metric: '90%',
    title: 'Manual Processing Eliminated',
    description:
      'Automated cross-platform JSON sync and data pipelines that replaced manual handoffs between India and Canada teams.',
  },
  {
    metric: '99%',
    title: 'Cross-Platform Sync Success',
    description:
      'Architected the Application 360° microservices ecosystem achieving a 99% SmartOps–SmartHub transaction success rate.',
  },
  {
    metric: '70%',
    title: 'Faster Incident Response',
    description:
      'Designed an event-driven pub-sub notification engine delivering real-time ITSM incident alerts to operations teams.',
  },
  {
    metric: '60%',
    title: 'Query Performance Gain',
    description:
      'Refactored normalized schemas and the Django ORM query layer to remove bottlenecks across enterprise reporting workflows.',
  },
  {
    metric: '6+',
    title: 'Production Platforms Shipped',
    description:
      'Delivered and maintained multiple enterprise platforms end to end across backend, frontend, and deployment.',
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
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#achievements', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
];
