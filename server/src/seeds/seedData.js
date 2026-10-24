require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Course = require('../models/Course');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Career = require('../models/Career');
const DocumentMetadata = require('../models/DocumentMetadata');
const aiClient = require('../services/aiServiceClient');
const path = require('path');
const fs = require('fs');

const coursesData = [
  {
    title: 'Deep Learning & Neural Networks',
    code: 'CSE401',
    description: 'Covers backpropagation, convolutional networks, transformers, attention mechanisms, and deep generative architectures.',
    domain: 'Artificial Intelligence & Machine Learning',
    difficulty: 'Advanced',
    credits: 4,
    minCgpa: 7.0,
    prerequisites: ['Linear Algebra', 'Introduction to Machine Learning'],
    skillsCovered: ['Python', 'PyTorch', 'TensorFlow', 'Deep Learning', 'Computer Vision'],
    targetRoles: ['Machine Learning Engineer', 'AI Research Scientist', 'Data Scientist'],
    tags: ['ai', 'deep-learning', 'neural-networks', 'computer-vision', 'nlp'],
    syllabusOutline: ['Foundations of Deep Nets', 'CNN Architectures', 'Recurrent & Attention Models', 'Generative Adversarial Networks']
  },
  {
    title: 'Cloud Architecture & Distributed Microservices',
    code: 'CSE408',
    description: 'Designing resilient distributed systems with microservices, containerization, Kubernetes orchestration, and cloud patterns.',
    domain: 'Cloud Computing & Systems Engineering',
    difficulty: 'Advanced',
    credits: 4,
    minCgpa: 6.5,
    prerequisites: ['Operating Systems', 'Computer Networks'],
    skillsCovered: ['Docker', 'Kubernetes', 'AWS', 'Microservices', 'System Design'],
    targetRoles: ['Cloud Solutions Architect', 'DevOps Engineer', 'Backend Engineer'],
    tags: ['cloud', 'aws', 'docker', 'kubernetes', 'microservices'],
    syllabusOutline: ['Cloud Service Models', 'Containerization with Docker', 'Kubernetes Orchestration', 'Distributed Caching & Observability']
  },
  {
    title: 'Full-Stack Modern Web Engineering',
    code: 'CSE320',
    description: 'Comprehensive study of modern client-server web applications, reactive component frameworks, REST/GraphQL APIs, and state management.',
    domain: 'Web Technologies & Software Systems',
    difficulty: 'Intermediate',
    credits: 3,
    minCgpa: 6.0,
    prerequisites: ['Data Structures & Algorithms', 'Object-Oriented Programming'],
    skillsCovered: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
    targetRoles: ['Full Stack Developer', 'Frontend Engineer', 'Software Engineer'],
    tags: ['react', 'node', 'full-stack', 'web-dev', 'mongodb'],
    syllabusOutline: ['React Virtual DOM & Hooks', 'Asynchronous Node.js & Express', 'MongoDB Aggregations', 'Production CI/CD Deployment']
  },
  {
    title: 'Applied Cryptography & Enterprise Security',
    code: 'CSE415',
    description: 'Mathematical foundations of modern cryptography, public-key infrastructure, secure protocol design, and penetration testing.',
    domain: 'Cybersecurity & Software Security',
    difficulty: 'Advanced',
    credits: 3,
    minCgpa: 6.8,
    prerequisites: ['Discrete Mathematics', 'Computer Networks'],
    skillsCovered: ['Cryptography', 'Network Security', 'Penetration Testing', 'OWASP', 'Linux'],
    targetRoles: ['Cybersecurity Analyst', 'Security Engineer', 'Information Security Officer'],
    tags: ['security', 'cryptography', 'cybersecurity', 'penetration-testing'],
    syllabusOutline: ['Symmetric & Asymmetric Ciphers', 'Cryptographic Hash Functions', 'TLS/SSL Handshakes', 'Web Application Vulnerabilities']
  },
  {
    title: 'Large-Scale Big Data & Analytics',
    code: 'CSE422',
    description: 'Distributed big data processing using Apache Spark, Kafka event streaming, and analytical data warehousing architectures.',
    domain: 'Data Science & Big Data Engineering',
    difficulty: 'Intermediate',
    credits: 3,
    minCgpa: 6.5,
    prerequisites: ['Database Management Systems', 'Python Programming'],
    skillsCovered: ['Python', 'Apache Spark', 'Kafka', 'SQL', 'Data Warehousing'],
    targetRoles: ['Data Engineer', 'Data Analyst', 'Business Intelligence Developer'],
    tags: ['big-data', 'spark', 'kafka', 'data-engineering', 'sql'],
    syllabusOutline: ['MapReduce Paradigms', 'Spark RDD & DataFrames', 'Real-Time Streaming Pipelines', 'Cloud Data Lakes']
  },
  {
    title: 'Natural Language Processing & Generative AI',
    code: 'CSE430',
    description: 'Text representation, tokenization, semantic search, large language models, retrieval-augmented generation (RAG), and vector databases.',
    domain: 'Artificial Intelligence & Machine Learning',
    difficulty: 'Advanced',
    credits: 4,
    minCgpa: 7.2,
    prerequisites: ['Python Programming', 'Probability & Statistics'],
    skillsCovered: ['Python', 'NLP', 'LangChain', 'ChromaDB', 'LLMs', 'Transformers'],
    targetRoles: ['AI Engineer', 'Machine Learning Engineer', 'NLP Specialist'],
    tags: ['nlp', 'generative-ai', 'rag', 'llm', 'langchain'],
    syllabusOutline: ['Vector Embeddings & Semantic Search', 'Transformer Decoders & Attention', 'Prompt Engineering & Fine-tuning', 'Building RAG Systems']
  }
];

