import React from 'react';

const ImageElement = ({ src, alt, onDelete }) => {
    return (
        <div className="image-element">
           <img src={src} alt={alt} className="max-w-full h-auto rounded-md my-4" />
            <button onClick={onDelete}>Delete</button>
        </div>
    );
};

export default ImageElement;