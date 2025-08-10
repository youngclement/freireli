'use client';

import { statisticsData } from '../mockdata';

export default function StatisticsGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {statisticsData.map((stat, index) => (
                <div key={index} className="text-left space-y-2 items-start">
                    <div className="text-xs opacity-60 uppercase tracking-wider text-gray-900 dark:text-white">
                        {stat.label}
                    </div>
                    <div className="self-stretch text-black dark:text-white font-instrument text-[2.60344rem] font-bold leading-[140%] tracking-[-0.02606rem]">
                        {stat.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
