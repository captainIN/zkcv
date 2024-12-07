import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = ({ title, children, isOpen, onToggle }: any) => (
    <div className="border rounded-lg">
        <button
            className="w-full px-4 py-3 flex justify-between items-center text-left font-semibold bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            onClick={onToggle}
        >
            {title}
            {/* @ts-ignore */}
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {isOpen && (
            <div className="p-4 bg-base-200 rounded-b-lg border-t">
                {children}
            </div>
        )}
    </div>
);
export default Accordion