// ============================================================
//  AYUSHI'S CAFE — PORTFOLIO DATA
// ============================================================

export const profile = {
  name: 'Ayushi Bose',
  title: 'Computer Science Student | Software, Data & Product',
  tagline: ' CS student passionate about leveraging data analytics and strategy with AI to solve real problems.',
  heroLine: ' I love working on projects that combine analytics, communication and creative problem-solving.',
  location: 'United Kingdom',
  email: 'ayushibose12@gmail.com',
  cvUrl: '/Ayushi-Bose-CV.pdf',
  summary:
    "I'm a 3rd-year Computer Science student at the University of Southampton with experience across software engineering, data analysis, cloud technology and test automation.\n \n I enjoy building practical products that turn complex technical information into clear, useful experiences.\n\nDuring my Summer 2026 internship with Legal & General, I worked on a test-coverage dashboard designed to help quality engineers understand how much of their frontend codebase was covered by automated testing. Alongside technical development, I gained experience working in an engineering team through stand-ups, sprint reviews and stakeholder conversations.\n\nI'm particularly interested in roles that combine technology with analysis, product thinking and communication, including software engineering, data, business analysis and product or strategy-focused opportunities.",
};

export const stats = [
  { label: 'University', value: 'Southampton' },
  { label: 'Course', value: 'Computer Science' },
  { label: 'Predicted Grade', value: '1st-Class' },
];

// --- Skills & technologies (Menu Board) -------------------
export type SkillGroup = {
  category: string;
  icon: string; // lucide icon name
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: 'Programming',
    icon: 'Code2',
    items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'SQL', 'R', 'Haskell', 'Bash'],
  },
  {
    category: 'Web Development',
    icon: 'Layout',
    items: ['React', 'Node.js', 'HTML', 'CSS', 'FastAPI', 'Streamlit', 'REST APIs'],
  },
  {
    category: 'Data & Machine Learning',
    icon: 'BarChart3',
    items: ['pandas', 'scikit-learn', 'NLP', 'VADER sentiment analysis', 'Data visualisation', 'Excel'],
  },
  {
    category: 'Cloud & DevOps',
    icon: 'Cloud',
    items: ['AWS', 'EC2', 'S3', 'IAM', 'VPC', 'Docker', 'GitHub Actions', 'Kubernetes', 'Minikube', 'Linux'],
  },
  {
    category: 'Business Analysis & Product',
    icon: 'Wrench',
    items:  [
    "Stakeholder Communication",
    "Requirements Analysis",
    "Jira",
    "Agile Ways of Working",
    "Problem Solving",
    "Technical Documentation",
    "Presenting Insights",
  ],
  },
];

// --- Projects (Espresso Machine) ---------------------------
export type Project = {
  name: string;
  description: string;
  tags: string[];
  link?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    name: 'Customer Sentiment Visualiser',
    description:
      'A sentiment-analysis tool that turns large numbers of Amazon customer reviews into an accessible overview of customer opinion.',
    tags: ['JavaScript', 'Chrome Extension MV3', 'Python', 'FastAPI', 'Streamlit', 'VADER NLP'],
  },
  {
    name: 'ESG-Aware Stock Classification',
    description:
      'A machine-learning project exploring how financial and ESG information can be combined when classifying stocks.',
    tags: ['Python', 'pandas', 'scikit-learn', 'yfinance', 'Data visualisation'],
  },
  {
    name: 'DevOps CI/CD Pipeline',
    description:
      'A containerised application deployment workflow designed to automate testing, building and deployment.',
    tags: ['Python', 'Flask', 'Docker', 'GitHub Actions', 'Kubernetes', 'Minikube'],
  },
  {
    name: 'React Portfolio',
    description:
      'A personal portfolio website created to present my education, experience and technical projects.',
    tags: ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS'],
  },
];

