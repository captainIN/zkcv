import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Experience {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
    proofJSON?: any;
}

const ExperienceCard: React.FC<Experience> = ({
    title,
    company,
    startDate,
    endDate,
    description,
    proofJSON
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { proof, publicData } = JSON.parse(proofJSON);

    return (
        <div className="border border-base-300 rounded-xl overflow-hidden bg-base-100 hover:border-primary transition-colors duration-300">
            <div className="p-6">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="text-base-content/80 font-medium">{company}</div>
                <div className="text-sm text-base-content/60">
                    {startDate} - {endDate || 'Present'}
                </div>
                <p className="mt-4 text-base-content/80">{description}</p>

                <div className="mt-4 border-t pt-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 text-success text-sm w-full justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success"></div>
                            Verified with ZK Email
                        </div>
                        {/* @ts-ignore */}
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isOpen && (
                        <div className="mt-4 p-4 bg-base-200 rounded-lg text-sm space-y-2">
                            <div className="flex flex-col gap-2">
                                <span className="text-base-content/60">Public data:</span>
                                <pre className="whitespace-pre-wrap break-all bg-base-300 p-2 rounded-lg font-mono text-xs">
                                    {JSON.stringify(publicData, null, 2)}
                                </pre>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-base-content/60">Proof:</span>
                                <pre className="whitespace-pre-wrap break-all bg-base-300 p-2 rounded-lg font-mono text-xs">
                                    {JSON.stringify(proof, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperienceCard;