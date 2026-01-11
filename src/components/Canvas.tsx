import React, { useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { clsx } from 'clsx';
import { ElementItem } from './ElementItem';

export const Canvas: React.FC = () => {
    const { backgroundImage, setBackgroundImage, elements, selectElement } = useEditorStore();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [zoom, setZoom] = useState(1);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const divRef = useRef<HTMLDivElement>(null);

    // URL Import state
    const [imageUrlInput, setImageUrlInput] = useState('');

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            selectElement(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setBackgroundImage(e.target?.result as string);
                setZoom(1); // Reset zoom on new image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setBackgroundImage(e.target?.result as string);
                setZoom(1);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlImport = () => {
        if (imageUrlInput) {
            setBackgroundImage(imageUrlInput);
            setZoom(1);
            setImageUrlInput('');
        }
    };

    return (
        <div
            className={clsx(
                "flex-1 bg-gray-900 relative overflow-hidden flex flex-col transition-colors",
                isDraggingOver && "bg-gray-800 ring-4 ring-blue-500 ring-inset"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {/* Toolbar / Zoom Controls */}
            {backgroundImage && (
                <div className="absolute top-4 right-4 z-50 bg-gray-800 rounded shadow-lg p-2 flex items-center gap-2 border border-gray-700 text-white">
                    <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="p-1 hover:bg-gray-700 rounded">-</button>
                    <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1 hover:bg-gray-700 rounded">+</button>
                    <button onClick={() => setZoom(1)} className="text-xs text-gray-400 hover:text-white ml-2">Reset</button>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="flex-1 overflow-auto flex items-center justify-center p-8">
                <div
                    className={clsx(
                        "relative shadow-lg transition-transform duration-200 origin-center",
                        !backgroundImage && "w-[800px] aspect-[16/9] bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center"
                    )}
                    style={{ transform: `scale(${zoom})` }}
                >
                    {backgroundImage ? (
                        <>
                            <img
                                src={backgroundImage}
                                alt="Floorplan"
                                className="block max-w-none"
                                style={{
                                    pointerEvents: 'none',
                                    userSelect: 'none'
                                }}
                                draggable={false}
                            />
                            <div
                                ref={divRef as React.RefObject<HTMLDivElement>}
                                onClick={handleBackgroundClick}
                                className="absolute inset-0 z-0"
                            >
                                {elements.map(el => (
                                    <ElementItem
                                        key={el.id}
                                        element={el}
                                        containerRef={divRef as React.RefObject<HTMLDivElement>}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                            <p className="text-lg mb-4 font-medium text-gray-300">Start by adding a floorplan</p>
                            <div className="flex flex-col gap-4 w-full max-w-xs pointer-events-auto">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-900/20"
                                >
                                    Upload Image
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="h-px bg-gray-600 flex-1"></span>
                                    <span className="text-xs text-gray-500 uppercase">OR import URL</span>
                                    <span className="h-px bg-gray-600 flex-1"></span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={imageUrlInput}
                                        onChange={(e) => setImageUrlInput(e.target.value)}
                                        placeholder="https://example.com/plan.png"
                                        className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        onClick={handleUrlImport}
                                        disabled={!imageUrlInput}
                                        className="px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        Go
                                    </button>
                                </div>
                            </div>
                            <div
                                ref={divRef as React.RefObject<HTMLDivElement>}
                                onClick={handleBackgroundClick}
                                className="absolute inset-0 z-0 pointer-events-none"
                            >
                                {elements.map(el => (
                                    <div key={el.id} className="pointer-events-auto">
                                        <ElementItem
                                            element={el}
                                            containerRef={divRef as React.RefObject<HTMLDivElement>}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
