import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'tech',
    slug: 'tecnologia',
    name: {
      pt: 'Tecnologia & IA',
      en: 'Tech & AI',
      es: 'Tecnología e IA'
    },
    color: '#0284c7', // Sky / Cyan blue from VH logo
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    badgeText: 'text-sky-600 dark:text-sky-400',
    description: {
      pt: 'Inovações digitais, inteligência artificial, computação de ponta e futuro dos softwares.',
      en: 'Digital innovations, artificial intelligence, quantum computing, and software future.',
      es: 'Innovaciones digitales, inteligencia artificial, computación cuántica y el futuro del software.'
    },
    icon: 'Cpu'
  },
  {
    id: 'space',
    slug: 'ciencia-espaco',
    name: {
      pt: 'Ciência & Espaço',
      en: 'Science & Cosmos',
      es: 'Ciencia y Espacio'
    },
    color: '#3b82f6', // Deep blue from Earth globe
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    badgeText: 'text-blue-600 dark:text-blue-400',
    description: {
      pt: 'Exploração espacial, astrofísica, descobertas astronômicas e mistérios do universo.',
      en: 'Space exploration, astrophysics, astronomical discoveries, and universe mysteries.',
      es: 'Exploración espacial, astrofísica, descubrimientos astronómicos y misterios del universo.'
    },
    icon: 'Rocket'
  },
  {
    id: 'planet',
    slug: 'planeta-sustentabilidade',
    name: {
      pt: 'Planeta & Futuro',
      en: 'Planet & Future',
      es: 'Planeta y Futuro'
    },
    color: '#10b981', // Globe green
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    description: {
      pt: 'Sustentabilidade, cidades inteligentes, energias renováveis e conservação ambiental.',
      en: 'Sustainability, smart biophilic cities, renewable energy, and nature preservation.',
      es: 'Sostenibilidad, ciudades inteligentes, energías renovables y conservación ambiental.'
    },
    icon: 'Globe'
  },
  {
    id: 'culture',
    slug: 'cultura-games',
    name: {
      pt: 'Games & Pop',
      en: 'Gaming & Pop Culture',
      es: 'Videojuegos y Pop'
    },
    color: '#f97316', // Orange from VH logo
    badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    badgeText: 'text-orange-600 dark:text-orange-400',
    description: {
      pt: 'Universo dos jogos eletrônicos, streaming, entretenimento imersivo e audiovisual.',
      en: 'Gaming realm, streaming revolution, interactive media, and entertainment culture.',
      es: 'Mundo de los videojuegos, streaming, entretenimiento inmersivo y cultura audiovisual.'
    },
    icon: 'Gamepad2'
  },
  {
    id: 'lifestyle',
    slug: 'estilo-de-vida',
    name: {
      pt: 'Estilo & Mente',
      en: 'Mind & Lifestyle',
      es: 'Estilo y Mente'
    },
    color: '#f59e0b', // Amber yellow from VH logo
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    badgeText: 'text-amber-600 dark:text-amber-400',
    description: {
      pt: 'Foco mental, produtividade humanizada, bem-estar, hábitos modernos e rotinas conscientes.',
      en: 'Mental focus, mindful productivity, well-being, modern habits, and healthy routines.',
      es: 'Enfoque mental, productividad consciente, bienestar, hábitos modernos y rutinas saludables.'
    },
    icon: 'Sparkles'
  },
  {
    id: 'business',
    slug: 'negocios-criatividade',
    name: {
      pt: 'Inovação & Creator',
      en: 'Business & Creators',
      es: 'Negocios y Creadores'
    },
    color: '#ef4444', // Red accent from VH logo V tip
    badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    badgeText: 'text-red-600 dark:text-red-400',
    description: {
      pt: 'Economia dos criadores, modelos de negócio disruptivos e novas lideranças globais.',
      en: 'Creator economy, disruptive business trends, and emerging global entrepreneurship.',
      es: 'Economía de los creadores, modelos de negocio disruptivos y nuevo liderazgo global.'
    },
    icon: 'TrendingUp'
  }
];
