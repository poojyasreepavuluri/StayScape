import { useState, useEffect } from 'react';

const ImageGalleryModal = ({ images, startIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.9)',
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="btn text-white fs-4"
                style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none' }}
            >
                ✕
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="btn text-white fs-2"
                style={{ position: 'absolute', left: '20px', background: 'none', border: 'none' }}
            >
                ‹
            </button>

            <img
                src={images[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                style={{ maxHeight: '85vh', maxWidth: '85vw', objectFit: 'contain', borderRadius: '8px' }}
                onClick={(e) => e.stopPropagation()}
            />

            <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="btn text-white fs-2"
                style={{ position: 'absolute', right: '20px', background: 'none', border: 'none' }}
            >
                ›
            </button>

            <div
                className="text-white"
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}
            >
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

export default ImageGalleryModal;