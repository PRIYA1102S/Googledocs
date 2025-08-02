import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ImageElement = ({ src, alt, onDelete }) => {
    const { isDark } = useTheme();
    
    return (
        <div className={`image-element relative group ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4`}>
            <img src={src} alt={alt} className="max-w-full h-auto rounded-md my-4" />
            <button 
                onClick={onDelete}
                className={`absolute top-2 right-2 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isDark 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
            >
                Delete
            </button>
        </div>
    );
};

export default ImageElement;