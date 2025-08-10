'use client';

import { transportModes } from '../mockdata';

export default function TransportModes() {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {transportModes.map((mode) => (
                <div key={mode.id} className="relative group overflow-hidden rounded-lg aspect-[5/3] bg-gray-300">
                    {/* Gray placeholder instead of image */}
                    <div className="absolute inset-0 w-full h-full bg-gray-500" />
                    {/* <div className={`absolute inset-0 bg-gradient-to-r ${mode.bgStyle} to-transparent`} /> */}

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-4 h-4 bg-white/20 rounded-full border border-white backdrop-blur-sm flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs text-gray-900">
                                Blockchain
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="text-white font-medium">{mode.title}</span>
                            <span className="text-white text-sm">{mode.id}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
