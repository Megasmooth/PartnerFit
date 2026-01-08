export const TRANSLATIONS = {
    en: {
        appTitle: "PARTNERFIT",
        tagline: "STRATEGIC ENGINE",
        identity: {
            stepTitle: "IDENTITY SETUP",
            corpLabel: "CORPORATION",
            startupLabel: "STARTUP",
            corpPlaceholder: "Enter Corporate Name",
            startupPlaceholder: "Enter Startup Name",
            nextBtn: "INITIALIZE CALIBRATION"
        },
        calibration: {
            stepTitle: "FRICTION EQUALIZER",
            speed: "OPERATIONAL SPEED",
            speedDesc: "Decision making velocity & execution pace",
            risk: "RISK APPETITE",
            riskDesc: "Tolerance for failure & experimental mindset",
            cashflow: "CASH FLOW PRESSURE",
            cashflowDesc: "Runway sensitivity & payment terns urgency",
            ip: "IP GOVERNANCE",
            ipDesc: "Control over intellectual property & exclusivity",
            nextBtn: "RUN DIAGNOSIS"
        },
        diagnosis: {
            stepTitle: "SYNERGY DIAGNOSIS",
            scoreLabel: "SYNERGY SCORE",
            levelLabel: "LEVEL",
            optimal: "OPTIMAL",
            manageable: "MANAGEABLE",
            critical: "CRITICAL",
            frictionDetected: "FRICTION DETECTED",
            optimalZone: "OPTIMAL ZONES",
            exportCsv: "Export Analysis",
            share: "Share",
            print: "Print PDF",
            restart: "New Calibration",
            save: "Save to Portfolio"
        },
        portfolio: {
            title: "ANALYSIS PORTFOLIO",
            emptyState: "No analyses saved yet.",
            date: "DATE",
            corp: "CORPORATION",
            startup: "STARTUP",
            score: "SCORE",
            status: "STATUS",
            viewBtn: "VIEW REPORT"
        },
        nav: {
            home: "HOME",
            portfolio: "PORTFOLIO",
            lang: "BR/EN"
        }
    },
    pt: {
        appTitle: "PARTNERFIT",
        tagline: "MOTOR ESTRATÉGICO",
        identity: {
            stepTitle: "CONFIGURAÇÃO DE IDENTIDADE",
            corpLabel: "CORPORAÇÃO",
            startupLabel: "STARTUP",
            corpPlaceholder: "Nome da Corporação",
            startupPlaceholder: "Nome da Startup",
            nextBtn: "INICIALIZAR CALIBRAÇÃO"
        },
        calibration: {
            stepTitle: "EQUALIZADOR DE ATRITO",
            speed: "VELOCIDADE OPERACIONAL",
            speedDesc: "Velocidade de decisão e ritmo de execução",
            risk: "APETITE A RISCO",
            riskDesc: "Tolerância a falhas e mentalidade experimental",
            cashflow: "PRESSÃO DE CAIXA",
            cashflowDesc: "Sensibilidade de runway e urgência de pagamentos",
            ip: "GOVERNANÇA DE PI",
            ipDesc: "Controle sobre propriedade intelectual e exclusividade",
            nextBtn: "EXECUTAR DIAGNÓSTICO"
        },
        diagnosis: {
            stepTitle: "DIAGNÓSTICO DE SINERGIA",
            scoreLabel: "SCORE DE SINERGIA",
            levelLabel: "NÍVEL",
            optimal: "ÓTIMO",
            manageable: "GERENCIÁVEL",
            critical: "CRÍTICO",
            frictionDetected: "ATRITO DETECTADO",
            optimalZone: "ZONAS ÓTIMAS",
            exportCsv: "Exportar Análise",
            share: "Compartilhar",
            print: "Imprimir PDF",
            restart: "Nova Calibração",
            save: "Salvar no Portfólio"
        },
        portfolio: {
            title: "PORTFÓLIO DE ANÁLISES",
            emptyState: "Nenhuma análise salva ainda.",
            date: "DATA",
            corp: "CORPORAÇÃO",
            startup: "STARTUP",
            score: "SCORE",
            status: "STATUS",
            viewBtn: "VER RELATÓRIO"
        },
        nav: {
            home: "INÍCIO",
            portfolio: "PORTFÓLIO",
            lang: "BR/EN"
        }
    }
};

export type Language = 'en' | 'pt';
export type TranslationKeys = typeof TRANSLATIONS.en;
