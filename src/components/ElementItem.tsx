import React, { useRef, useState, useEffect } from 'react';
import Icon from '@mdi/react';
import { useEditorStore, type EditorElement } from '../store/editorStore';
import { getIconPath } from '../utils/iconMapping';
import { clsx } from 'clsx';

interface ElementItemProps {
    element: EditorElement;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ElementItem: React.FC<ElementItemProps> = ({ element, containerRef }) => {
    const { updateElement, selectElement, selectedElementId } = useEditorStore();
    const [isDragging, setIsDragging] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    const isSelected = selectedElementId === element.id;

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectElement(element.id);
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();

            // Calculate percentage position relative to container
            // x = ((e.clientX - containerRect.left) / containerRect.width) * 100
            // y = ((e.clientY - containerRect.top) / containerRect.height) * 100

            let x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            let y = ((e.clientY - containerRect.top) / containerRect.height) * 100;

            // Clamp values? Maybe not, allow placing outside slightly
            x = Math.max(0, Math.min(100, x));
            y = Math.max(0, Math.min(100, y));

            updateElement(element.id, { x, y });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, element.id, containerRef, updateElement]);

    const iconPath = getIconPath(element.config.icon || (element.type === 'state-icon' ? 'mdi:help-circle' : ''));
    const styles = element.config.style || {};

    const renderContent = () => {
        switch (element.type) {
            case 'state-label':
                const labelText = element.config.prefix || '';
                const labelSuffix = element.config.suffix || '';
                return (
                    <div className="whitespace-nowrap px-1 select-none flex items-center gap-1">
                        {labelText && <span className="opacity-70 text-[0.8em]">{labelText}</span>}
                        <span>{element.config.text || 'State'}</span>
                        {labelSuffix && <span className="opacity-70 text-[0.8em]">{labelSuffix}</span>}
                    </div>
                );
            case 'state-badge':
                return (
                    <div className="w-12 h-12 rounded-full border-2 border-orange-500 bg-gray-900/80 flex flex-col items-center justify-center text-[8px] font-bold overflow-hidden shadow-lg p-1 text-center">
                        <div className="text-gray-400 truncate w-full uppercase leading-none mb-0.5" style={{ fontSize: '5px' }}>{element.config.entity?.split('.')[1] || 'Entity'}</div>
                        <div className="text-orange-400 leading-none">21°</div>
                        <div className="text-gray-500 font-normal leading-none mt-0.5" style={{ fontSize: '6px' }}>Temp</div>
                    </div>
                );
            case 'image':
                return (
                    <div
                        className="relative overflow-hidden group/img"
                        style={{
                            width: styles.width || '100px',
                            height: styles.height || 'auto',
                            aspectRatio: element.config.aspect_ratio?.replace(':', '/')
                        }}
                    >
                        <img
                            src={element.config.image || element.config.camera_image || 'https://demo.home-assistant.io/stub_config/bedroom.png'}
                            alt="overlay"
                            className="w-full h-full object-cover rounded-[inherit]"
                            style={{ filter: element.config.filter }}
                        />
                        {!element.config.image && !element.config.camera_image && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white">
                                Image Placeholder
                            </div>
                        )}
                    </div>
                );
            case 'conditional':
                return (
                    <div
                        className={clsx(
                            "min-w-[60px] min-h-[40px] border-2 border-dashed border-yellow-500/50 rounded p-2",
                            isSelected ? "bg-yellow-500/10" : "bg-transparent"
                        )}
                    >
                        <div className="absolute -top-4 left-0 text-[8px] font-bold bg-yellow-500 text-black px-1 rounded uppercase">Conditional Group</div>
                        {/* Nested Elements */}
                        <div className="relative w-full h-full">
                            {element.elements?.map(child => (
                                <ElementItem
                                    key={child.id}
                                    element={child}
                                    containerRef={elementRef as React.RefObject<HTMLDivElement>}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'icon':
            case 'state-icon':
            default:
                const iconSize = styles['--mdc-icon-size'] || styles.width || '24px';
                return (
                    <div style={{
                        width: iconSize,
                        height: iconSize,
                        color: styles['--paper-item-icon-color'] || 'white',
                        filter: styles.filter
                    }} className="flex items-center justify-center">
                        <Icon path={iconPath} size={undefined} style={{ width: '100%', height: '100%' }} color="currentColor" />
                    </div>
                );
        }
    };

    return (
        <div
            ref={elementRef}
            onMouseDown={handleMouseDown}
            style={{
                position: 'absolute',
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: 'translate(-50%, -50%)',
                ...styles
            }}
            className={clsx(
                "cursor-move transition-all",
                isSelected ? "ring-2 ring-blue-500 z-10 scale-[1.02]" : "z-0",
                !['conditional'].includes(element.type) && "hover:ring-2 hover:ring-blue-400/50"
            )}
            title={element.config.entity || 'No Entity'}
        >
            {renderContent()}
        </div>
    );
};
