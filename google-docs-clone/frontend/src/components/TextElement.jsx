import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useTheme } from '../contexts/ThemeContext';
import 'react-quill/dist/quill.snow.css';

const TextElement = ({ content, onChange }) => {
    const [value, setValue] = useState(content);
    const { isDark } = useTheme();

    useEffect(() => {
        setValue(content);
    }, [content]);

    const handleChange = (val) => {
        setValue(val);
        onChange(val); 
    };

    // Custom styles for dark mode
    const customStyles = `
        .ql-editor {
            ${isDark ? 'color: #f1f5f9; background-color: #1e293b;' : 'color: #1e293b; background-color: #ffffff;'}
            min-height: 200px;
        }
        .ql-toolbar {
            ${isDark ? 'background-color: #334155; border-color: #475569;' : 'background-color: #f8fafc; border-color: #e2e8f0;'}
        }
        .ql-toolbar button {
            ${isDark ? 'color: #f1f5f9;' : 'color: #475569;'}
        }
        .ql-toolbar button:hover {
            ${isDark ? 'color: #60a5fa;' : 'color: #3b82f6;'}
        }
        .ql-toolbar .ql-active {
            ${isDark ? 'color: #60a5fa;' : 'color: #3b82f6;'}
        }
        .ql-container {
            ${isDark ? 'border-color: #475569;' : 'border-color: #e2e8f0;'}
        }
    `;

    return (
        <>
            <style>{customStyles}</style>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={handleChange}
                    modules={{
                        toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['clean']
                        ]
                    }}
                />
            </div>
        </>
    );
};

export default TextElement;