const skillsData = [
  {
    name: 'PyTorch',
    domain: 'Artificial Intelligence & Machine Learning',
    category: 'Framework',
    difficulty: 'Intermediate',
    prerequisites: ['Python', 'Linear Algebra', 'NumPy'],
    targetRoles: ['Machine Learning Engineer', 'AI Research Scientist', 'Data Scientist'],
    importance: 'Critical',
    tags: ['python', 'deep-learning', 'tensors', 'gpu-acceleration'],
    learningResources: [
      { title: 'Official PyTorch Tutorials', url: 'https://pytorch.org/tutorials/', type: 'Documentation' },
      { title: 'Deep Learning with PyTorch', url: 'https://www.deeplearning.ai/', type: 'Course' }
    ]
  },
  {
    name: 'Docker & Kubernetes',
    domain: 'Cloud Computing & Systems Engineering',
    category: 'Cloud & DevOps',
    difficulty: 'Intermediate',
    prerequisites: ['Linux', 'Networking Basics'],
    targetRoles: ['Cloud Solutions Architect', 'DevOps Engineer', 'Full Stack Developer'],
    importance: 'Critical',
    tags: ['containers', 'orchestration', 'cloud', 'devops'],
    learningResources: [
      { title: 'Docker Getting Started Guide', url: 'https://docs.docker.com/get-started/', type: 'Documentation' },
      { title: 'Kubernetes The Hard Way', url: 'https://kubernetes.io/docs/', type: 'Tutorial' }
    ]
  },
  {
    name: 'React.js',
    domain: 'Web Technologies & Software Systems',
    category: 'Framework',
    difficulty: 'Intermediate',
    prerequisites: ['JavaScript', 'HTML5', 'CSS3'],
    targetRoles: ['Frontend Engineer', 'Full Stack Developer'],
    importance: 'Critical',
    tags: ['javascript', 'frontend', 'ui', 'components'],
    learningResources: [
      { title: 'Official React Documentation', url: 'https://react.dev/', type: 'Documentation' },
      { title: 'Full Stack Open', url: 'https://fullstackopen.com/', type: 'Course' }
    ]
  },
  {
    name: 'System Design & Scalability',
    domain: 'Software Architecture',
    category: 'Core CS',
    difficulty: 'Advanced',
    prerequisites: ['Operating Systems', 'Database Management Systems'],
    targetRoles: ['Senior Software Engineer', 'Cloud Solutions Architect', 'Backend Engineer'],
    importance: 'Critical',
    tags: ['scalability', 'distributed-systems', 'caching', 'load-balancing'],
    learningResources: [
      { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'Tutorial' }
    ]
  },
  {
    name: 'Vector Databases & RAG',
    domain: 'Artificial Intelligence & Machine Learning',
    category: 'Database',
    difficulty: 'Intermediate',
    prerequisites: ['Python', 'Embeddings Basics'],
    targetRoles: ['AI Engineer', 'Machine Learning Engineer', 'Data Scientist'],
    importance: 'High',
    tags: ['chromadb', 'embeddings', 'rag', 'vector-search'],
    learningResources: [
      { title: 'ChromaDB Documentation', url: 'https://docs.trychroma.com/', type: 'Documentation' },
      { title: 'LangChain Conceptual Guide', url: 'https://python.langchain.com/', type: 'Tutorial' }
    ]
  },
  {
    name: 'Node.js & Express',
    domain: 'Web Technologies & Software Systems',
    category: 'Framework',
    difficulty: 'Intermediate',
    prerequisites: ['JavaScript', 'HTTP Protocol'],
    targetRoles: ['Backend Engineer', 'Full Stack Developer'],
    importance: 'Critical',
    tags: ['javascript', 'backend', 'api', 'express'],
    learningResources: [
      { title: 'Node.js Guides', url: 'https://nodejs.org/en/docs/guides/', type: 'Documentation' }
    ]
  }
];

