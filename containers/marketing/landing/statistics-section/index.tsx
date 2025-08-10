'use client';

import StatisticsGrid from './components/statistics-grid';
import TransportModes from './components/transport-modes';
import ContentSlider from './components/content-slider';

export default function StatisticsSection() {
    return (
        <section className="py-16 px-6 font-instrument">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Statistics Grid */}
                <StatisticsGrid />

                {/* Transport Section */}
                <TransportModes />

                {/* Content Section */}
                <ContentSlider />
            </div>
        </section>
    );
}
