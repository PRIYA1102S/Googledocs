import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextElement = ({ content, onChange }) => {
    const [value, setValue] = useState(content);

    useEffect(() => {
        setValue(content);
    }, [content]);

    const handleChange = (val) => {
        setValue(val);
        onChange(val); 
    };

    return (
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
    );
};

export default TextElement;
