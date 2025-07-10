import React from 'react';

const ImageElement = ({ src, alt, onDelete }) => {
    return (
        <div className="image-element">
            <img src={src} alt={alt} />
            <button onClick={onDelete}>Delete</button>
        </div>
    );
};

export default ImageElement;