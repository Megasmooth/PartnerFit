import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { ActorProfile, DIMENSIONS } from '../types';

interface DiagnosisRadarProps {
    corp: ActorProfile;
    startup: ActorProfile;
    labels: any;
}

const DiagnosisRadar: React.FC<DiagnosisRadarProps> = ({ corp, startup, labels }) => {
    const data = DIMENSIONS.map(dim => ({
        subject: labels.calibration.dimensions[dim.id].label,
        A: corp.values[dim.id as keyof typeof corp.values],
        B: startup.values[dim.id as keyof typeof startup.values],
        fullMark: 10,
    }));

    return (
        <div className="w-full h-[400px] glass-panel rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h3 className="absolute top-4 left-6 text-gray-500 font-mono text-xs tracking-widest">FRICTION_RADAR_V2.0</h3>

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#ddd', fontSize: 11, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                    />

                    <Radar
                        name={corp.name || "Corporate"}
                        dataKey="A"
                        stroke="#00FFFF"
                        fill="#00FFFF"
                        fillOpacity={0.4}
                        animationDuration={1500}
                    />
                    <Radar
                        name={startup.name || "Startup"}
                        dataKey="B"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.4}
                        animationDuration={1500}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                </RadarChart>
            </ResponsiveContainer>

            <div className="absolute bottom-4 right-6 flex gap-4 text-[10px] font-bold tracking-widest uppercase">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-vault-corp shadow-[0_0_8px_#00FFFF]"></div>
                    <span className="text-gray-500">{labels.identity.corpLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-vault-startup shadow-[0_0_8px_#22c55e]"></div>
                    <span className="text-gray-500">{labels.identity.startupLabel}</span>
                </div>
            </div>
        </div>
    );
};

export default DiagnosisRadar;
