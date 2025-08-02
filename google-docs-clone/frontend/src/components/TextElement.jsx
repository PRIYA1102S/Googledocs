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

    // Enhanced custom styles for dark mode
    const customStyles = `
        .ql-editor {
            ${isDark ? 'color: #f1f5f9; background-color: #1e293b;' : 'color: #1e293b; background-color: #ffffff;'}
            min-height: 200px;
        }
        .ql-editor.ql-blank::before {
            ${isDark ? 'color: #94a3b8;' : 'color: #9ca3af;'}
        }
        .ql-toolbar {
            ${isDark ? 'background-color: #334155; border-color: #475569;' : 'background-color: #f8fafc; border-color: #e2e8f0;'}
        }
        .ql-toolbar button {
            ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
        }
        .ql-toolbar button:hover {
            ${isDark ? 'color: #60a5fa; background-color: #475569;' : 'color: #3b82f6; background-color: #e2e8f0;'}
        }
        .ql-toolbar .ql-active {
            ${isDark ? 'color: #60a5fa; background-color: #475569;' : 'color: #3b82f6; background-color: #dbeafe;'}
        }
        .ql-toolbar .ql-picker {
            ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
        }
        .ql-toolbar .ql-picker:hover {
            ${isDark ? 'color: #60a5fa;' : 'color: #3b82f6;'}
        }
        .ql-toolbar .ql-picker-label {
            ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
        }
        .ql-toolbar .ql-picker-label:hover {
            ${isDark ? 'color: #60a5fa;' : 'color: #3b82f6;'}
        }
        .ql-toolbar .ql-picker-options {
            ${isDark ? 'background-color: #475569; border-color: #64748b;' : 'background-color: #ffffff; border-color: #e2e8f0;'}
        }
        .ql-toolbar .ql-picker-item {
            ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
        }
        .ql-toolbar .ql-picker-item:hover {
            ${isDark ? 'color: #60a5fa; background-color: #64748b;' : 'color: #3b82f6; background-color: #f1f5f9;'}
        }
        .ql-toolbar .ql-stroke {
            ${isDark ? 'stroke: #e2e8f0;' : 'stroke: #475569;'}
        }
        .ql-toolbar .ql-fill {
            ${isDark ? 'fill: #e2e8f0;' : 'fill: #475569;'}
        }
        .ql-toolbar .ql-picker-label:hover .ql-stroke,
        .ql-toolbar button:hover .ql-stroke {
            ${isDark ? 'stroke: #60a5fa;' : 'stroke: #3b82f6;'}
        }
        .ql-toolbar .ql-picker-label:hover .ql-fill,
        .ql-toolbar button:hover .ql-fill {
            ${isDark ? 'fill: #60a5fa;' : 'fill: #3b82f6;'}
        }
        .ql-toolbar .ql-active .ql-stroke {
            ${isDark ? 'stroke: #60a5fa;' : 'stroke: #3b82f6;'}
        }
        .ql-toolbar .ql-active .ql-fill {
            ${isDark ? 'fill: #60a5fa;' : 'fill: #3b82f6;'}
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
