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

    const iconPath = getIconPath(element.config.icon);
    const styles = element.config.style || {};

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
                "cursor-move transition-shadow hover:ring-2 hover:ring-blue-400/50",
                element.type === 'icon' && "rounded-full",
                isSelected ? "ring-2 ring-blue-500 z-10" : "z-0"
            )}
            title={element.config.entity || 'No Entity'}
        >
            {element.type === 'label' ? (
                <div className="whitespace-nowrap px-1 select-none font-bold">
                    {/* Mock value for label */}
                    {element.config.text || 'State'}
                </div>
            ) : (
                <div style={{
                    width: styles['--mdc-icon-size'],
                    height: styles['--mdc-icon-size']
                }}>
                    <Icon path={iconPath} size={styles['--mdc-icon-size'] ? undefined : 1} style={{ width: '100%', height: '100%' }} color="currentColor" />
                </div>
            )}
        </div>
    );
};
