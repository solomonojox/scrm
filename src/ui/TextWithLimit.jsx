import { useState } from 'react';

const TextWithLimit = ({ label, text }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const textLimit = 100; // Limit to 100 characters

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex justify-between text-sm text-gray-500 mb-2">
            {/* Dynamically render label */}
            <span className="font-bold w-[35%] text-left">{label}:</span>
            <span className="w-[60%] ">
                {/* Show truncated text if not expanded */}
                {isExpanded ? text : `${text.slice(0, textLimit)}...`}

                {/* Inline "View More" or "View Less" as text, after the ellipsis */}
                {text.length > textLimit && (
                    <span
                        className="text-blue-500 ml-1 cursor-pointer"
                        onClick={handleToggle}
                    >
                        {isExpanded ? 'View Less' : 'View More'}
                    </span>
                )}
            </span>
        </div>
    );
};

export { TextWithLimit };