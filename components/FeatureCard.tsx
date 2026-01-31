'use client';

import { ReactNode } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    gradient?: string;
}

export default function FeatureCard({ icon, title, description, gradient = 'from-gratitude-500 to-gratitude-600' }: FeatureCardProps) {
    return (
        <div className="group card-gradient p-6 hover-lift cursor-pointer">
            <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gratitude-600 transition-colors">
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