const projectsData = [
  {
    title: 'AI-Powered Personalized Academic and Career Guidance Platform',
    problemStatement: 'Students struggle with selecting aligned electives, discovering skill gaps, and obtaining institution-grounded guidance.',
    description: 'A full-stack advisory system leveraging content-based filtering algorithms and RAG conversational search over university regulations.',
    domain: 'Artificial Intelligence & EdTech',
    difficulty: 'Hard',
    techStack: ['React', 'Node.js', 'FastAPI', 'ChromaDB', 'Gemini API', 'Tailwind CSS'],
    requiredSkills: ['Python', 'React', 'FastAPI', 'ChromaDB', 'LangChain', 'Node.js'],
    expectedOutcomes: [
      'Personalized course & capstone recommendation engine with explainable multi-factor scoring',
      'Automated skill-gap radar comparison with target industry roles',
      'RAG institutional assistant delivering verifiable citations from uploaded curriculum PDFs'
    ],
    targetRoles: ['Full Stack Developer', 'AI Engineer', 'Machine Learning Engineer'],
    tags: ['ai', 'rag', 'recommendations', 'fullstack', 'langchain']
  },
  {
    title: 'Cloud-Native Distributed Microservices E-Commerce Fabric',
    problemStatement: 'Monolithic transactional systems suffer bottlenecks during sudden high-throughput flash sale events.',
    description: 'An event-driven microservices architecture utilizing Kafka for asynchronous order decoupling, Redis for caching, and Kubernetes deployment.',
    domain: 'Cloud Computing & Systems Engineering',
    difficulty: 'Hard',
    techStack: ['Node.js', 'Go', 'Docker', 'Kubernetes', 'Apache Kafka', 'Redis', 'PostgreSQL'],
    requiredSkills: ['Docker & Kubernetes', 'System Design & Scalability', 'Node.js & Express', 'Kafka'],
    expectedOutcomes: [
      'Sub-50ms latency under 10,000 simulated concurrent checkout requests',
      'Fault tolerance with circuit breakers and dead-letter queue recovery',
      'Automated horizontal pod autoscaling under dynamic load'
    ],
    targetRoles: ['Cloud Solutions Architect', 'Backend Engineer', 'DevOps Engineer'],
    tags: ['cloud', 'microservices', 'kubernetes', 'kafka', 'distributed-systems']
  },
  {
    title: 'Automated Vulnerability Detection & Penetration Testing Pipeline',
    problemStatement: 'Continuous security auditing of enterprise codebases is bottlenecked by manual review workflows.',
    description: 'A DevSecOps security auditing engine combining static AST code analysis, dynamic fuzzing, and OWASP Top 10 automated reporting.',
    domain: 'Cybersecurity & Software Security',
    difficulty: 'Hard',
    techStack: ['Python', 'Docker', 'OWASP ZAP', 'PostgreSQL', 'React'],
    requiredSkills: ['Cryptography', 'Network Security', 'Python', 'Linux', 'OWASP'],
    expectedOutcomes: [
      'Automated scan reports classifying CVSS severity vulnerabilities',
      'Zero-touch GitHub Action integration blocking insecure pull requests',
      'Interactive executive compliance dashboard'
    ],
    targetRoles: ['Cybersecurity Analyst', 'Security Engineer'],
    tags: ['cybersecurity', 'devsecops', 'owasp', 'penetration-testing']
  },
  {
    title: 'Real-Time Financial Fraud Detection using Graph Neural Networks',
    problemStatement: 'Traditional rule-based fraud detection systems miss sophisticated multi-hop money laundering networks.',
    description: 'Graph-based neural network model processing transaction graph topologies to identify fraudulent circular flow patterns in real time.',
    domain: 'Artificial Intelligence & Machine Learning',
    difficulty: 'Hard',
    techStack: ['Python', 'PyTorch Geometric', 'NetworkX', 'FastAPI', 'Neo4j'],
    requiredSkills: ['Python', 'PyTorch', 'Data Science', 'Machine Learning'],
    expectedOutcomes: [
      '94.5% precision in identifying synthetic identity fraud Rings',
      'Sub-100ms inference API for real-time payment gateway intercepts',
      'Visual node graph explanation showing transaction suspicion paths'
    ],
    targetRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Research Scientist'],
    tags: ['deep-learning', 'graph-neural-networks', 'fraud-detection', 'pytorch']
  }
];

