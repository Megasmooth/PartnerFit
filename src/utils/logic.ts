import { useMemo } from 'react';
import { ActorProfile, DIMENSIONS } from '../types';

export function useSynergyScore(corp: ActorProfile, startup: ActorProfile) {
    const result = useMemo(() => {
        let totalWeightedDelta = 0;
        let maxPossibleWeightedDelta = 0;
        const dimensionAnalysis = [];

        for (const dim of DIMENSIONS) {
            const corpVal = corp.values[dim.id];
            const startVal = startup.values[dim.id];
            const delta = Math.abs(corpVal - startVal);

            const weightedDelta = delta * dim.weight;
            const maxDelta = 9 * dim.weight; // Max difference is 9 (10-1)

            totalWeightedDelta += weightedDelta;
            maxPossibleWeightedDelta += maxDelta;

            let status: 'optimal' | 'manageable' | 'critical' = 'optimal';
            if (delta > 6) status = 'critical';
            else if (delta > 3) status = 'manageable';

            dimensionAnalysis.push({
                ...dim,
                delta,
                status,
                corpVal,
                startVal
            });
        }

        // Score calculation: 100 - (percentage of friction)
        const frictionRatio = totalWeightedDelta / maxPossibleWeightedDelta;
        const score = Math.round(100 * (1 - frictionRatio));

        return {
            score,
            dimensionAnalysis,
            isCompatible: score > 60
        };
    }, [corp, startup]);

    return result;
}
