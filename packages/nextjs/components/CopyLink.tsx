import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const CopyLink = ({ link }: any) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex items-center gap-2 rounded-lg p-2 max-w-[530px] w-full border border-gray-200">
            <span className="text-gray-600 font-medium">SHARE:</span>
            <input
                type="text"
                value={link}
                readOnly
                className="bg-transparent flex-1 outline-none text-sm truncate"
            />
            <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Copy link"
            >
                {/* @ts-ignore */}
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-600 hover:text-gray-800" />
                }
            </button>
        </div>
    );
};

export default CopyLink;