// --- Experience (Laptop) ------------------------------------
export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  location?: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: 'OneTech Services Summer Intern',
    company: 'Legal & General',
    period: 'June 2026 – August 2026',
    highlights: [
      'Developed a dashboard showing automated test coverage across frontend applications',
      'Helped turn scattered coverage information into a clearer view for quality engineers maintaining the frontend platform',
      'Worked with TypeScript and JavaScript to extract results from tools including Playwright, Jest and Postman',
      'Investigated coverage data, repository configurations and application mappings',
      'Participated in daily stand-ups, sprint reviews and conversations with engineering stakeholders',
      'Presented the completed internship project to colleagues and senior stakeholders',
    ],
  },
  {
    role: 'AWS re/Start Trainee',
    company: 'Primed Talent',
    period: '',
    highlights: [
      'Completed a 12-week cloud-computing training programme',
      'Completed more than 30 hours of practical AWS labs',
      'Worked with services including EC2, S3, IAM and VPC',
      'Deployed a static website using Amazon S3 and provisioned EC2 resources',
      'Earned the AWS Certified Cloud Practitioner certification',
    ],
  },
  {
    role: 'EngineeringProject Lead',
    company: 'University Software Engineering Group Project',
    period: '',
    highlights: [
      'Led a year-long university software-engineering project',
      'Supported planning, requirements, task allocation and deadline management',
      'Coordinated progress across team members while also contributing technically',
      'Developed experience balancing technical decisions with team communication',
    ],
  },
  {
    role: 'Marketing Representative',
    company: 'Southampton University Indian Society',
    period: '2025 – Present',
    highlights: [
      'Helped promote society events and improve student engagement',
      'Produced marketing content for different audiences',
      'Worked with committee members and stakeholders to coordinate campaigns',
    ],
  },
];

// --- Education (University postcard / noticeboard) ---------
export type EducationItem = {
  institution: string;
  course: string;
  period: string;
  details: string[];
};

export const education: EducationItem[] = [
  {
    institution: 'University of Southampton',
    course: 'Computer Science',
    period: '2024 – Present',
    details: [
      'Year 1 modules:   Object-Oriented Programming in Java, Python Computing, Git, Linear Algebra, Probability, Calculus, Databases (SQL), Linux, Networks and Security, Data Structures and Algorithms, Computer Systems',
      'Year 2 modules: Artificial Intelligence, Agile Software Engineering Group Project (1 year), Formal Specification and Verification, Programming Language Concepts, Theory of Computing, Computer Systems II, Haskell',
    ],
  },
];

export const aLevels = [
  { subject: 'Mathematics', grade: 'A*' },
  { subject: 'Further Mathematics', grade: 'A' },
  { subject: 'Computer Science', grade: 'A' },
];

// --- Achievements & Certifications (Cup / achievement shelf) -
export type Achievement = {
  title: string;
  icon: string; // lucide icon name
};

export const achievements: Achievement[] = [
  { title: 'AWS Certified Cloud Practitioner', icon: 'Award' },
  { title: 'AWS re/Start graduate', icon: 'GraduationCap' },
  { title: 'CyberFirst Advanced, SQA Level 6', icon: 'ShieldCheck' },
  { title: 'Led a university software-engineering group project', icon: 'Users' },
  { title: 'Marketing Representative for Southampton University Indian Society', icon: 'Megaphone' },
];

// --- Career interests ---------------------------------------
export const careerInterests = [
  'Business analysis',
  'Product and technology strategy',
  'Roles combining technical problem-solving with stakeholder communication',
  'Software engineering',
  'Data and analytics',
  'Artificial intelligence and machine learning',
];

// --- Contact (Ordering terminal) -----------------------------
export const socials = [
  { label: 'GitHub', icon: 'Github', url: 'https://github.com/ayushibose' },
  { label: 'LinkedIn', icon: 'Linkedin', url: 'https://www.linkedin.com/in/ayushibose/' },
  { label: 'Email', icon: 'Mail', url: 'mailto:ayushibose12@gmail.com' },
];

// --- Navigation --------------------------------------------
export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

// 3D scene interactive objects — maps a café object to a section id
export const interactiveObjects = [
  { id: 'about', label: 'Neon Sign', hint: 'About Me' },
  { id: 'projects', label: 'Espresso Machine', hint: 'Projects' },
  { id: 'skills', label: 'Menu Board', hint: 'Skills & Tech' },
  { id: 'experience', label: 'Laptop', hint: 'Experience' },
  { id: 'achievements', label: 'Achievement Shelf', hint: 'Achievements' },
  { id: 'education', label: 'Noticeboard', hint: 'Education' },
  { id: 'cv', label: 'Receipt Printer', hint: 'Download CV' },
  { id: 'contact', label: 'Ordering Terminal', hint: 'Contact Me' },
] as const;

export type SectionId = (typeof interactiveObjects)[number]['id'];
