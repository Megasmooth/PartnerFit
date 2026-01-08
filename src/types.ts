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
    weight: number;
}

export const DIMENSIONS: DimensionConfig[] = [
    {
        id: 'speed',
        weight: 3,
    },
    {
        id: 'risk',
        weight: 2,
    },
    {
        id: 'cashflow',
        weight: 4,
    },
    {
        id: 'ip',
        weight: 3,
    }
];
