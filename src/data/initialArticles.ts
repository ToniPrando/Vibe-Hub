import { Article, Comment } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'vh-01',
    slug: 'computacao-quantica-marco-nova-era-digital',
    title: 'Computação Quântica Atinge Novo Marco: O Que Esperar da Próxima Revolução Tecnológica',
    subtitle: 'Pesquisadores demonstram coerência quântica recorde e abrem caminho para fármacos sob medida, criptografia pós-quântica e resolução de enigmas moleculares.',
    excerpt: 'Com a estabilização de qubits em temperatura ambiente controlada, novos sistemas alcançam cálculos antes considerados impossíveis em escala de minutos.',
    content: `A fronteira entre a ficção científica e a engenharia computacional acaba de ser reduzida dramaticamente. Cientistas e laboratórios de física de semicondutores anunciaram uma série de experimentos bem-sucedidos em processadores quânticos de segunda geração, demonstrando taxas de erro abaixo de 0,1% em circuitos de centenas de qubits supercondutores.

Esse salto não é apenas incremental: ele representa o limiar onde algoritmos de correção de erros quânticos (QEC) passam a operar com eficiência líquida positiva. Na prática, isso significa que a computação quântica está pronta para sair de pequenos experimentos sintéticos e atacar gargalos industriais fundamentais.

### A Corrida Molecular e o Design de Materiais

O primeiro campo diretamente impactado é o da química computacional. Simular a estrutura tridimensional e os orbitais eletrônicos de moléculas complexas sempre foi um pesadelo para supercomputadores clássicos. Modelar uma enzima que fixa nitrogênio do ar ou projetar um novo eletrólito de bateria de estado sólido exigia aproximações grosseiras.

Com o novo marco, simulações que exigiriam dez mil anos em clusters convencionais foram concluídas em pouco mais de 180 segundos. Cientistas do consórcio internacional estimam que esse avanço acelerará em pelo menos uma década a síntese de catalisadores para captura direta de carbono na atmosfera.

### Criptografia Pós-Quântica e Segurança dos Dados

Nem tudo, contudo, são flores. O poder de desintegrar chaves criptográficas assimétricas tradicionais (como RSA e curvas elípticas) volta ao centro das discussões de governança digital. Instituições financeiras, governos e empresas de infraestrutura crítica estão correndo contra o relógio para implantar algoritmos de reticulados resistentes a ataques quânticos.

"Estamos no momento exato em que a resiliência cibernética precisa ser reescrita", afirma a Dra. Helena Vasconcellos, pesquisadora sênior em computação tolerante a falhas. "Quem não migrar para padrões de segurança pós-quântica até o fim desta década estará com seus segredos comerciais em praça pública."

O futuro que se descortina nos convida a repensar a própria natureza da informação. Da otimização da logística global à descoberta relâmpago de novos antibióticos, a era do qubit acaba de ligar seus motores em velocidade máxima.`,
    categoryId: 'tech',
    tags: ['ComputaçãoQuântica', 'InteligênciaArtificial', 'FísicaAvançada', 'Cibersegurança', 'FuturoDigital'],
    coverImage: '/src/assets/images/hero_tech_quantum_future_1792111788160.jpg',
    coverImageCaption: 'Câmara criogênica de contenção de qubits com guias de onda ópticas em laboratório experimental.',
    author: {
      name: 'Dr. Lucas Silveira',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
      role: {
        pt: 'Editor Chefe de Tecnologia & Futuro',
        en: 'Chief Technology & Future Editor',
        es: 'Editor Jefe de Tecnología y Futuro'
      },
      bio: {
        pt: 'Físico teórico e pesquisador de sistemas complexos. Cobrindo o avanço da computação há mais de 12 anos.',
        en: 'Theoretical physicist and complex systems researcher. Covering computing revolutions for over 12 years.',
        es: 'Físico teórico e investigador de sistemas complejos. Cubriendo avances computacionales desde hace más de 12 años.'
      }
    },
    publishedAt: '2026-10-14T09:30:00Z',
    readTime: 6,
    views: 14820,
    likes: 842,
    likedByMe: false,
    shares: 231,
    isFeatured: true,
    isTrending: true,
    status: 'published',
    translations: {
      en: {
        title: 'Quantum Computing Reaches Historic Milestone: What to Expect from the Next Digital Era',
        subtitle: 'Researchers demonstrate record qubit coherence, paving the way for bespoke pharmaceuticals, post-quantum encryption, and molecular breakthroughs.',
        excerpt: 'With stabilized qubits in controlled environments, next-gen systems solve calculations once deemed impossible within minutes.',
        content: `The boundary between sci-fi dreams and practical computing engineering has narrowed sharply. Semiconductor physicists announced groundbreaking results in 2nd-gen quantum processors, demonstrating error rates below 0.1% across hundreds of superconducting qubits.\n\nThis leap is monumental: quantum error correction algorithms now operate with net positive efficiency, enabling real-world industrial problem solving.\n\n### Molecular Simulation & Material Breakthroughs\n\nSimulating complex enzymes and energy storage materials used to take millennia on classical clusters. In recent trials, these operations took just 180 seconds, promising a 10-year acceleration in direct air carbon capture research.`
      },
      es: {
        title: 'La Computación Cuántica Logra un Hito Histórico: Qué Esperar de la Próxima Era Digital',
        subtitle: 'Investigadores demuestran coherencia cuántica récord y abren el camino a fármacos a medida y criptografía postcuántica.',
        excerpt: 'Con cúbits estabilizados en ambientes controlados, los sistemas de nueva generación resuelven cálculos antes imposibles en cuestión de minutos.',
        content: `La frontera entre la ciencia ficción y la ingeniería computacional se ha reducido drásticamente. Físicos de semiconductores anunciaron resultados inéditos en procesadores cuánticos de segunda generación con tasas de error por debajo del 0,1%.\n\nEste avance representa el umbral donde los algoritmos de corrección cuántica de errores (QEC) operan con eficiencia neta positiva.`
      }
    }
  },
  {
    id: 'vh-02',
    slug: 'telescopio-espacial-imagens-nebulosa-universo-profundo',
    title: 'Telescópio Espacial Revela Imagens Inéditas de Nebulosa nos Confins do Cosmos',
    subtitle: 'Novos sensores infravermelhos perfuram berçários estelares e identificam moléculas orgânicas precursoras de água e aminoácidos.',
    excerpt: 'A imagem em altíssima definição capturou filamentos de poeira cósmica que orbitam estrelas bebês a mais de 8 mil anos-luz da Terra.',
    content: `Os observatórios astronômicos de última geração continuam a desafiar a nossa compreensão sobre a gênese estelar. Uma nova composição fotográfica divulgada pela agência espacial global revelou detalhes sem precedentes do centro ativo da nebulosa de Carina Meridional.

A imagem, processada a partir de centenas de horas de exposição em comprimentos de onda do infravermelho médio e próximo, mostra jatos supersônicos de gás ionizado sendo expelidos por protoestrelas em formação. 

### Assinaturas Químicas de Vida em Potencial

O que mais impressionou os astrobiólogos não foi apenas a beleza visual da tapeçaria de safira e ouro cósmico, mas a análise espectrográfica do gás que permeia a região. Pela primeira vez em uma zona tão distante, detectou-se uma concentração maciça de hidrocarbonetos policíclicos aromáticos (PAHs) associados a vapor d'água e monóxido de carbono congelado.

Esses compostos são exatamente os ingredientes que a ciência considera fundamentais para a chamada "química pré-biótica". Em outras palavras, estamos testemunhando em tempo real a formação dos blocos que, daqui a bilhões de anos, poderão originar sistemas planetários com oceanos.

"Olhar para essa nebulosa é como contemplar o álbum de infância do nosso próprio Sistema Solar", relata o astrônomo Carlos Mendes. "Cada filamento de poeira dourada contém a matéria-prima de futuras rochas, luas e, talvez, consciências."

As descobertas já foram submetidas ao periódico internacional de astrofísica e abrem uma nova fase de missões espectrais focadas em exoplanetas rochosos na zona habitável.`,
    categoryId: 'space',
    tags: ['Astronomia', 'JamesWebb', 'Cosmos', 'Astrobiologia', 'ExploraçãoEspacial'],
    coverImage: '/src/assets/images/article_james_webb_cosmos_1792111788440.jpg',
    coverImageCaption: 'Composição de alta resolução do núcleo da nebulosa cósmica em bandas do infravermelho.',
    author: {
      name: 'Mariana Duarte',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
      role: {
        pt: 'Colunista de Astronomia & Astrofísica',
        en: 'Astronomy & Astrophysics Columnist',
        es: 'Columnista de Astronomía y Astrofísica'
      },
      bio: {
        pt: 'Astrofísica apaixonada por comunicação científica e dados de telescópios orbitais.',
        en: 'Astrophysicist dedicated to science communication and deep space observational data.',
        es: 'Astrofísica dedicada a la divulgación científica y datos de telescopios espaciales.'
      }
    },
    publishedAt: '2026-10-13T14:15:00Z',
    readTime: 5,
    views: 11240,
    likes: 679,
    likedByMe: false,
    shares: 194,
    isFeatured: false,
    isTrending: true,
    status: 'published',
    translations: {
      en: {
        title: 'Deep Space Telescope Unveils Unprecedented Images of Distant Stellar Nebula',
        subtitle: 'New infrared sensors pierce through cosmic dust cradles and identify organic molecules essential for life.',
        excerpt: 'High-definition captures reveal filaments of cosmic dust orbiting baby stars over 8,000 light-years away.',
        content: `Deep space observatories continue to revolutionize our understanding of star birth. A freshly released composite image showcases unprecedented details of an active stellar nursery, highlighting supersonic gas jets and prebiotic chemical signatures.`
      },
      es: {
        title: 'Telescopio Espacial Revela Imágenes Inéditas de Nebulosa en los Confines del Cosmos',
        subtitle: 'Nuevos sensores infrarrojos atraviesan nubes de polvo y detectan moléculas orgánicas precursoras.',
        excerpt: 'La imagen en ultra alta definición capturó filamentos de polvo cósmico a más de 8.000 años luz de la Tierra.',
        content: `Los observatorios espaciales de última generación desafían nuestra comprensión sobre la génesis estelar, revelando una composición detallada con trazas espectrales de vapor de agua y compuestos orgánicos.`
      }
    }
  },
  {
    id: 'vh-03',
    slug: 'cidades-biofilicas-arquitetura-sustentavel-futuro-urbano',
    title: 'Cidades Biofílicas: Como a Arquitetura Sustentável Está Redefinindo o Futuro Urbano',
    subtitle: 'Metrópoles globais integram florestas verticais, microclimas regenerativos e transporte movido a hidrogênio verde.',
    excerpt: 'Projetos urbanísticos em Singapura, Copenhague e Curitiba mostram que aproximar o concreto da flora reduz temperaturas e melhora a saúde mental coletiva.',
    content: `Nas últimas décadas, a imagem padrão das grandes cidades era feita de asfalto fumegante, espigões envidraçados e rios canalizados sob pistas expressas. Esse modelo provou seus limites térmicos, ecológicos e psicológicos. Em resposta direta, emerge com força o movimento do urbanismo biofílico.

A premissa é simples e profunda: seres humanos possuem uma necessidade biológica inata de conexão com a natureza. Em vez de parques isolados como refúgios eventuais de fim de semana, a arquitetura moderna propõe que os próprios edifícios funcionem como organismos fotossintetizantes.

### Fachadas Vivas e Ilhas de Calor

Cidades pioneiras já registraram quedas de até 4,5°C nas temperaturas médias de microbairros após a obrigatoriedade de coberturas verdes e jardins verticais irrigados por captação de água pluvial. Além do conforto térmico, o isolamento acústico natural diminui sensivelmente os decibéis do tráfego urbano.

Outro ponto crucial é a mobilidade integrada. Trilhos elétricos e monotrilhos elevados cortam corredores de árvores nativas, permitindo que a fauna circule entre reservas florestais e o centro econômico.

### O Impacto na Produtividade e Bem-Estar

Estudos recentes de psicologia ambiental constatam que trabalhadores que mantêm contato visual diário com vegetação e luz natural filtrada apresentam 23% menos queixas de ansiedade e um aumento mensurável na criatividade.

"A cidade do século XXI não pode ser uma prisão de concreto", defende a arquiteta urbanista Beatriz Lemos. "Nós projetamos espaços onde as pessoas respiram ar puro, ouvem o som da água e sentem que pertencem a um planeta vivo."`,
    categoryId: 'planet',
    tags: ['Sustentabilidade', 'CidadesInteligentes', 'Arquitetura', 'Clima', 'Urbanismo'],
    coverImage: '/src/assets/images/article_sustainable_cities_future_1792111789045.jpg',
    coverImageCaption: 'Bairro sustentável com florestas verticais integradas e transporte limpo em harmonia costeira.',
    author: {
      name: 'Beatriz Lemos',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
      role: {
        pt: 'Urbanista & Pesquisadora em Clima',
        en: 'Urbanist & Climate Researcher',
        es: 'Urbanista e Investigadora en Clima'
      },
      bio: {
        pt: 'Especialista em cidades regenerativas e mestre em planejamento ecológico.',
        en: 'Specialist in regenerative cities and eco-urban planning.',
        es: 'Especialista en ciudades regenerativas y planificación ecológica.'
      }
    },
    publishedAt: '2026-10-12T11:00:00Z',
    readTime: 4,
    views: 8930,
    likes: 541,
    likedByMe: false,
    shares: 172,
    isFeatured: false,
    isTrending: true,
    status: 'published',
    translations: {
      en: {
        title: 'Biophilic Cities: How Sustainable Architecture is Redefining the Urban Future',
        subtitle: 'Global metropolises integrate vertical forests, cooling microclimates, and green hydrogen transit.',
        excerpt: 'Urban projects across Singapore, Copenhagen, and Curitiba prove that merging concrete with flora reduces heat islands and enhances mental health.',
        content: `Modern architecture is embracing biophilic urban design. Instead of isolated city parks, buildings themselves become photosynthetic ecosystems, reducing ambient temperatures and boosting human well-being.`
      },
      es: {
        title: 'Ciudades Biofílicas: Cómo la Arquitectura Sostenible Redefine el Futuro Urbano',
        subtitle: 'Metrópolis globales integran bosques verticales, microclimas frescos y movilidad ecológica.',
        excerpt: 'Proyectos urbanos demuestran que acercar el concreto a la naturaleza reduce islas de calor y mejora la salud mental.',
        content: `El urbanismo biofílico transforma el horizonte urbano. Fachadas vivas y techos verdes disminuyen hasta 4.5°C las temperaturas en microbarrios, ofreciendo un hábitat equilibrado y saludable.`
      }
    }
  },
  {
    id: 'vh-04',
    slug: 'computacao-espacial-games-fim-telas-tradicionais',
    title: 'A Revolução da Computação Espacial nos Games e o Fim das Telas Tradicionais',
    subtitle: 'Com headsets ultraleves e rastreamento ocular de submilímetros, desenvolvedores criam mundos táteis onde a sala de estar se transforma em tabuleiro vivo.',
    excerpt: 'Estúdios de jogos abandonam monitores estáticos em prol de renderização foveada e áudio binaural espacial que transporta os sentidos por completo.',
    content: `Por mais de quarenta anos, a experiência dos videogames esteve aprisionada a um retângulo de vidro: a TV da sala ou o monitor do desktop. Embora as resoluções tenham subido do CRT de 240p até o 8K OLED, o paradigma espacial era o mesmo. Essa barreira finalmente caiu.

A nova geração de visores de computação espacial combina rastreamento ocular preditivo com lentes micro-OLED de altíssima densidade. O resultado é a capacidade de projetar elementos gráficos com precisão milimétrica sobre a física real do ambiente do usuário.

### O Conceito de Realidade Mesclada Construtiva

Diferente das primeiras tentativas de realidade virtual que isolavam o jogador num capacete pesado, os novos dispositivos pesam menos que duzentos gramas e usam câmeras de passagem ultranítidas. Uma criatura mítica pode saltar de trás do seu sofá real, enquanto as chamas do feitiço refletem realisticamente no tampo da sua mesa de centro de madeira.

O áudio espacial holográfico calcula o eco exato das paredes do cômodo do jogador, garantindo que passos vindos do corredor gerem calafrios instantâneos pela fidelidade acústica.

### Novos Desafios de Gameplay e Interface

Os controles físicos tradicionais estão cedendo espaço para gestos naturais da mão e microintenções oculares. Ao olhar para um objeto e dar um leve toque com o polegar e o indicador, o item é manipulado como se possuísse gravidade palpável.

"Não estamos apenas trocando de periférico; estamos inventando um novo vocabulário expressivo para a arte interativa", sintetiza Gabriel Sato, diretor criativo de um renomado estúdio independente. "O jogo não acontece mais 'na tela'; ele acontece no mesmo espaço físico onde você respira."`,
    categoryId: 'culture',
    tags: ['Games', 'RealidadeVirtual', 'ComputaçãoEspacial', 'DesignInterativo', 'Inovação'],
    coverImage: '/src/assets/images/article_gaming_virtual_reality_1792111789371.jpg',
    coverImageCaption: 'Setup de desenvolvimento com visor espacial de última geração em estúdio criativo.',
    author: {
      name: 'Gabriel Sato',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      role: {
        pt: 'Crítico de Jogos & Novas Mídias',
        en: 'Gaming & New Media Critic',
        es: 'Crítico de Videojuegos y Nuevos Medios'
      },
      bio: {
        pt: 'Especialista em design de jogos imersivos e narrativa em mundos virtuais.',
        en: 'Immersive game design specialist and virtual world narrative researcher.',
        es: 'Especialista en diseño de videojuegos inmersivos y narrativa virtual.'
      }
    },
    publishedAt: '2026-10-11T16:45:00Z',
    readTime: 5,
    views: 7420,
    likes: 489,
    likedByMe: false,
    shares: 145,
    isFeatured: false,
    isTrending: false,
    status: 'published',
    translations: {
      en: {
        title: 'Spatial Computing Revolution in Gaming and the Decline of Traditional Screens',
        subtitle: 'Ultralight headsets and sub-millimeter eye-tracking turn living rooms into interactive stages.',
        excerpt: 'Studios leave static monitors behind in favor of foveated rendering and holographic spatial acoustics.',
        content: `For decades, video games lived inside rectangular displays. Spatial computing changes this paradigm, blending photorealistic interactive creatures into the user's physical surroundings with zero latency.`
      },
      es: {
        title: 'La Revolución de la Computación Espacial en los Videojuegos y el Fin de las Pantallas',
        subtitle: 'Visores ultraligeros y seguimiento ocular transforman las salas de estar en escenarios interactivos.',
        excerpt: 'Estudios creativos reemplazan pantallas tradicionales por renderizado foveado y acústica holográfica.',
        content: `La computación espacial fusiona el entorno real con mundos digitales, permitiendo que la interacción física y gestual sustituya a los controles convencionales.`
      }
    }
  },
  {
    id: 'vh-05',
    slug: 'renascimento-foco-metodos-antidoto-burnout-digital',
    title: 'O Renascimento do Foco: Estratégias Comprovadas para Escapar da Sobrecarga de Notificações',
    subtitle: 'Por que o multitasking constante fragmenta a cognição humana e como os blocos de imersão profunda estão resgatando a paz mental.',
    excerpt: 'Pesquisas em neurociência comprovam que demoramos até 23 minutos para retomar o estado de fluxo após uma simples notificação no celular.',
    content: `Vivemos em uma economia de atenção hiperotimizada para o estímulo contínuo. Pings, badges vermelhos, mensagens instantâneas e feeds infinitos criaram um estado crônico de atenção parcial contínua. As consequências diretas são sensação de cansaço mental precoce, dificuldade de retenção de leitura e ansiedade constante.

Contudo, um contra-movimento vigoroso começou a ganhar força entre profissionais do conhecimento, artistas e pesquisadores: a cultura do 'Deep Work' deliberado.

### O Custo Invisível da Troca de Contexto

Quando interrompemos uma tarefa importante para checar uma mensagem de três segundos, nosso cérebro não volta imediatamente ao raciocínio complexo. Fica para trás o que os neurocientistas chamam de 'resíduo de atenção'. 

Ao longo de um dia de trabalho pontuado por cinquenta interrupções, a mente opera em um estado permanente de neblina cognitiva, minando a capacidade de síntese e gerando frustração.

### Três Práticas para Restaurar a Clareza

1. **Janelas de Silêncio Radical**: Estabelecer 90 minutos diários em modo avião, dedicados exclusivamente à atividade mais desafiadora da sua rotina.
2. **Caixa de Entrada Assíncrona**: Consultar e-mails e comunicadores em apenas dois horários pré-fixados (ex.: 11h e 16h), comunicando essa política claramente aos pares.
3. **Pausas com Baixo Estímulo**: Trocar a rolagem de feed nos intervalos por uma caminhada curta, um copo d'água ou simplesmente olhar pela janela.

Proteger a própria atenção não é um luxo; é a habilidade mestra para quem deseja criar algo relevante e viver com serenidade no mundo contemporâneo.`,
    categoryId: 'lifestyle',
    tags: ['Produtividade', 'SaúdeMental', 'BemEstar', 'Neurociência', 'Foco'],
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=675&q=80',
    coverImageCaption: 'Ambiente minimalista propício para leitura imersiva e clareza mental.',
    author: {
      name: 'Sofia Alencar',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
      role: {
        pt: 'Pesquisadora de Comportamento & Produtividade',
        en: 'Behavioral & Productivity Researcher',
        es: 'Investigadora de Conducta y Productividad'
      },
      bio: {
        pt: 'Autora e pesquisadora de neuroergonomia e hábitos digitais saudáveis.',
        en: 'Author and researcher in neuro-ergonomics and healthy digital habits.',
        es: 'Autora e investigadora en neuroergonomía y hábitos digitales saludables.'
      }
    },
    publishedAt: '2026-10-10T08:00:00Z',
    readTime: 4,
    views: 6150,
    likes: 412,
    likedByMe: false,
    shares: 89,
    isFeatured: false,
    isTrending: false,
    status: 'published',
    translations: {
      en: {
        title: 'The Rebirth of Deep Focus: Proven Tactics to Escape Digital Burnout',
        subtitle: 'Why constant multitasking shatters human cognition and how intentional focus blocks restore mental calm.',
        excerpt: 'Neuroscience reveals it takes up to 23 minutes to regain deep flow state after a single smartphone ping.',
        content: `In an attention economy saturated with notification bells, deliberate deep work has become a superpower. Reclaiming quiet time blocks and practicing asynchronous communication restores cognitive clarity.`
      },
      es: {
        title: 'El Renacimiento del Enfoque: Estrategias Probadas para Evitar el Agotamiento Digital',
        subtitle: 'Por qué la multitarea fragmenta la mente y cómo la inmersión profunda devuelve la serenidad.',
        excerpt: 'Estudios de neurociencia muestran que tardamos hasta 23 minutos en recuperar la concentración profunda tras una distracción.',
        content: `Proteger nuestra atención es indispensable. Implementar ventanas de concentración sin distracciones e intervalos de bajo estímulo renueva la vitalidad mental.`
      }
    }
  },
  {
    id: 'vh-06',
    slug: 'economia-criativa-criadores-independentes-bilhoes',
    title: 'A Economia dos Criadores em 2026: Como Produtores Independentes Conquistam Audiências Fiéis',
    subtitle: 'Microcomunidades engajadas, monetização direta sem intermediários e o poder da autenticidade frente ao conteúdo genérico.',
    excerpt: 'Marcas globais redirecionam orçamentos de publicidade tradicional para vozes autênticas com nichos ultraespecíficos.',
    content: `O ecossistema de conteúdo passou por uma metamorfose sísmica. O modelo clássico de mídia de massa unilateral deu lugar a ecossistemas horizontais compostos por criadores apaixonados que dialogam de igual para igual com suas comunidades.

Hoje, uma newsletter com dez mil leitores altamente engajados pode ser mais rentável e influente do que um portal generalista que acumula milhões de cliques acidentais e efêmeros.

### O Triunfo da Autenticidade

Com a proliferação de textos e mídias geradas em massa na internet, o leitor desenvolveu um radar afiado para detectar o que é autêntico e o que é cópia protocolar. O que atrai e retém pessoas hoje é a voz humana real: os erros honestos, a opinião bem fundamentada e o repertório cultural construído ao longo dos anos.

Criadores que constroem laços genuínos de confiança não precisam vender banners intrusivos. Eles oferecem curadorias de alto valor, cursos aplicados, eventos intimistas e produtos que resolvem dores concretas de quem os acompanha.

O Vibe Hub nasce com esse mesmo espírito: ser o ponto de convergência de ideias que inspiram, informam e conectam leitores que buscam profundidade sem perder o entusiasmo pela vida.`,
    categoryId: 'business',
    tags: ['EconomiaCriativa', 'Negócios', 'Comunidade', 'Empreendedorismo', 'Mídia'],
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=675&q=80',
    coverImageCaption: 'Equipe de criadores independentes em sessão estratégica de produção editorial.',
    author: {
      name: 'Renato Prado',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
      role: {
        pt: 'Estrategista de Marcas & Economia Digital',
        en: 'Brand Strategist & Digital Economy Analyst',
        es: 'Estratega de Marca y Economía Digital'
      },
      bio: {
        pt: 'Consultor de novas mídias e mentor de criadores globais.',
        en: 'New media consultant and mentor for global creator brands.',
        es: 'Consultor de nuevos medios y mentor de creadores globales.'
      }
    },
    publishedAt: '2026-10-09T18:20:00Z',
    readTime: 4,
    views: 5210,
    likes: 387,
    likedByMe: false,
    shares: 110,
    isFeatured: false,
    isTrending: false,
    status: 'published',
    translations: {
      en: {
        title: 'The Creator Economy in 2026: How Independent Voices Build Loyal Communities',
        subtitle: 'Micro-audiences, direct monetization without middlemen, and the sheer power of human authenticity.',
        excerpt: 'Global brands pivot budgets toward genuine voices serving high-intent niche audiences.',
        content: `Independent creators are transforming journalism and digital storytelling. Authenticity and direct community rapport outshine generic algorithmic clickbait.`
      },
      es: {
        title: 'La Economía de los Creadores en 2026: Cómo Voces Independientes Construyen Comunidades',
        subtitle: 'Microcomunidades comprometidas, monetización directa y el poder de la autenticidad humana.',
        excerpt: 'Marcas mundiales destinan presupuestos a creadores independientes con audiencias fieles y específicas.',
        content: `El ecosistema de medios premia hoy la autenticidad y el criterio editorial genuino por encima del contenido sintético masivo.`
      }
    }
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-101',
    articleId: 'vh-01',
    parentId: null,
    authorName: 'Thiago Faria',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    authorRole: 'vip',
    content: 'Sensacional a explicação sobre a transição do QEC. Sempre via notícias sensacionalistas, mas este artigo detalhou com muita sobriedade o impacto na simulação molecular!',
    createdAt: '2026-10-14T11:20:00Z',
    likes: 24,
    likedByMe: false
  },
  {
    id: 'c-102',
    articleId: 'vh-01',
    parentId: 'c-101',
    authorName: 'Dr. Lucas Silveira',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    authorRole: 'author',
    content: 'Muito obrigado Thiago! O nosso compromisso no Vibe Hub é justamente fugir do hype vazio e explicar onde a física real e as aplicações práticas se encontram.',
    createdAt: '2026-10-14T12:05:00Z',
    likes: 18,
    likedByMe: false
  },
  {
    id: 'c-103',
    articleId: 'vh-01',
    parentId: null,
    authorName: 'Camila Rocha',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    authorRole: 'reader',
    content: 'A questão da criptografia pós-quântica me preocupa bastante no setor bancário. As equipes de segurança já estão migrando chaves em produção?',
    createdAt: '2026-10-14T14:40:00Z',
    likes: 9,
    likedByMe: false
  },
  {
    id: 'c-201',
    articleId: 'vh-02',
    parentId: null,
    authorName: 'Felipe Mendonça',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
    authorRole: 'reader',
    content: 'Essa imagem da nebulosa é de tirar o fôlego! Dá uma sensação de pequenez e fascínio ao mesmo tempo. Excelente matéria.',
    createdAt: '2026-10-13T16:10:00Z',
    likes: 15,
    likedByMe: false
  },
  {
    id: 'c-301',
    articleId: 'vh-03',
    parentId: null,
    authorName: 'Juliana Paes',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
    authorRole: 'vip',
    content: 'Cidades com vegetação integrada são o único caminho viável para enfrentar as ondas de calor do verão. Parabéns pela reportagem!',
    createdAt: '2026-10-12T13:30:00Z',
    likes: 11,
    likedByMe: false
  }
];

export const INITIAL_SUBSCRIBERS = [
  {
    id: 'sub-1',
    email: 'leitor.curioso@vibehub.com',
    name: 'Henrique Matos',
    frequency: 'weekly' as const,
    topics: ['tech', 'space', 'culture'],
    subscribedAt: '2026-10-10T14:00:00Z'
  },
  {
    id: 'sub-2',
    email: 'larissa.eng@gmail.com',
    name: 'Larissa Alencar',
    frequency: 'daily' as const,
    topics: ['tech', 'planet'],
    subscribedAt: '2026-10-11T09:20:00Z'
  },
  {
    id: 'sub-3',
    email: 'roberto.design@outlook.com',
    name: 'Roberto Viana',
    frequency: 'weekly' as const,
    topics: ['culture', 'lifestyle', 'business'],
    subscribedAt: '2026-10-13T17:45:00Z'
  }
];
