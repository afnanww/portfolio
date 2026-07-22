import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  description: string;
  skills: string[];
  image: string;
  verifyUrl: string;
  color: string; // Anthropic muted color code
  icon: 'code' | 'design' | 'cloud' | 'ai' | 'algorithm' | 'database' | 'cube';
  x: number; // percentage of viewport width
  y: number; // percentage of viewport height
  depth: number;
}

export interface ProviderHub {
  id: string;
  name: string;
  subtitle: string;
  x: number; // hub center position x%
  y: number; // hub center position y%
  certs: CertificateItem[];
}

const providerHubsData: ProviderHub[] = [
  {
    id: 'hub-anthropic',
    name: 'Anthropic',
    subtitle: 'Claude AI, MCP Protocol & Agentic Engineering',
    x: 50,
    y: 28,
    certs: [
      {
        id: 'cert-ant-1',
        title: 'Claude 101: Foundations & Prompt Architecture',
        issuer: 'Anthropic',
        date: '2024',
        credentialId: 'ANT-C101-8841',
        description: 'Official Anthropic certification covering Claude AI model architecture, prompt engineering techniques, context window management, and ethical AI deployment principles.',
        skills: ['Claude 3.5', 'Prompt Engineering', 'Context Optimization', 'AI Architecture'],
        image: '/images/cert/antropic/C101.webp',
        verifyUrl: 'https://www.anthropic.com',
        color: '#D9826C', // Terracotta
        icon: 'ai',
        x: 34,
        y: 16,
        depth: 1.2,
      },
      {
        id: 'cert-ant-2',
        title: 'Claude Code 101: Developer Fundamentals & Agentic Workflows',
        issuer: 'Anthropic',
        date: '2024',
        credentialId: 'ANT-CC101-9920',
        description: 'Mastery of Anthropic developer SDKs, tool use, function calling, agentic coding patterns, and automated codebase refactoring workflows.',
        skills: ['Claude SDK', 'Tool Use', 'Agentic Workflows', 'Function Calling'],
        image: '/images/cert/antropic/CC101.webp',
        verifyUrl: 'https://www.anthropic.com',
        color: '#9FB8AD', // Sage green
        icon: 'code',
        x: 46,
        y: 14,
        depth: 0.9,
      },
      {
        id: 'cert-ant-3',
        title: 'Model Context Protocol (MCP): Introduction & Core Concepts',
        issuer: 'Anthropic',
        date: '2024',
        credentialId: 'ANT-MCP-101',
        description: 'Foundational certification on Model Context Protocol architecture, connecting LLMs to external data sources, security boundaries, and protocol specifications.',
        skills: ['Model Context Protocol', 'MCP Client/Server', 'System Integration'],
        image: '/images/cert/antropic/MCPintro.webp',
        verifyUrl: 'https://www.anthropic.com',
        color: '#8A87C6', // Lavender
        icon: 'ai',
        x: 62,
        y: 14,
        depth: 1.4,
      },
      {
        id: 'cert-ant-4',
        title: 'Model Context Protocol (MCP): Advanced Developer',
        issuer: 'Anthropic',
        date: '2024',
        credentialId: 'ANT-MCP-201',
        description: 'Advanced engineering certification for building custom MCP servers, handling asynchronous resources, tool execution pipelines, and enterprise security.',
        skills: ['Custom MCP Servers', 'Protocol Spec', 'Tool Pipelines', 'TypeScript/Python'],
        image: '/images/cert/antropic/MCPadv.webp',
        verifyUrl: 'https://www.anthropic.com',
        color: '#E5C2AF', // Peach
        icon: 'ai',
        x: 66,
        y: 32,
        depth: 1.1,
      },
      {
        id: 'cert-ant-5',
        title: 'Claude on Amazon Bedrock Integration',
        issuer: 'Anthropic & AWS',
        date: '2024',
        credentialId: 'ANT-AWS-5501',
        description: 'Deploying and scaling Anthropic Claude models on AWS Amazon Bedrock, serverless inference, IAM security policies, and enterprise RAG pipelines.',
        skills: ['Amazon Bedrock', 'AWS Lambda', 'RAG Architecture', 'Enterprise AI'],
        image: '/images/cert/antropic/ClaudeAmazonBedrock.webp',
        verifyUrl: 'https://aws.amazon.com/bedrock/claude',
        color: '#A2B59F', // Moss green
        icon: 'cloud',
        x: 32,
        y: 34,
        depth: 1.0,
      },
      {
        id: 'cert-ant-6',
        title: 'Claude on Google Cloud Vertex AI Integration',
        issuer: 'Anthropic & Google Cloud',
        date: '2024',
        credentialId: 'ANT-GCP-7712',
        description: 'Integrating Claude 3 models via Google Cloud Vertex AI endpoints, fine-tuning configurations, BigQuery vector search, and cloud deployment.',
        skills: ['Google Vertex AI', 'BigQuery Vector Search', 'GCP Cloud', 'Endpoint Deployment'],
        image: '/images/cert/antropic/ClaudeGoogleVertexAI.webp',
        verifyUrl: 'https://cloud.google.com/vertex-ai',
        color: '#D9826C', // Terracotta
        icon: 'cloud',
        x: 50,
        y: 40,
        depth: 1.3,
      },
    ],
  },
  {
    id: 'hub-meta',
    name: 'Meta',
    subtitle: 'Front-End Architecture & React',
    x: 18,
    y: 65,
    certs: [
      {
        id: 'cert-meta-1',
        title: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta',
        date: '2024',
        credentialId: 'META-FE-984210',
        description: 'Advanced mastery in modern React, state management, web performance optimization, accessibility standards, and responsive UI design systems.',
        skills: ['React.js', 'JavaScript ES6+', 'UI/UX', 'Performance', 'CSS3'],
        image: '/images/cert_meta.jpg',
        verifyUrl: 'https://www.coursera.org/account/accomplishments/professional-cert/meta',
        color: '#D9826C', // Terracotta
        icon: 'code',
        x: 10,
        y: 54,
        depth: 1.2,
      },
      {
        id: 'cert-meta-2',
        title: 'Meta Advanced React & State Architecture',
        issuer: 'Meta',
        date: '2024',
        credentialId: 'META-REACT-7712',
        description: 'Deep dive into React internals, custom hooks, context optimization, SSR paradigms, and complex state management.',
        skills: ['React', 'Redux Toolkit', 'Hooks', 'SSR', 'TypeScript'],
        image: '/images/cert_meta.jpg',
        verifyUrl: 'https://www.coursera.org/verify/meta-react',
        color: '#9FB8AD', // Sage green
        icon: 'code',
        x: 26,
        y: 78,
        depth: 0.9,
      },
    ],
  },
  {
    id: 'hub-hackerrank',
    name: 'HackerRank',
    subtitle: 'Algorithms & Problem Solving',
    x: 42,
    y: 76,
    certs: [
      {
        id: 'cert-hr-1',
        title: 'HackerRank Software Engineer & Problem Solving (Gold)',
        issuer: 'HackerRank',
        date: '2024',
        credentialId: 'HR-GOLD-77491',
        description: 'Verified top percentile problem solving expertise, complex algorithms execution, data structure optimization, and clean code practices.',
        skills: ['Algorithms', 'Data Structures', 'Problem Solving', 'TypeScript'],
        image: '/images/cert_hackerrank.jpg',
        verifyUrl: 'https://www.hackerrank.com/certificates',
        color: '#E5C2AF', // Peach
        icon: 'algorithm',
        x: 34,
        y: 86,
        depth: 1.1,
      },
      {
        id: 'cert-hr-2',
        title: 'HackerRank JavaScript & Node.js Advanced',
        issuer: 'HackerRank',
        date: '2024',
        credentialId: 'HR-JS-88210',
        description: 'Asynchronous event loops, memory management, closures, microtask queues, and high-performance server APIs.',
        skills: ['JavaScript ES6+', 'Node.js', 'Asynchronous JS', 'Event Loop'],
        image: '/images/cert_hackerrank.jpg',
        verifyUrl: 'https://www.hackerrank.com/certificates/js',
        color: '#A2B59F', // Moss green
        icon: 'code',
        x: 50,
        y: 88,
        depth: 1.3,
      },
    ],
  },
  {
    id: 'hub-aws',
    name: 'AWS & WebGL',
    subtitle: 'Cloud Infrastructure & 3D Shaders',
    x: 82,
    y: 65,
    certs: [
      {
        id: 'cert-aws-1',
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2023',
        credentialId: 'AWS-CCP-44021',
        description: 'Comprehensive understanding of AWS Cloud architecture, serverless computing, deployment pipelines, IAM security, and edge caching networks.',
        skills: ['AWS S3/CloudFront', 'Lambda', 'DevOps', 'Security', 'Cloud Architecture'],
        image: '/images/cert_aws.jpg',
        verifyUrl: 'https://aws.amazon.com/verification',
        color: '#8A87C6', // Lavender
        icon: 'cloud',
        x: 90,
        y: 54,
        depth: 1.5,
      },
      {
        id: 'cert-aws-3',
        title: 'Three.js & WebGL Graphics Mastery',
        issuer: 'Three.js Journey',
        date: '2024',
        credentialId: 'THREEJS-3D-9941',
        description: 'Advanced 3D scene creation, custom GLSL shaders, camera controls, post-processing effects, and performance optimization for web browsers.',
        skills: ['Three.js', 'GLSL Shaders', 'WebGL', 'Canvas API', '3D Math'],
        image: '/images/cert_threejs.jpg',
        verifyUrl: 'https://threejs-journey.com/certificate',
        color: '#E5C2AF', // Peach
        icon: 'cube',
        x: 74,
        y: 78,
        depth: 1.3,
      },
    ],
  },
];

