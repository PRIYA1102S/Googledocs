import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import { useTheme } from '../contexts/ThemeContext';
import 'react-quill/dist/quill.snow.css';

const CollaborativeTextElement = ({ content, onChange, onSelectionChange, isReadOnly = false }) => {
    const [value, setValue] = useState(content);
    const { isDark } = useTheme();
    const quillRef = useRef(null);
    const isRemoteChangeRef = useRef(false);
    const lastChangeSourceRef = useRef('user');
    const cursorPositionRef = useRef(null);
    const isUserTypingRef = useRef(false);
    const isInitializedRef = useRef(false);

    // Initialize component with content
    useEffect(() => {
        if (!isInitializedRef.current && content) {
            setValue(content);
            isInitializedRef.current = true;
        }
    }, [content]);

    useEffect(() => {
        // Only update if content is actually different and not from user typing
        if (content !== value && !isUserTypingRef.current && isInitializedRef.current) {
            // Save current cursor position before updating
            if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                const selection = quill.getSelection();
                if (selection) {
                    cursorPositionRef.current = {
                        index: selection.index,
                        length: selection.length
                    };
                }
            }
            
            setValue(content);
            isRemoteChangeRef.current = true;
            
            // Restore cursor position after content update
            setTimeout(() => {
                if (quillRef.current && cursorPositionRef.current !== null) {
                    const quill = quillRef.current.getEditor();
                    const length = quill.getLength();
                    const position = Math.min(cursorPositionRef.current.index, length - 1);
                    const selectionLength = Math.min(cursorPositionRef.current.length, length - position);
                    quill.setSelection(position, selectionLength);
                    cursorPositionRef.current = null;
                }
            }, 0);
        }
    }, [content, value]);

    const handleChange = useCallback((val, delta, source, editor) => {
        if (source === 'user' && !isReadOnly) {
            isUserTypingRef.current = true;
            setValue(val);
            if (onChange) {
                onChange(val);
            }
            
            // Emit selection change for cursor tracking
            if (onSelectionChange && quillRef.current) {
                const quill = quillRef.current.getEditor();
                const selection = quill.getSelection();
                if (selection) {
                    onSelectionChange(selection);
                }
            }
            
            // Reset the typing flag after a short delay
            setTimeout(() => {
                isUserTypingRef.current = false;
            }, 150);
        }
    }, [onChange, onSelectionChange, isReadOnly]);

    const handleSelectionChange = useCallback((range, source, editor) => {
        if (source === 'user' && range && onSelectionChange) {
            onSelectionChange(range);
        }
    }, [onSelectionChange]);

    // Method to apply remote changes
    const applyRemoteChange = useCallback((newContent) => {
        isRemoteChangeRef.current = true;
        setValue(newContent);
    }, []);

    // Note: we no longer rely on imperative handle from parent; the component
    // reacts to prop changes directly to display remote edits.

    // Enhanced custom styles for dark mode
    const customStyles = `
        .ql-editor {
            ${isDark ? 'color: #f1f5f9; background-color: #1e293b;' : 'color: #1e293b; background-color: #ffffff;'}
            min-height: 200px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
        }
        .ql-editor.ql-blank::before {
            ${isDark ? 'color: #94a3b8;' : 'color: #9ca3af;'}
            font-style: italic;
        }
        .ql-toolbar {
            ${isDark ? 'background-color: #334155; border-color: #475569;' : 'background-color: #f8fafc; border-color: #e2e8f0;'}
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .ql-container {
            ${isDark ? 'border-color: #475569;' : 'border-color: #e2e8f0;'}
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
        .ql-toolbar button {
            ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
            transition: all 0.2s ease;
        }
        .ql-toolbar button:hover {
            ${isDark ? 'color: #60a5fa; background-color: #475569;' : 'color: #3b82f6; background-color: #e2e8f0;'}
            border-radius: 4px;
        }
        .ql-toolbar .ql-active {
            ${isDark ? 'color: #60a5fa; background-color: #475569;' : 'color: #3b82f6; background-color: #dbeafe;'}
            border-radius: 4px;
        }
        .ql-toolbar .ql-picker {
            ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
        }
        .ql-toolbar .ql-picker:hover {
            ${isDark ? 'color: #60a5fa;' : 'color: #3b82f6;'}
        }
        .ql-toolbar .ql-picker-label {
            ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
            transition: all 0.2s ease;
        }
        .ql-toolbar .ql-picker-label:hover {
            ${isDark ? 'color: #60a5fa;' : 'color: #3b82f6;'}
        }
        .ql-toolbar .ql-picker-options {
            ${isDark ? 'background-color: #475569; border-color: #64748b;' : 'background-color: #ffffff; border-color: #e2e8f0;'}
            border-radius: 6px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .ql-toolbar .ql-picker-item {
            ${isDark ? 'color: #e2e8f0;' : 'color: #475569;'}
            transition: all 0.2s ease;
        }
        .ql-toolbar .ql-picker-item:hover {
            ${isDark ? 'color: #60a5fa; background-color: #64748b;' : 'color: #3b82f6; background-color: #f1f5f9;'}
        }
        .ql-toolbar .ql-stroke {
            ${isDark ? 'stroke: #e2e8f0;' : 'stroke: #475569;'}
            transition: stroke 0.2s ease;
        }
        .ql-toolbar .ql-fill {
            ${isDark ? 'fill: #e2e8f0;' : 'fill: #475569;'}
            transition: fill 0.2s ease;
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
        
        /* Collaborative cursor styles */
        .ql-cursor {
            position: absolute;
            width: 2px;
            background-color: #3b82f6;
            z-index: 10;
        }
        .ql-cursor-name {
            position: absolute;
            top: -20px;
            left: 0;
            background-color: #3b82f6;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 11;
        }
        
        /* Selection highlight for other users */
        .ql-selection {
            background-color: rgba(59, 130, 246, 0.2);
            position: absolute;
            z-index: 5;
        }
    `;

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'blockquote', 'code-block'],
            ['clean']
        ]
    };

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet', 'indent',
        'align', 'link', 'blockquote', 'code-block'
    ];

    return (
        <>
            <style>{customStyles}</style>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={value}
                    onChange={handleChange}
                    onChangeSelection={handleSelectionChange}
                    modules={isReadOnly ? { toolbar: false } : modules}
                    formats={formats}
                    readOnly={isReadOnly}
                    placeholder={isReadOnly ? "This document is read-only" : "Start typing your document..."}
                />
            </div>
        </>
    );
};

export default CollaborativeTextElement;