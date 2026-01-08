import { EcosystemValues } from '../types';

export interface SavedAnalysis {
    id: string;
    createdAt: number;
    corpName: string;
    startupName: string;
    score: number;
    riskLevel: 'OPTIMAL' | 'MANAGEABLE' | 'CRITICAL';
    corpValues: EcosystemValues;
    startupValues: EcosystemValues;
}

const STORAGE_KEY = 'partnerfit_vault_v1';

export const storage = {
    save: (analysis: SavedAnalysis) => {
        const existing = storage.getAll();
        const updated = [analysis, ...existing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },

    getAll: (): SavedAnalysis[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load portfolio', e);
            return [];
        }
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
