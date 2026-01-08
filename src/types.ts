export type ActorType = 'corp' | 'startup';

export interface EcosystemValues {
    speed: number;
    risk: number;
    cashflow: number;
    ip: number;
}

export interface ActorProfile {
    name: string;
    values: EcosystemValues;
}

export interface DimensionConfig {
    id: keyof EcosystemValues;
    label: string;
    corpLabel: string;
    startupLabel: string;
    weight: number;
    description: string;
}

export const DIMENSIONS: DimensionConfig[] = [
    {
        id: 'speed',
        label: 'Speed (Time-to-Decision)',
        corpLabel: 'Bureaucracy / Committees',
        startupLabel: 'Agility / Autonomy',
        weight: 3,
        description: 'How fast decisions are made and executed.'
    },
    {
        id: 'risk',
        label: 'Risk Appetite',
        corpLabel: 'Failure Intolerant',
        startupLabel: 'Fail Fast / Learn',
        weight: 2,
        description: 'Tolerance for failure and experimental scope.'
    },
    {
        id: 'cashflow',
        label: 'Cash Flow',
        corpLabel: 'Net 90/120 Days',
        startupLabel: 'Upfront / D+15',
        weight: 4,
        description: 'Payment terms and financial pressure.'
    },
    {
        id: 'ip',
        label: 'IP Governance',
        corpLabel: 'Exclusive / Owned',
        startupLabel: 'Licensed / Shared',
        weight: 3,
        description: 'Ownership of Intellectual Property developed.'
    }
];
