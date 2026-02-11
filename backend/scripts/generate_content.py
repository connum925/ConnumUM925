"""
Content generation script - parses resume_data.txt and generates bilingual JSON files
"""
import json
import os
import re
from pathlib import Path

# Paths
REPO_ROOT = Path(__file__).parent.parent.parent
RESUME_FILE = REPO_ROOT / "resume_data.txt"
DATA_DIR = Path(__file__).parent.parent / "data"

def ensure_data_dir():
    """Create data directory if it doesn't exist"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

def sanitize_contact(text):
    """Remove any phone numbers from contact information"""
    # Remove phone patterns
    text = re.sub(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', '[REDACTED]', text)
    text = re.sub(r'\bPhone:?\s*[^\n]*', '', text, flags=re.IGNORECASE)
    return text

def parse_resume():
    """Parse resume_data.txt and extract consolidated information"""
    with open(RESUME_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split versions
    versions = re.split(r'={50,}', content)

    # Extract data (Version 2 has more complete AI/ML info, use it as primary)
    data = {
        'name': 'Connor Urbano Mendoza',
        'email': 'connor.jbszz@gmail.com',
        'linkedin': 'linkedin.com/in/connum925',
        'github': 'github.com/connum925'
    }

    return data

def generate_profile():
    """Generate profile.json"""
    profile = {
        "name": "Connor Urbano Mendoza",
        "title": {
            "en": "Software Engineer",
            "es": "Ingeniero de Software"
        },
        "summary": {
            "en": "Results-driven Software Engineer focused on building reliable, scalable products and enterprise AI solutions. Experienced in full-stack development, LLM integrations, and data-driven operational optimization—working closely with cross-functional teams to turn business needs into maintainable systems. Known for proactive ownership, clear communication, and consistently meeting (and when possible, exceeding) expectations while prioritizing team success.",
            "es": "Ingeniero de Software enfocado en construir productos confiables y escalables y soluciones empresariales de IA. Experiencia en desarrollo full-stack, integraciones con LLM y optimización operativa basada en datos, colaborando de cerca con equipos multifuncionales para convertir necesidades de negocio en sistemas mantenibles. Me caracterizo por asumir responsabilidad de forma proactiva, comunicar con claridad y cumplir —y cuando se puede, superar— expectativas, priorizando siempre el éxito del equipo."
        },
        "contact": {
            "email": "connor.jbszz@gmail.com",
            "linkedin": "linkedin.com/in/connum925",
            "github": "github.com/connum925"
        },
        "location": {
            "en": "Mexico City, MX",
            "es": "Ciudad de México, MX"
        }
    }

    with open(DATA_DIR / 'profile.json', 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)
    print("Generated profile.json")

def generate_experience():
    """Generate experience.json"""
    experience = [
        {
            "id": "tr-intern",
            "company": "Thomson Reuters México",
            "position": {
                "en": "Data Analyst Intern",
                "es": "Analista de Datos"
            },
            "location": {
                "en": "Mexico City, MX",
                "es": "Ciudad de México, MX"
            },
            "startDate": "2025-02",
            "endDate": None,
            "current": True,
            "achievements": [
                {
                    "en": "Architected and deployed enterprise AI solutions integrating multiple LLM models (OpenAI GPT, Claude, Gemini, LLaMA, DeepSeek) with internal systems including Microsoft Teams, SharePoint, and AWS S3 buckets to streamline business processes.",
                    "es": "Diseñé e implementé soluciones empresariales de IA integrando múltiples modelos LLM (OpenAI GPT, Claude, Gemini, LLaMA, DeepSeek) con sistemas internos incluyendo Microsoft Teams, SharePoint y AWS S3 para optimizar procesos empresariales."
                },
                {
                    "en": "Implemented BYOD (Bring Your Own Data) frameworks enabling secure integration of proprietary datasets with AI models, facilitating custom solutions for legal, Boomi, Alteryx, Print, HR, and other departments.",
                    "es": "Implementé marcos BYOD (Bring Your Own Data) que permiten la integración segura de conjuntos de datos propietarios con modelos de IA, facilitando soluciones personalizadas para departamentos legales, Boomi, Alteryx, Print, RRHH y otros."
                },
                {
                    "en": "Delivered cross-functional AI support by analyzing requirements, resolving technical tickets, and developing tailored AI integrations to optimize workflows for both internal stakeholders and external clients, reducing processing time of each business case.",
                    "es": "Proporcioné soporte de IA multifuncional analizando requisitos, resolviendo tickets técnicos y desarrollando integraciones de IA personalizadas para optimizar flujos de trabajo para partes interesadas internas y clientes externos, reduciendo el tiempo de procesamiento de cada caso de negocio."
                },
                {
                    "en": "Optimized operational workflows by executing IPC monitoring, P4 incident resolution (priority 4-5), and Tableau data validation, enabling senior analysts to focus on strategic initiatives while maintaining service continuity.",
                    "es": "Optimicé flujos de trabajo operativos ejecutando monitoreo IPC, resolución de incidentes P4 (prioridad 4-5) y validación de datos en Tableau, permitiendo a analistas senior enfocarse en iniciativas estratégicas mientras se mantiene la continuidad del servicio."
                },
                {
                    "en": "Engineered Python-ServiceNow API integration creating an automated historical database with real-time ticket tracking that boosted team productivity and enhanced trend analysis capabilities for data-driven decision-making.",
                    "es": "Desarrollé integración de API Python-ServiceNow creando una base de datos histórica automatizada con seguimiento de tickets en tiempo real que aumentó la productividad del equipo y mejoró las capacidades de análisis de tendencias para la toma de decisiones basada en datos."
                },
                {
                    "en": "Exceeded performance benchmarks by consistently maintaining 85%+ work utilization rate through proactive task management, process optimization, and effective time allocation across multiple operational responsibilities.",
                    "es": "Superé los puntos de referencia de rendimiento manteniendo consistentemente una tasa de utilización del trabajo del 85%+ mediante gestión proactiva de tareas, optimización de procesos y asignación efectiva de tiempo entre múltiples responsabilidades operativas."
                },
                {
                    "en": "Executed monitoring shifts for active Salesforce jobs, proactively identifying and preventing potential issues to achieve an 8% reduction in incident production.",
                    "es": "Ejecuté turnos de monitoreo para trabajos activos de Salesforce, identificando y previniendo proactivamente problemas potenciales para lograr una reducción del 8% en la producción de incidentes."
                }
            ],
            "technologies": ["Python", "LLM Models", "OpenAI GPT", "Claude", "Gemini", "LLaMA", "DeepSeek", "Microsoft Teams", "SharePoint", "AWS S3", "ServiceNow API", "Tableau", "Salesforce", "Informatica PowerCenter", "Snowflake", "Alteryx", "Datadog"]
        }
    ]

    with open(DATA_DIR / 'experience.json', 'w', encoding='utf-8') as f:
        json.dump(experience, f, indent=2, ensure_ascii=False)
    print("Generated experience.json")

def generate_education():
    """Generate education.json"""
    education = [
        {
            "id": "ipn-escom",
            "institution": "Instituto Politécnico Nacional",
            "school": "Escuela Superior de Cómputo (ESCOM)",
            "degree": {
                "en": "Bachelor of Computer Systems Engineering",
                "es": "Ingeniería en Sistemas Computacionales"
            },
            "certificate": {
                "en": "Technical Certificate: Aeronautics",
                "es": "Certificado Técnico: Aeronáutica"
            },
            "location": {
                "en": "Mexico City, MX",
                "es": "Ciudad de México, MX"
            },
            "startDate": "2021-08",
            "endDate": "2025-12",
            "gpa": {
                "en": "3.5",
                "es": "8.5"
            },
            "coursework": {
                "en": [
                    "Object-Oriented Programming",
                    "Data Structures and Algorithms",
                    "Database Systems",
                    "Operating Systems",
                    "Design and Analysis of Algorithms",
                    "Artificial Intelligence",
                    "Mobile Application Development",
                    "Software Engineering",
                    "UX/UI Design"
                ],
                "es": [
                    "Programación Orientada a Objetos",
                    "Estructuras de Datos y Algoritmos",
                    "Sistemas de Bases de Datos",
                    "Sistemas Operativos",
                    "Diseño y Análisis de Algoritmos",
                    "Inteligencia Artificial",
                    "Desarrollo de Aplicaciones Móviles",
                    "Ingeniería de Software",
                    "Diseño UX/UI"
                ]
            }
        }
    ]

    with open(DATA_DIR / 'education.json', 'w', encoding='utf-8') as f:
        json.dump(education, f, indent=2, ensure_ascii=False)
    print("Generated education.json")

def generate_skills():
    """Generate skills.json"""
    skills = {
        "languages": {
            "label": {
                "en": "Programming Languages",
                "es": "Lenguajes de Programación"
            },
            "proficient": ["JavaScript", "Java", "C", "C++", "C#", "Python", "TypeScript", "HTML/CSS"],
            "familiar": ["PHP", "SQL", "Kotlin"]
        },
        "frameworks": {
            "label": {
                "en": "Frameworks & Libraries",
                "es": "Frameworks y Bibliotecas"
            },
            "items": ["Node.js", "React", "Angular", "Bootstrap 5", "Laravel", "Flutter", ".NET"]
        },
        "tools": {
            "label": {
                "en": "Tools & Technologies",
                "es": "Herramientas y Tecnologías"
            },
            "items": ["Git", "Figma", "VS Code", "MS Azure", "Visual Studio", "IntelliJ", "NetBeans", "MongoDB", "Google Cloud", "Amazon Web Services", "Informatica PowerCenter", "Snowflake", "Alteryx", "Datadog", "Android Studio", "ESP", "Docker", "MCP Servers"]
        },
        "data_engineering": {
            "label": {
                "en": "Data Engineering & Business",
                "es": "Ingeniería de Datos y Negocios"
            },
            "items": [
                {
                    "en": "ETL Processes",
                    "es": "Procesos ETL"
                },
                {
                    "en": "Business Cases Analysis",
                    "es": "Análisis de Casos de Negocio"
                },
                {
                    "en": "Data Pipeline Design",
                    "es": "Diseño de Pipelines de Datos"
                },
                {
                    "en": "Data Warehousing",
                    "es": "Almacenamiento de Datos"
                }
            ]
        },
        "ai_ml": {
            "label": {
                "en": "AI & Machine Learning",
                "es": "IA y Aprendizaje Automático"
            },
            "items": [
                {
                    "category": {
                        "en": "LLM Models",
                        "es": "Modelos LLM"
                    },
                    "technologies": ["OpenAI GPT", "Claude", "Gemini", "LLaMA", "DeepSeek"]
                },
                {
                    "category": {
                        "en": "AI Techniques",
                        "es": "Técnicas de IA"
                    },
                    "technologies": ["Prompt Engineering", "RAG Systems", "BYOD (Bring Your Own Data)"]
                },
                {
                    "category": {
                        "en": "AI Integrations",
                        "es": "Integraciones de IA"
                    },
                    "technologies": ["Microsoft Teams", "SharePoint", "AWS S3"]
                }
            ]
        },
        "interpersonal": {
            "label": {
                "en": "Interpersonal Skills",
                "es": "Habilidades Interpersonales"
            },
            "items": [
                {
                    "en": "Public Speaking",
                    "es": "Oratoria"
                },
                {
                    "en": "Adaptable",
                    "es": "Adaptabilidad"
                },
                {
                    "en": "Collaborative",
                    "es": "Colaboración"
                },
                {
                    "en": "Patient",
                    "es": "Paciencia"
                },
                {
                    "en": "Leadership",
                    "es": "Liderazgo"
                },
                {
                    "en": "Teamwork",
                    "es": "Trabajo en Equipo"
                },
                {
                    "en": "Problem Solving",
                    "es": "Resolución de Problemas"
                }
            ]
        }
    }

    with open(DATA_DIR / 'skills.json', 'w', encoding='utf-8') as f:
        json.dump(skills, f, indent=2, ensure_ascii=False)
    print("Generated skills.json")

def generate_certificates():
    """Generate certificates.json"""
    certificates = [
        # 2025 Certificates
        {
            "id": "ef-set-english-b2",
            "title": {
                "en": "EF SET English Certificate 57/100 (B2 Upper Intermediate)",
                "es": "Certificado de inglés EF SET 57/100 (B2 Intermedio alto)"
            },
            "issuer": "EF SET",
            "date": "2025-12",
            "credentialUrl": "https://cert.efset.org/en/HHitRY"
        },
        {
            "id": "linkedin-linux-command",
            "title": {
                "en": "Learning Linux Command Line",
                "es": "Aprender la línea de comandos de Linux"
            },
            "issuer": "LinkedIn Learning",
            "date": "2025-04",
            "credentialUrl": "https://www.linkedin.com/learning/certificates/151d9c1df244f7f2d5b6c3813067357fd775e3a45ac397824c92265dbf281e66?trk=share_certificate"
        },
        {
            "id": "ms-career-essentials",
            "title": {
                "en": "Career Essentials in Software Development by Microsoft and LinkedIn",
                "es": "Esenciales de carrera en desarrollo de software (Microsoft y LinkedIn)"
            },
            "issuer": "Microsoft",
            "date": "2025-03",
            "credentialUrl": "https://www.linkedin.com/learning/certificates/4b6f446a8a167b29aaa7ec5bc1bd51c61a9faf25f78b306660c70fa2becd3b21?trk=share_certificate"
        },
        {
            "id": "linkedin-programming-beyond",
            "title": {
                "en": "Programming Foundations: Beyond the Fundamentals",
                "es": "Fundamentos de programación: más allá de los fundamentos"
            },
            "issuer": "LinkedIn Learning",
            "date": "2025-03",
            "credentialUrl": "https://www.linkedin.com/learning/certificates/527fc7716bfce18dcb35d58ac0f42d0fcfd47790ae2b96e2d424fcfa77531b35?trk=share_certificate"
        },
        {
            "id": "linkedin-programming-fundamentals",
            "title": {
                "en": "Programming Foundations: Fundamentals",
                "es": "Fundamentos de programación: fundamentos"
            },
            "issuer": "LinkedIn Learning",
            "date": "2025-03",
            "credentialUrl": "https://www.linkedin.com/learning/certificates/ba44c71be5d69f30ae94b4de0f1d3f33b053fc3738b0ba3dc71e48f06abb4706?trk=share_certificate"
        },
        {
            "id": "datadog-slo",
            "title": {
                "en": "Introduction to Service Level Objectives",
                "es": "Introducción a los objetivos de nivel de servicio (SLO)"
            },
            "issuer": "Datadog",
            "date": "2025-03",
            "credentialUrl": "https://learn.datadoghq.com/certificates/9bwfm7m9i0"
        },
        {
            "id": "datadog-observability",
            "title": {
                "en": "Introduction to Observability",
                "es": "Introducción a la observabilidad"
            },
            "issuer": "Datadog",
            "date": "2025-03",
            "credentialUrl": "https://learn.datadoghq.com/certificates/2haxwtcj19"
        },
        {
            "id": "datadog-sre-101",
            "title": {
                "en": "Datadog 101: Site Reliability Engineer",
                "es": "Datadog 101: ingeniería de confiabilidad del sitio (SRE)"
            },
            "issuer": "Datadog",
            "date": "2025-03",
            "credentialUrl": "https://learn.datadoghq.com/certificates/ap1mmwiykd"
        },
        {
            "id": "linkedin-sharepoint-beyond",
            "title": {
                "en": "SharePoint Online Essential Training: Beyond the Basics",
                "es": "Formación esencial de SharePoint Online: más allá de lo básico"
            },
            "issuer": "LinkedIn Learning",
            "date": "2025-02",
            "credentialUrl": "https://www.linkedin.com/learning/certificates/36d42b9deb7c0802f534ebd43645a0b4d8acdd46e0fee89617c1bfa2d2b4c50a?trk=share_certificate"
        },
        {
            "id": "linkedin-ai-intro-2023",
            "title": {
                "en": "Introduction to Artificial Intelligence (2023)",
                "es": "Introducción a la inteligencia artificial (2023)"
            },
            "issuer": "LinkedIn Learning",
            "date": "2025-02",
            "credentialUrl": "https://www.linkedin.com/learning/certificates/874c39abe4a7ea4f5d974b1f9a5ef309ff7e9d1460f86be5b9b3651ae363e6e7?trk=share_certificate"
        },
        {
            "id": "linkedin-privacy-governance",
            "title": {
                "en": "Privacy, Governance, and Compliance: Data Sharing",
                "es": "Privacidad, gobernanza y cumplimiento: intercambio de datos"
            },
            "issuer": "LinkedIn Learning",
            "date": "2025-02",
            "credentialUrl": "https://lnkd.in/gnTFw8vK"
        },
        # 2024 Certificates
        {
            "id": "google-genai-llm",
            "title": {
                "en": "Generative AI & Large Language Models",
                "es": "IA Generativa y Modelos de Lenguaje Grande"
            },
            "issuer": "Google Cloud México",
            "date": "2024-12",
            "credentialUrl": "https://www.cloudskillsboost.google/public_profiles/3dc5e61c-b821-4b4a-b783-e6f967ce705e"
        },
        {
            "id": "google-genai-fundamentals",
            "title": {
                "en": "Generative AI Fundamentals",
                "es": "Fundamentos de IA generativa"
            },
            "issuer": "Google Cloud Skills Boost",
            "date": "2024-03",
            "credentialUrl": "https://www.cloudskillsboost.google/public_profiles/3dc5e61c-b821-4b4a-b783-e6f967ce705e"
        },
        # 2023 Certificates
        {
            "id": "udemy-bootstrap5",
            "title": {
                "en": "Bootstrap 5: The Complete Practical Course from Scratch",
                "es": "Bootstrap 5: El Curso Completo, Práctico y Desde Cero"
            },
            "issuer": "Udemy",
            "date": "2023-07",
            "credentialUrl": "https://www.udemy.com/certificate/UC-d4249345-d6b1-41fc-8600-e7a50b19db35/"
        }
    ]

    with open(DATA_DIR / 'certificates.json', 'w', encoding='utf-8') as f:
        json.dump(certificates, f, indent=2, ensure_ascii=False)
    print("Generated certificates.json")

def generate_projects():
    """Generate projects.json with 3 real + 17 placeholder projects"""
    projects = [
        # Real project 1
        {
            "id": "sweet-style",
            "slug": "sweet-style",
            "title": {
                "en": "Sweet Style - E-commerce & POS Platform",
                "es": "Sweet Style - Plataforma E-commerce y POS"
            },
            "summary": {
                "en": "Integrated E-commerce and Point-of-Sale platform unifying online and physical retail operations with synchronized inventory management and cross-channel sales processing.",
                "es": "Plataforma integrada de E-commerce y Punto de Venta que unifica operaciones de retail online y físico con gestión de inventario sincronizada y procesamiento de ventas multicanal."
            },
            "description": {
                "en": "Developed a comprehensive integrated E-commerce and POS platform designed to unify online and physical retail operations. The system features seamless cross-channel sales processing and synchronized inventory management, ensuring real-time accuracy across all sales channels. Successfully optimized logistics by integrating online and POS data, achieving reduced operational costs and significantly boosting productivity in order fulfillment processes.",
                "es": "Desarrollé una plataforma integral de E-commerce y POS diseñada para unificar operaciones de retail online y físico. El sistema presenta procesamiento de ventas multicanal sin interrupciones y gestión de inventario sincronizada, asegurando precisión en tiempo real en todos los canales de venta. Optimicé con éxito la logística integrando datos online y POS, logrando reducir costos operativos e incrementar significativamente la productividad en procesos de cumplimiento de pedidos."
            },
            "technologies": ["React", "Node.js", "JavaScript", "Java", "Python", "MySQL"],
            "startDate": "2024-01",
            "endDate": "2024-11",
            "featured": True,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/sweet-style/screenshot-1.jpg",
                    "alt": {
                        "en": "Sweet Style dashboard interface",
                        "es": "Interfaz del panel de Sweet Style"
                    },
                    "caption": {
                        "en": "Unified dashboard for inventory and sales management",
                        "es": "Panel unificado para gestión de inventario y ventas"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        # Real project 2
        {
            "id": "fluvi-traffic",
            "slug": "fluvi-traffic-simulator",
            "title": {
                "en": "FLUVI Traffic Simulator",
                "es": "Simulador de Tráfico FLUVI"
            },
            "summary": {
                "en": "Cellular automata traffic simulator modeling local traffic flows using ECA 108 to aid logistical planning and traffic management decisions.",
                "es": "Simulador de tráfico por autómatas celulares que modela flujos de tráfico locales usando ECA 108 para ayudar en planificación logística y decisiones de gestión de tráfico."
            },
            "description": {
                "en": "Developed a sophisticated cellular automata traffic simulator based on Elementary Cellular Automaton 108 (ECA 108) to model local traffic flows and aid logistical planning. The simulator enables comprehensive simulation of diverse traffic scenarios including road closures and obstructions to proactively assess impacts on traffic patterns. Generated actionable simulation data from various use cases, enabling cost-efficient, data-driven traffic management decisions for urban planning initiatives.",
                "es": "Desarrollé un sofisticado simulador de tráfico por autómatas celulares basado en Elementary Cellular Automaton 108 (ECA 108) para modelar flujos de tráfico locales y ayudar en planificación logística. El simulador permite simulación integral de diversos escenarios de tráfico incluyendo cierres de calles y obstrucciones para evaluar proactivamente impactos en patrones de tráfico. Generé datos de simulación accionables de varios casos de uso, permitiendo decisiones de gestión de tráfico eficientes y basadas en datos para iniciativas de planificación urbana."
            },
            "technologies": ["JavaScript", "HTML", "CSS", "C++"],
            "startDate": "2024-12",
            "endDate": "2025-04",
            "featured": True,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/fluvi-traffic/simulation-view.jpg",
                    "alt": {
                        "en": "Traffic simulation in progress",
                        "es": "Simulación de tráfico en progreso"
                    },
                    "caption": {
                        "en": "Real-time cellular automata traffic flow visualization",
                        "es": "Visualización de flujo de tráfico por autómatas celulares en tiempo real"
                    }
                },
                {
                    "type": "video",
                    "src": "/media/projects/fluvi-traffic/demo.mp4",
                    "alt": {
                        "en": "FLUVI simulator demonstration",
                        "es": "Demostración del simulador FLUVI"
                    },
                    "caption": {
                        "en": "Interactive demonstration of traffic scenario simulation",
                        "es": "Demostración interactiva de simulación de escenarios de tráfico"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        # Real project 3
        {
            "id": "file-explorer",
            "slug": "simple-file-explorer",
            "title": {
                "en": "Simple File Explorer - Android App",
                "es": "Explorador de Archivos Simple - App Android"
            },
            "summary": {
                "en": "Kotlin-based Android file explorer with intuitive navigation, multi-format file viewers, and theme customization support.",
                "es": "Explorador de archivos Android basado en Kotlin con navegación intuitiva, visualizadores de múltiples formatos y soporte de personalización de temas."
            },
            "description": {
                "en": "Developed a robust Kotlin-based Android file explorer application enabling intuitive directory navigation and comprehensive local file access. Implemented versatile viewers for common file types including images, text documents, and PDF files to allow convenient content previews without requiring external applications. Engineered basic DOCX viewing capability via HTML conversion and integrated theme support, significantly enhancing usability and personalization options for end users.",
                "es": "Desarrollé una robusta aplicación de explorador de archivos Android basada en Kotlin que permite navegación intuitiva de directorios y acceso integral a archivos locales. Implementé visualizadores versátiles para tipos de archivo comunes incluyendo imágenes, documentos de texto y archivos PDF para permitir vistas previas de contenido convenientes sin requerir aplicaciones externas. Desarrollé capacidad básica de visualización DOCX vía conversión HTML e integré soporte de temas, mejorando significativamente la usabilidad y opciones de personalización para usuarios finales."
            },
            "technologies": ["Kotlin", "Android Studio", "XML"],
            "startDate": "2025-01",
            "endDate": "2025-03",
            "featured": True,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/file-explorer/app-screen.jpg",
                    "alt": {
                        "en": "File explorer main interface",
                        "es": "Interfaz principal del explorador de archivos"
                    },
                    "caption": {
                        "en": "Clean and intuitive file browsing interface",
                        "es": "Interfaz limpia e intuitiva para explorar archivos"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        # Placeholder projects 4-20
        {
            "id": "placeholder-api-gateway",
            "slug": "api-gateway-microservices",
            "title": {
                "en": "API Gateway for Microservices [Placeholder]",
                "es": "Gateway API para Microservicios [Marcador]"
            },
            "summary": {
                "en": "Scalable API gateway implementation for managing microservices communication and authentication. (Sample project for demonstration purposes)",
                "es": "Implementación de gateway API escalable para gestionar comunicación de microservicios y autenticación. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This is a placeholder project demonstrating a potential API gateway architecture. The actual implementation would involve building a centralized gateway to route requests, handle authentication, and manage rate limiting across distributed microservices.",
                "es": "Este es un proyecto marcador que demuestra una arquitectura potencial de gateway API. La implementación real involucraría construir un gateway centralizado para enrutar solicitudes, manejar autenticación y gestionar limitación de tasa entre microservicios distribuidos."
            },
            "technologies": ["Node.js", "Express", "Redis", "JWT", "Docker"],
            "startDate": "2024-06",
            "endDate": "2024-08",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/architecture-diagram.jpg",
                    "alt": {
                        "en": "API Gateway architecture diagram",
                        "es": "Diagrama de arquitectura del Gateway API"
                    },
                    "caption": {
                        "en": "Microservices communication flow",
                        "es": "Flujo de comunicación de microservicios"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-ml-classifier",
            "slug": "image-classification-ml",
            "title": {
                "en": "Image Classification ML Model [Placeholder]",
                "es": "Modelo ML de Clasificación de Imágenes [Marcador]"
            },
            "summary": {
                "en": "Machine learning model for automated image classification and tagging. (Sample project for demonstration purposes)",
                "es": "Modelo de aprendizaje automático para clasificación y etiquetado automatizado de imágenes. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder project represents a potential machine learning solution for automated image classification. It would leverage convolutional neural networks to categorize images and generate descriptive tags automatically.",
                "es": "Este proyecto marcador representa una solución potencial de aprendizaje automático para clasificación automatizada de imágenes. Aprovecharía redes neuronales convolucionales para categorizar imágenes y generar etiquetas descriptivas automáticamente."
            },
            "technologies": ["Python", "TensorFlow", "Keras", "OpenCV", "NumPy"],
            "startDate": "2024-03",
            "endDate": "2024-05",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/ml-model.jpg",
                    "alt": {
                        "en": "Model training visualization",
                        "es": "Visualización de entrenamiento del modelo"
                    },
                    "caption": {
                        "en": "Neural network training progress",
                        "es": "Progreso de entrenamiento de red neuronal"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-iot-dashboard",
            "slug": "iot-monitoring-dashboard",
            "title": {
                "en": "IoT Monitoring Dashboard [Placeholder]",
                "es": "Panel de Monitoreo IoT [Marcador]"
            },
            "summary": {
                "en": "Real-time monitoring dashboard for IoT sensor data visualization and alerting. (Sample project for demonstration purposes)",
                "es": "Panel de monitoreo en tiempo real para visualización de datos de sensores IoT y alertas. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder demonstrates a potential IoT monitoring solution featuring real-time data collection from distributed sensors, visualization dashboards, and intelligent alerting mechanisms for anomaly detection.",
                "es": "Este marcador demuestra una solución potencial de monitoreo IoT con recolección de datos en tiempo real de sensores distribuidos, paneles de visualización y mecanismos inteligentes de alerta para detección de anomalías."
            },
            "technologies": ["JavaScript", "D3.js", "MQTT", "InfluxDB", "Grafana"],
            "startDate": "2024-09",
            "endDate": "2024-11",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/dashboard.jpg",
                    "alt": {
                        "en": "IoT dashboard interface",
                        "es": "Interfaz del panel IoT"
                    },
                    "caption": {
                        "en": "Real-time sensor data visualization",
                        "es": "Visualización de datos de sensores en tiempo real"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-blockchain-wallet",
            "slug": "cryptocurrency-wallet",
            "title": {
                "en": "Cryptocurrency Wallet Application [Placeholder]",
                "es": "Aplicación de Billetera de Criptomonedas [Marcador]"
            },
            "summary": {
                "en": "Secure cryptocurrency wallet with multi-chain support and transaction history. (Sample project for demonstration purposes)",
                "es": "Billetera de criptomonedas segura con soporte multi-cadena e historial de transacciones. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder project illustrates a potential cryptocurrency wallet application supporting multiple blockchain networks, secure key management, and comprehensive transaction tracking with intuitive user interfaces.",
                "es": "Este proyecto marcador ilustra una aplicación potencial de billetera de criptomonedas que soporta múltiples redes blockchain, gestión segura de claves y seguimiento integral de transacciones con interfaces de usuario intuitivas."
            },
            "technologies": ["React", "Web3.js", "Ethers.js", "MetaMask", "Solidity"],
            "startDate": "2023-11",
            "endDate": "2024-01",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/wallet-ui.jpg",
                    "alt": {
                        "en": "Wallet user interface",
                        "es": "Interfaz de usuario de billetera"
                    },
                    "caption": {
                        "en": "Multi-chain wallet dashboard",
                        "es": "Panel de billetera multi-cadena"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-task-automation",
            "slug": "task-automation-platform",
            "title": {
                "en": "Task Automation Platform [Placeholder]",
                "es": "Plataforma de Automatización de Tareas [Marcador]"
            },
            "summary": {
                "en": "Workflow automation platform for integrating and orchestrating business processes. (Sample project for demonstration purposes)",
                "es": "Plataforma de automatización de flujos de trabajo para integrar y orquestar procesos de negocio. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder represents a potential workflow automation platform enabling users to create, schedule, and monitor automated tasks across various integrated services and APIs with visual workflow builders.",
                "es": "Este marcador representa una plataforma potencial de automatización de flujos de trabajo que permite a usuarios crear, programar y monitorear tareas automatizadas a través de varios servicios integrados y APIs con constructores visuales de flujos de trabajo."
            },
            "technologies": ["Python", "Celery", "RabbitMQ", "PostgreSQL", "Vue.js"],
            "startDate": "2024-04",
            "endDate": "2024-06",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/workflow.jpg",
                    "alt": {
                        "en": "Workflow builder interface",
                        "es": "Interfaz del constructor de flujos de trabajo"
                    },
                    "caption": {
                        "en": "Visual workflow design canvas",
                        "es": "Lienzo de diseño visual de flujos de trabajo"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-chat-application",
            "slug": "realtime-chat-app",
            "title": {
                "en": "Real-time Chat Application [Placeholder]",
                "es": "Aplicación de Chat en Tiempo Real [Marcador]"
            },
            "summary": {
                "en": "WebSocket-based real-time messaging platform with multimedia support. (Sample project for demonstration purposes)",
                "es": "Plataforma de mensajería en tiempo real basada en WebSocket con soporte multimedia. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder demonstrates a potential real-time chat application featuring WebSocket communication, multimedia message support, user presence indicators, and end-to-end encryption for secure messaging.",
                "es": "Este marcador demuestra una aplicación potencial de chat en tiempo real con comunicación WebSocket, soporte de mensajes multimedia, indicadores de presencia de usuario y cifrado de extremo a extremo para mensajería segura."
            },
            "technologies": ["Node.js", "Socket.io", "MongoDB", "React", "WebRTC"],
            "startDate": "2023-09",
            "endDate": "2023-11",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/chat-ui.jpg",
                    "alt": {
                        "en": "Chat application interface",
                        "es": "Interfaz de aplicación de chat"
                    },
                    "caption": {
                        "en": "Modern messaging interface with rich media",
                        "es": "Interfaz moderna de mensajería con medios enriquecidos"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-analytics-engine",
            "slug": "analytics-reporting-engine",
            "title": {
                "en": "Analytics & Reporting Engine [Placeholder]",
                "es": "Motor de Análisis y Reportes [Marcador]"
            },
            "summary": {
                "en": "Comprehensive analytics platform with customizable dashboards and automated reporting. (Sample project for demonstration purposes)",
                "es": "Plataforma integral de análisis con paneles personalizables y reportes automatizados. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder illustrates a potential analytics and reporting engine providing comprehensive data visualization, custom dashboard creation, automated report generation, and data export capabilities for business intelligence.",
                "es": "Este marcador ilustra un motor potencial de análisis y reportes que proporciona visualización integral de datos, creación de paneles personalizados, generación automatizada de reportes y capacidades de exportación de datos para inteligencia de negocios."
            },
            "technologies": ["Python", "Pandas", "Matplotlib", "Flask", "PostgreSQL"],
            "startDate": "2024-01",
            "endDate": "2024-03",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/analytics.jpg",
                    "alt": {
                        "en": "Analytics dashboard view",
                        "es": "Vista de panel de análisis"
                    },
                    "caption": {
                        "en": "Comprehensive business intelligence dashboard",
                        "es": "Panel integral de inteligencia de negocios"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-ci-cd-pipeline",
            "slug": "cicd-deployment-pipeline",
            "title": {
                "en": "CI/CD Deployment Pipeline [Placeholder]",
                "es": "Pipeline de Despliegue CI/CD [Marcador]"
            },
            "summary": {
                "en": "Automated continuous integration and deployment pipeline with quality gates. (Sample project for demonstration purposes)",
                "es": "Pipeline automatizado de integración y despliegue continuo con puertas de calidad. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder represents a potential CI/CD pipeline implementation featuring automated testing, code quality analysis, security scanning, and multi-environment deployment orchestration with rollback capabilities.",
                "es": "Este marcador representa una implementación potencial de pipeline CI/CD con pruebas automatizadas, análisis de calidad de código, escaneo de seguridad y orquestación de despliegue multi-ambiente con capacidades de rollback."
            },
            "technologies": ["Jenkins", "Docker", "Kubernetes", "GitLab CI", "Terraform"],
            "startDate": "2024-07",
            "endDate": "2024-09",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/pipeline.jpg",
                    "alt": {
                        "en": "CI/CD pipeline visualization",
                        "es": "Visualización de pipeline CI/CD"
                    },
                    "caption": {
                        "en": "Automated deployment workflow stages",
                        "es": "Etapas de flujo de trabajo de despliegue automatizado"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-content-cms",
            "slug": "headless-cms-platform",
            "title": {
                "en": "Headless CMS Platform [Placeholder]",
                "es": "Plataforma CMS Headless [Marcador]"
            },
            "summary": {
                "en": "API-first content management system with flexible content modeling. (Sample project for demonstration purposes)",
                "es": "Sistema de gestión de contenido API-first con modelado flexible de contenido. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder demonstrates a potential headless CMS solution offering flexible content modeling, RESTful and GraphQL APIs, role-based access control, and multi-channel content delivery capabilities.",
                "es": "Este marcador demuestra una solución potencial de CMS headless que ofrece modelado flexible de contenido, APIs RESTful y GraphQL, control de acceso basado en roles y capacidades de entrega de contenido multi-canal."
            },
            "technologies": ["Node.js", "GraphQL", "MongoDB", "Express", "Redis"],
            "startDate": "2023-12",
            "endDate": "2024-02",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/cms-admin.jpg",
                    "alt": {
                        "en": "CMS administration panel",
                        "es": "Panel de administración CMS"
                    },
                    "caption": {
                        "en": "Content management interface",
                        "es": "Interfaz de gestión de contenido"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-security-scanner",
            "slug": "vulnerability-security-scanner",
            "title": {
                "en": "Vulnerability Security Scanner [Placeholder]",
                "es": "Escáner de Seguridad de Vulnerabilidades [Marcador]"
            },
            "summary": {
                "en": "Automated security scanning tool for identifying code vulnerabilities and compliance issues. (Sample project for demonstration purposes)",
                "es": "Herramienta de escaneo de seguridad automatizado para identificar vulnerabilidades de código y problemas de cumplimiento. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder illustrates a potential security scanning solution performing automated vulnerability detection, dependency analysis, compliance checking, and generating detailed security reports with remediation recommendations.",
                "es": "Este marcador ilustra una solución potencial de escaneo de seguridad que realiza detección automatizada de vulnerabilidades, análisis de dependencias, verificación de cumplimiento y genera reportes detallados de seguridad con recomendaciones de remediación."
            },
            "technologies": ["Python", "OWASP", "Snyk", "SonarQube", "Docker"],
            "startDate": "2024-05",
            "endDate": "2024-07",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/security-report.jpg",
                    "alt": {
                        "en": "Security scan results",
                        "es": "Resultados de escaneo de seguridad"
                    },
                    "caption": {
                        "en": "Vulnerability assessment dashboard",
                        "es": "Panel de evaluación de vulnerabilidades"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-mobile-fitness",
            "slug": "fitness-tracking-mobile-app",
            "title": {
                "en": "Fitness Tracking Mobile App [Placeholder]",
                "es": "App Móvil de Seguimiento Fitness [Marcador]"
            },
            "summary": {
                "en": "Cross-platform mobile application for workout tracking and health monitoring. (Sample project for demonstration purposes)",
                "es": "Aplicación móvil multiplataforma para seguimiento de entrenamientos y monitoreo de salud. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder represents a potential fitness tracking application featuring workout logging, progress visualization, nutrition tracking, and integration with wearable devices for comprehensive health monitoring.",
                "es": "Este marcador representa una aplicación potencial de seguimiento fitness con registro de entrenamientos, visualización de progreso, seguimiento nutricional e integración con dispositivos portátiles para monitoreo integral de salud."
            },
            "technologies": ["Flutter", "Dart", "Firebase", "HealthKit", "Google Fit"],
            "startDate": "2023-10",
            "endDate": "2023-12",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/fitness-app.jpg",
                    "alt": {
                        "en": "Fitness app interface",
                        "es": "Interfaz de app fitness"
                    },
                    "caption": {
                        "en": "Workout tracking and progress visualization",
                        "es": "Seguimiento de entrenamientos y visualización de progreso"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-inventory-system",
            "slug": "inventory-management-system",
            "title": {
                "en": "Inventory Management System [Placeholder]",
                "es": "Sistema de Gestión de Inventario [Marcador]"
            },
            "summary": {
                "en": "Comprehensive inventory management solution with barcode scanning and automated reordering. (Sample project for demonstration purposes)",
                "es": "Solución integral de gestión de inventario con escaneo de códigos de barras y reorden automatizado. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder demonstrates a potential inventory management system offering real-time stock tracking, barcode scanning integration, automated reorder points, multi-location support, and comprehensive reporting capabilities.",
                "es": "Este marcador demuestra un sistema potencial de gestión de inventario que ofrece seguimiento de stock en tiempo real, integración de escaneo de códigos de barras, puntos de reorden automatizados, soporte multi-ubicación y capacidades integrales de reportes."
            },
            "technologies": ["Java", "Spring Boot", "MySQL", "Angular", "JasperReports"],
            "startDate": "2024-02",
            "endDate": "2024-04",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/inventory.jpg",
                    "alt": {
                        "en": "Inventory management dashboard",
                        "es": "Panel de gestión de inventario"
                    },
                    "caption": {
                        "en": "Real-time stock monitoring interface",
                        "es": "Interfaz de monitoreo de stock en tiempo real"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-video-streaming",
            "slug": "video-streaming-platform",
            "title": {
                "en": "Video Streaming Platform [Placeholder]",
                "es": "Plataforma de Streaming de Video [Marcador]"
            },
            "summary": {
                "en": "Scalable video streaming service with adaptive bitrate and CDN integration. (Sample project for demonstration purposes)",
                "es": "Servicio de streaming de video escalable con bitrate adaptativo e integración CDN. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder illustrates a potential video streaming platform featuring adaptive bitrate streaming, CDN integration, video transcoding pipeline, user authentication, and comprehensive analytics for content consumption patterns.",
                "es": "Este marcador ilustra una plataforma potencial de streaming de video con streaming de bitrate adaptativo, integración CDN, pipeline de transcodificación de video, autenticación de usuario y análisis integral de patrones de consumo de contenido."
            },
            "technologies": ["Node.js", "HLS", "FFmpeg", "AWS S3", "CloudFront"],
            "startDate": "2024-08",
            "endDate": "2024-10",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/video-player.jpg",
                    "alt": {
                        "en": "Video player interface",
                        "es": "Interfaz de reproductor de video"
                    },
                    "caption": {
                        "en": "Adaptive streaming video player",
                        "es": "Reproductor de video con streaming adaptativo"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-calendar-scheduler",
            "slug": "collaborative-calendar-scheduler",
            "title": {
                "en": "Collaborative Calendar Scheduler [Placeholder]",
                "es": "Programador de Calendario Colaborativo [Marcador]"
            },
            "summary": {
                "en": "Team scheduling application with meeting coordination and calendar integration. (Sample project for demonstration purposes)",
                "es": "Aplicación de programación de equipo con coordinación de reuniones e integración de calendario. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder represents a potential collaborative scheduling solution offering team calendar management, meeting coordination, availability checking, calendar synchronization with external providers, and automated reminder systems.",
                "es": "Este marcador representa una solución potencial de programación colaborativa que ofrece gestión de calendario de equipo, coordinación de reuniones, verificación de disponibilidad, sincronización de calendario con proveedores externos y sistemas de recordatorios automatizados."
            },
            "technologies": ["React", "Node.js", "PostgreSQL", "Google Calendar API", "Outlook API"],
            "startDate": "2023-08",
            "endDate": "2023-10",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/calendar.jpg",
                    "alt": {
                        "en": "Calendar scheduling interface",
                        "es": "Interfaz de programación de calendario"
                    },
                    "caption": {
                        "en": "Team availability and meeting coordination",
                        "es": "Disponibilidad de equipo y coordinación de reuniones"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-document-processor",
            "slug": "document-processing-ocr",
            "title": {
                "en": "Document Processing with OCR [Placeholder]",
                "es": "Procesamiento de Documentos con OCR [Marcador]"
            },
            "summary": {
                "en": "Intelligent document processing system with OCR and automated data extraction. (Sample project for demonstration purposes)",
                "es": "Sistema inteligente de procesamiento de documentos con OCR y extracción automatizada de datos. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder demonstrates a potential document processing solution leveraging OCR technology for text extraction, intelligent form recognition, automated data classification, and structured data export for business process automation.",
                "es": "Este marcador demuestra una solución potencial de procesamiento de documentos aprovechando tecnología OCR para extracción de texto, reconocimiento inteligente de formularios, clasificación automatizada de datos y exportación de datos estructurados para automatización de procesos de negocio."
            },
            "technologies": ["Python", "Tesseract OCR", "OpenCV", "spaCy", "FastAPI"],
            "startDate": "2024-10",
            "endDate": "2024-12",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/ocr-processing.jpg",
                    "alt": {
                        "en": "Document processing workflow",
                        "es": "Flujo de trabajo de procesamiento de documentos"
                    },
                    "caption": {
                        "en": "Automated document recognition and extraction",
                        "es": "Reconocimiento y extracción automatizada de documentos"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-payment-gateway",
            "slug": "payment-processing-gateway",
            "title": {
                "en": "Payment Processing Gateway [Placeholder]",
                "es": "Gateway de Procesamiento de Pagos [Marcador]"
            },
            "summary": {
                "en": "Secure payment gateway integration supporting multiple payment providers. (Sample project for demonstration purposes)",
                "es": "Integración de gateway de pagos seguro que soporta múltiples proveedores de pago. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder illustrates a potential payment processing gateway offering multi-provider support, PCI-compliant transaction handling, fraud detection mechanisms, subscription billing, and comprehensive transaction reporting.",
                "es": "Este marcador ilustra un gateway potencial de procesamiento de pagos que ofrece soporte multi-proveedor, manejo de transacciones compatible con PCI, mecanismos de detección de fraude, facturación de suscripciones y reportes integrales de transacciones."
            },
            "technologies": ["Node.js", "Stripe API", "PayPal SDK", "Express", "MongoDB"],
            "startDate": "2024-11",
            "endDate": "2025-01",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/payment-ui.jpg",
                    "alt": {
                        "en": "Payment gateway interface",
                        "es": "Interfaz de gateway de pagos"
                    },
                    "caption": {
                        "en": "Secure payment processing workflow",
                        "es": "Flujo de trabajo de procesamiento de pagos seguro"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-social-analytics",
            "slug": "social-media-analytics",
            "title": {
                "en": "Social Media Analytics Tool [Placeholder]",
                "es": "Herramienta de Análisis de Redes Sociales [Marcador]"
            },
            "summary": {
                "en": "Comprehensive social media monitoring and analytics platform with sentiment analysis. (Sample project for demonstration purposes)",
                "es": "Plataforma integral de monitoreo y análisis de redes sociales con análisis de sentimiento. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder represents a potential social media analytics platform aggregating data from multiple social networks, performing sentiment analysis, tracking engagement metrics, identifying trending topics, and generating actionable insights for marketing strategies.",
                "es": "Este marcador representa una plataforma potencial de análisis de redes sociales que agrega datos de múltiples redes sociales, realiza análisis de sentimiento, rastrea métricas de engagement, identifica temas en tendencia y genera insights accionables para estrategias de marketing."
            },
            "technologies": ["Python", "Twitter API", "NLP", "Pandas", "Plotly"],
            "startDate": "2023-07",
            "endDate": "2023-09",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/social-dashboard.jpg",
                    "alt": {
                        "en": "Social analytics dashboard",
                        "es": "Panel de análisis social"
                    },
                    "caption": {
                        "en": "Engagement metrics and sentiment tracking",
                        "es": "Métricas de engagement y seguimiento de sentimiento"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        },
        {
            "id": "placeholder-knowledge-base",
            "slug": "searchable-knowledge-base",
            "title": {
                "en": "Searchable Knowledge Base System [Placeholder]",
                "es": "Sistema de Base de Conocimiento Buscable [Marcador]"
            },
            "summary": {
                "en": "Enterprise knowledge management system with full-text search and AI-powered recommendations. (Sample project for demonstration purposes)",
                "es": "Sistema empresarial de gestión de conocimiento con búsqueda de texto completo y recomendaciones impulsadas por IA. (Proyecto de ejemplo con fines demostrativos)"
            },
            "description": {
                "en": "This placeholder demonstrates a potential knowledge base solution featuring full-text search capabilities, AI-powered article recommendations, version control for documentation, collaborative editing, and analytics for content effectiveness and user engagement.",
                "es": "Este marcador demuestra una solución potencial de base de conocimiento con capacidades de búsqueda de texto completo, recomendaciones de artículos impulsadas por IA, control de versiones para documentación, edición colaborativa y análisis de efectividad de contenido y engagement de usuarios."
            },
            "technologies": ["Elasticsearch", "Node.js", "React", "PostgreSQL", "Redis"],
            "startDate": "2024-12",
            "endDate": "2025-02",
            "featured": False,
            "media": [
                {
                    "type": "image",
                    "src": "/media/projects/placeholder/knowledge-base.jpg",
                    "alt": {
                        "en": "Knowledge base search interface",
                        "es": "Interfaz de búsqueda de base de conocimiento"
                    },
                    "caption": {
                        "en": "Intelligent search and content discovery",
                        "es": "Búsqueda inteligente y descubrimiento de contenido"
                    }
                }
            ],
            "links": {
                "github": None,
                "demo": None,
                "caseStudy": None
            }
        }
    ]

    with open(DATA_DIR / 'projects.json', 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)
    print("Generated projects.json (3 real + 17 placeholder projects)")

def main():
    """Main generation function"""
    print("Generating content from resume_data.txt...")
    ensure_data_dir()

    generate_profile()
    generate_experience()
    generate_education()
    generate_skills()
    generate_certificates()
    generate_projects()

    print("\nAll content files generated successfully in backend/data/")

if __name__ == "__main__":
    main()
