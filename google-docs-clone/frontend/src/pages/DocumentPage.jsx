import React from 'react';
import CollaborativeEditor from '../components/CollaborativeEditor';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const DocumentPage = () => {
    const { isDark } = useTheme();
    
    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Header */}
            <header className={`flex justify-between items-center p-4 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Collaborative Document Editor
                </h1>
                <ThemeToggle />
            </header>
            
            <CollaborativeEditor />
        </div>
    );
};

export default DocumentPage;