const careersData = [
  {
    title: 'Full Stack Developer',
    description: 'Builds responsive front-end user interfaces and scalable back-end services, managing database layers, APIs, and cloud deployments.',
    domain: 'Web Technologies & Software Systems',
    requiredSkills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js & Express', 'MongoDB', 'Docker & Kubernetes', 'REST APIs', 'Git'],
    averageSalary: '₹8 - 20 LPA',
    growthRate: '24% YoY',
    roadmap: [
      { step: 1, title: 'Foundational Web & Programming', description: 'Deep dive into JavaScript ES6+, HTML5 semantic layouts, CSS Grid/Flexbox, and asynchronous programming.', duration: 'Weeks 1 - 4' },
      { step: 2, title: 'Modern Frontend & State', description: 'Master React, hooks, component architecture, state management, and modern styling libraries.', duration: 'Weeks 5 - 8' },
      { step: 3, title: 'Robust Backend APIs & Databases', description: 'Build secure RESTful endpoints in Node.js/Express, integrate MongoDB schemas, and implement JWT authentication.', duration: 'Weeks 9 - 12' },
      { step: 4, title: 'DevOps & Production Deployment', description: 'Containerize with Docker, configure CI/CD pipelines, and deploy on modern cloud infrastructure.', duration: 'Weeks 13 - 16' }
    ],
    recommendedCourses: ['Full-Stack Modern Web Engineering', 'Cloud Architecture & Distributed Microservices'],
    recommendedProjects: ['AI-Powered Personalized Academic and Career Guidance Platform', 'Cloud-Native Distributed Microservices E-Commerce Fabric'],
    tags: ['web', 'fullstack', 'frontend', 'backend', 'react', 'node']
  },
  {
    title: 'Machine Learning Engineer',
    description: 'Designs, develops, and deploys scalable machine learning algorithms and neural network architectures into production systems.',
    domain: 'Artificial Intelligence & Machine Learning',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Linear Algebra', 'Vector Databases & RAG', 'Docker & Kubernetes', 'SQL'],
    averageSalary: '₹12 - 28 LPA',
    growthRate: '32% YoY',
    roadmap: [
      { step: 1, title: 'Mathematics & Data Foundations', description: 'Master linear algebra, multivariate calculus, probability distributions, NumPy, and Pandas.', duration: 'Weeks 1 - 4' },
      { step: 2, title: 'Classical ML & Feature Engineering', description: 'Implement decision trees, ensemble methods, SVMs, and regression pipelines with Scikit-Learn.', duration: 'Weeks 5 - 8' },
      { step: 3, title: 'Deep Learning & Transformers', description: 'Build CNNs, transformers, attention models, and RAG architectures using PyTorch and HuggingFace.', duration: 'Weeks 9 - 14' },
      { step: 4, title: 'MLOps & Model Serving', description: 'Deploy models via FastAPI, track experiments with MLflow, and orchestrate inference with Docker.', duration: 'Weeks 15 - 18' }
    ],
    recommendedCourses: ['Deep Learning & Neural Networks', 'Natural Language Processing & Generative AI'],
    recommendedProjects: ['Real-Time Financial Fraud Detection using Graph Neural Networks', 'AI-Powered Personalized Academic and Career Guidance Platform'],
    tags: ['ai', 'ml', 'machine-learning', 'deep-learning', 'pytorch']
  },
  {
    title: 'Cloud Solutions Architect',
    description: 'Architects fault-tolerant, resilient, and cost-optimized enterprise cloud infrastructures across hybrid and multi-cloud environments.',
    domain: 'Cloud Computing & Systems Engineering',
    requiredSkills: ['AWS', 'Docker & Kubernetes', 'System Design & Scalability', 'Linux', 'Terraform', 'Microservices', 'Networking Basics'],
    averageSalary: '₹15 - 32 LPA',
    growthRate: '27% YoY',
    roadmap: [
      { step: 1, title: 'Operating Systems & Linux Mastery', description: 'Master Linux kernel basics, bash scripting, file permissions, and TCP/IP networking protocols.', duration: 'Weeks 1 - 4' },
      { step: 2, title: 'Containerization & Orchestration', description: 'Build container images with Docker, orchestrate multi-node clusters with Kubernetes Helm charts.', duration: 'Weeks 5 - 9' },
      { step: 3, title: 'Cloud Infrastructure & IaC', description: 'Provision scalable VPCs, IAM roles, load balancers, and RDS databases using Terraform on AWS/GCP.', duration: 'Weeks 10 - 14' },
      { step: 4, title: 'Enterprise Resilience & Disaster Recovery', description: 'Design multi-region failover, cost-optimization strategies, and automated telemetry dashboards.', duration: 'Weeks 15 - 18' }
    ],
    recommendedCourses: ['Cloud Architecture & Distributed Microservices'],
    recommendedProjects: ['Cloud-Native Distributed Microservices E-Commerce Fabric'],
    tags: ['cloud', 'aws', 'kubernetes', 'devops', 'architecture']
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Safeguards institutional and corporate digital assets through vulnerability management, threat intelligence, and security operations.',
    domain: 'Cybersecurity & Software Security',
    requiredSkills: ['Network Security', 'Cryptography', 'Linux', 'Penetration Testing', 'OWASP', 'Python', 'Wireshark', 'SIEM'],
    averageSalary: '₹9 - 22 LPA',
    growthRate: '25% YoY',
    roadmap: [
      { step: 1, title: 'Network Protocols & Packet Analysis', description: 'In-depth analysis of OSI model layers, packet sniffing with Wireshark, and firewall configurations.', duration: 'Weeks 1 - 4' },
      { step: 2, title: 'Threat Intelligence & Defensive Ops', description: 'Configure SIEM tools, analyze access logs, and handle incident response playbooks.', duration: 'Weeks 5 - 8' },
      { step: 3, title: 'Ethical Hacking & Vulnerability Assessment', description: 'Conduct penetration testing, audit OWASP Top 10 flaws, and use Metasploit and Burp Suite.', duration: 'Weeks 9 - 13' },
      { step: 4, title: 'Governance & Cryptographic Implementations', description: 'Implement PKI, cryptographic token standards, and ensure ISO 27001 compliance standards.', duration: 'Weeks 14 - 17' }
    ],
    recommendedCourses: ['Applied Cryptography & Enterprise Security'],
    recommendedProjects: ['Automated Vulnerability Detection & Penetration Testing Pipeline'],
    tags: ['security', 'cybersecurity', 'cryptography', 'penetration-testing']
  }
];

