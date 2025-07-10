import React, { useState } from 'react';

const TextElement = ({ initialText, onTextChange }) => {
    const [text, setText] = useState(initialText);

    const handleChange = (event) => {
        const newText = event.target.value;
        setText(newText);
        onTextChange(newText);
    };

    return (
        <textarea
            value={text}
            onChange={handleChange}
            style={{ width: '100%', height: '100px', resize: 'none' }}
        />
    );
};

export default TextElement;