// Helper icon component matching Anthropic's minimal vector style
export function CertNodeIcon({ type }: { type: CertificateItem['icon'] }) {
  switch (type) {
    case 'code':
      return (
        <svg className="w-5 h-5 stroke-stone-900 fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      );
    case 'design':
      return (
        <svg className="w-5 h-5 stroke-stone-900 fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.006-.61l3.075-3.075m-1.378-1.378l3.075-3.075m2.25 2.25l3.075-3.075M12.75 12l.75.75" />
        </svg>
      );
    case 'cloud':
      return (
        <svg className="w-5 h-5 stroke-stone-900 fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      );
    case 'ai':
      return (
        <svg className="w-5 h-5 stroke-stone-900 fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      );
    case 'algorithm':
      return (
        <svg className="w-5 h-5 stroke-stone-900 fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      );
    case 'cube':
      return (
        <svg className="w-5 h-5 stroke-stone-900 fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 stroke-stone-900 fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
      );
  }
}

export default function Certificates() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Map<string, HTMLElement>>(new Map());
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Modal open / close animations
  useEffect(() => {
    if (selectedCert && modalRef.current && modalContentRef.current) {
      document.body.style.overflow = 'hidden';

      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
      );

      gsap.fromTo(
        modalContentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedCert]);

  const closeModal = () => {
    if (modalRef.current && modalContentRef.current) {
      gsap.to(modalContentRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setSelectedCert(null),
      });
    } else {
      setSelectedCert(null);
    }
  };

  return (
    <section
      id="certificates"
      ref={containerRef}
      className="relative min-h-screen bg-transparent text-[#111111] overflow-hidden flex flex-col justify-between py-16 px-6 md:px-12 select-none"
    >

      {/* SVG Spoke Lines Extending from Provider Center Headings to Certificate Tiles (Exact Anthropic Reference) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {providerHubsData.map((hub) =>
          hub.certs.map((cert) => {
            const isHighlighted =
              hoveredCert === cert.id || hoveredHub === hub.id;

            return (
              <line
                key={`${hub.id}-${cert.id}`}
                x1={`${hub.x}%`}
                y1={`${hub.y}%`}
                x2={`${cert.x}%`}
                y2={`${cert.y}%`}
                stroke={isHighlighted ? '#111111' : 'rgba(17, 17, 17, 0.18)'}
                strokeWidth={isHighlighted ? 1.6 : 1}
                strokeDasharray={isHighlighted ? 'none' : '3 3'}
                className="transition-all duration-300"
              />
            );
          })
        )}
      </svg>

      {/* Center Main Header Text (Anthropic Hero Style) */}
      <div className="relative z-10 text-center my-auto max-w-2xl mx-auto pointer-events-none">

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight text-[#111111] font-normal leading-[1.1]">
          Certifications & Credentials
        </h2>

      </div>

      {/* Provider Hub Headings & Radiating Certificate Square Tiles (Anthropic Exact Reference) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {providerHubsData.map((hub) => (
          <div key={hub.id}>
            {/* Center Provider Text Hub */}
            <div
              style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 text-center group cursor-default"
              onMouseEnter={() => setHoveredHub(hub.id)}
              onMouseLeave={() => setHoveredHub(null)}
            >
              <h3 className="font-serif text-2xl md:text-3xl font-normal tracking-wide text-stone-900 leading-tight">
                {hub.name}
              </h3>
              <p className="font-sans text-xs text-stone-500 mt-1 max-w-[220px] mx-auto leading-snug">
                {hub.subtitle}
              </p>
            </div>

            {/* Radiating Square Tile Certificate Nodes */}
            {hub.certs.map((cert) => {
              const isHovered = hoveredCert === cert.id;

              return (
                <button
                  key={cert.id}
                  ref={(el) => {
                    if (el) nodesRef.current.set(cert.id, el);
                  }}
                  style={{ left: `${cert.x}%`, top: `${cert.y}%` }}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                  onClick={() => setSelectedCert(cert)}
                  onMouseEnter={() => setHoveredCert(cert.id)}
                  onMouseLeave={() => setHoveredCert(null)}
                  data-circle-cursor="VIEW"
                  aria-label={cert.title}
                >
                  {/* Cert Tile — sharp rectangular tile without corner smoothing */}
                  <div
                    className={`relative w-[84px] h-[58px] md:w-[96px] md:h-[66px] rounded-none overflow-hidden border-0 ring-0 outline-none shadow-md transition-all duration-300 ${isHovered
                        ? 'scale-140 shadow-2xl z-30'
                        : 'hover:scale-110 opacity-95 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-fill block border-0 ring-0 outline-none rounded-none scale-105"
                      draggable={false}
                    />
                  </div>

                  {/* Hover Tooltip Title */}
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-stone-900 text-white text-[10px] font-jura px-2.5 py-1 rounded shadow-lg z-40">
                    {cert.title}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 text-center pt-8 pointer-events-none">
        <span className="font-jura text-xs tracking-widest text-stone-600 font-bold uppercase">
          Click any icon tile to inspect certificate & credential details
        </span>
      </div>

      {/* Compact Floating Detail Popup Modal */}
      {selectedCert && (
        <div
          ref={modalRef}
          onClick={(e) => {
            if (e.target === modalRef.current) closeModal();
          }}
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto"
        >
          <div
            ref={modalContentRef}
            className="relative bg-[#F5F0EB] text-[#191919] w-full max-w-4xl rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-black/15 flex flex-col justify-between"
          >
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-jura text-xs font-bold uppercase tracking-widest px-3 py-1 rounded bg-black/5 text-black/70">
                  {selectedCert.issuer} Verified
                </span>
                <span className="font-mono text-xs text-black/50">
                  ID: {selectedCert.credentialId}
                </span>
              </div>

              <button
                onClick={closeModal}
                className="group flex items-center gap-2 font-jura text-xs tracking-widest uppercase font-bold text-black/70 hover:text-black transition-colors px-3.5 py-1.5 rounded-full border border-black/15 hover:border-black/40 bg-white shadow-sm cursor-pointer"
              >
                Close <span className="text-sm leading-none group-hover:rotate-90 transition-transform">✕</span>
              </button>
            </div>

            {/* Modal Main Content Grid */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Title & Description Information */}
              <div className="md:col-span-6 space-y-5">
                <span className="font-jura text-xs uppercase tracking-[0.3em] text-black/50 block">
                  Issued {selectedCert.date} • {selectedCert.issuer}
                </span>

                <h2 className="font-serif text-2xl md:text-4xl font-normal text-[#111111] leading-tight">
                  {selectedCert.title}
                </h2>

                <p className="font-sans text-sm md:text-base text-black/70 leading-relaxed">
                  {selectedCert.description}
                </p>

                {/* Verified Skills Tags */}
                <div>
                  <span className="font-jura text-xs uppercase tracking-widest text-black/40 block mb-2.5 font-semibold">
                    Competencies & Skills Verified
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white border border-black/10 text-xs font-medium text-black/80 shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA External Link */}
                <div className="pt-2">
                  <a
                    href={selectedCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#191919] text-white font-jura text-xs tracking-widest uppercase font-semibold rounded-full hover:bg-black transition-all hover:gap-4 shadow-md"
                  >
                    Verify Official Credential <span className="text-sm">→</span>
                  </a>
                </div>
              </div>

              {/* Right Column: High-Res Official WebP Certificate Image Preview (Borderless) */}
              <div className="md:col-span-6 flex justify-center">
                <div className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-center overflow-hidden border-0 ring-0 outline-none">
                  <img
                    src={selectedCert.image}
                    alt={selectedCert.title}
                    className="w-full h-full object-contain block border-0 ring-0 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
