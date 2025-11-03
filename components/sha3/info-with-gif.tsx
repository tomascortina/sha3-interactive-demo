'use client';

import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface InfoWithGifProps {
    sectionNumber: number;
    title: string;
    gifUrl: string;
    gifAlt: string;
    content: React.ReactNode;
}

export function InfoWithGif({
    sectionNumber,
    title,
    gifUrl,
    gifAlt,
    content,
}: InfoWithGifProps) {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xl shadow-lg">
                    {sectionNumber}
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">{title}</h2>
                </div>
            </div>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row items-center gap-8 p-8">
                        {/* GIF on the left */}
                        <div className="flex-1 flex justify-center">
                            <div className="w-full max-w-2xl h-72 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                                <img
                                    src={gifUrl || '/placeholder.svg'}
                                    alt={gifAlt}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Content on the right */}
                        <div className="flex-1 space-y-4 text-slate-300">
                            {content}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