const seedAll = async () => {
  try {
    console.log('--- Starting Seed Process ---');
    await connectDB();

    // 1. Clear existing catalogs
    await Course.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Career.deleteMany({});
    console.log('Cleared existing catalog records.');

    // 2. Insert Catalogs
    const insertedCourses = await Course.insertMany(coursesData);
    const insertedSkills = await Skill.insertMany(skillsData);
    const insertedProjects = await Project.insertMany(projectsData);
    const insertedCareers = await Career.insertMany(careersData);
    console.log(`Seeded: ${insertedCourses.length} Courses, ${insertedSkills.length} Skills, ${insertedProjects.length} Projects, ${insertedCareers.length} Careers.`);

    // 3. Create or Reset First Administrator
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@institution.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

    await User.deleteMany({ email: adminEmail });
    const adminUser = await User.create({
      name: 'System Academic Administrator',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Created First Administrator: ${adminEmail}`);

    // 4. Create or Reset Demonstration Student
    const studentEmail = 'student@institution.edu';
    const studentPassword = 'Student@12345';

    await User.deleteMany({ email: studentEmail });
    await StudentProfile.deleteMany({ email: studentEmail });

    const studentUser = await User.create({
      name: 'Arjun Sharma',
      email: studentEmail,
      password: studentPassword,
      role: 'student',
    });

    const studentProfile = await StudentProfile.create({
      userId: studentUser._id,
      fullName: 'Arjun Sharma',
      email: studentEmail,
      college: 'Department of Computer Science & Engineering',
      semester: 6,
      cgpa: 8.4,
      skills: ['Python', 'React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'SQL'],
      programmingLanguages: ['Python', 'JavaScript', 'C++'],
      interests: ['Artificial Intelligence & Machine Learning', 'Web Technologies & Software Systems'],
      preferredRoles: ['Full Stack Developer', 'Machine Learning Engineer'],
      targetRole: 'Full Stack Developer',
      careerGoals: 'To design scalable intelligent web applications integrating generative AI microservices.',
      learningPreferences: 'project-based',
      isCompleted: true,
    });
    console.log(`Created Demonstration Student: ${studentEmail} (Semester 6, CGPA 8.4)`);

    // 5. Ingest Sample Institutional Academic Document into Python RAG Vector Store
    const sampleDocPath = path.join(__dirname, '../../../docs/Academic_Regulations_2026.txt');
    if (fs.existsSync(sampleDocPath)) {
      try {
        console.log('Ingesting sample institutional document to Python ChromaDB RAG store...');
        const docId = 'doc_institutional_curriculum_2026';
        const ingestRes = await aiClient.ingestDocumentToRAG(
          docId,
          sampleDocPath,
          'Academic_Regulations_2026.txt'
        );

        await DocumentMetadata.deleteMany({ docId });
        await DocumentMetadata.create({
          docId,
          filename: 'Academic_Regulations_2026.txt',
          originalName: 'Academic_Regulations_2026.txt',
          fileSize: fs.statSync(sampleDocPath).size,
          mimeType: 'text/plain',
          chunkCount: ingestRes.chunk_count || 5,
          status: 'indexed',
          uploadedBy: adminUser._id,
          uploadedAt: new Date(),
        });
        console.log(`Successfully ingested and indexed institutional regulations (${ingestRes.chunk_count} chunks).`);
      } catch (ragErr) {
        console.log('Notice: Python AI service is not running yet during seed script, will index upon AI service launch.');
      }
    }

    console.log('--- Database Seeding Complete ---');
    console.log('Credentials Summary:');
    console.log(`Admin Account:   ${adminEmail}  | Password: ${adminPassword}`);
    console.log(`Student Account: ${studentEmail} | Password: ${studentPassword}`);

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('Fatal error during seed execution:', err);
    process.exit(1);
  }
};

seedAll();
