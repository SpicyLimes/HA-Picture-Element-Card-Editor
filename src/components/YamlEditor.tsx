import React, { useEffect, useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { generateYaml } from '../utils/yaml-generator';
import yaml from 'js-yaml';

export const YamlEditor: React.FC = () => {
    const { elements, backgroundImage, setElements, setBackgroundImage } = useEditorStore();
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Update code when elements or background changes
    useEffect(() => {
        const generated = generateYaml(elements, backgroundImage || '');
        setCode(generated);
    }, [elements, backgroundImage]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newCode = e.target.value;
        setCode(newCode);

        try {
            const parsed: any = yaml.load(newCode);
            if (parsed && typeof parsed === 'object') {
                setError(null);

                // Update Background
                if (parsed.image && parsed.image !== '/local/floorplan.png' && parsed.image !== '/your/image/path.png') {
                    // Only update if it looks like a real URL/path, don't overwrite with placeholder if we have a data URL?
                    // actually, better to just update it. If user types a path, we show that path (broken image likely, but correct state)
                    setBackgroundImage(parsed.image);
                }

                // Update Elements
                if (Array.isArray(parsed.elements)) {
                    const newElements = parsed.elements.map((el: any) => {
                        const style = el.style || {};
                        const x = parseFloat(String(style.left).replace('%', '')) || 50;
                        const y = parseFloat(String(style.top).replace('%', '')) || 50;

                        // Create clean style object without position
                        const cleanStyle = { ...style };
                        delete cleanStyle.top;
                        delete cleanStyle.left;

                        return {
                            id: crypto.randomUUID(),
                            type: el.type === 'state-label' ? 'label' : 'icon',
                            x,
                            y,
                            config: {
                                entity: el.entity,
                                icon: el.icon,
                                text: el.prefix, // Map prefix to text for labels
                                style: cleanStyle,
                                tap_action: el.tap_action
                            }
                        };
                    });
                    setElements(newElements);
                }
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
            .then(() => alert('Copied to clipboard!')) // Should probably use a toast but alert is fine for now
            .catch(() => alert('Failed to copy'));
    };

    return (
        <div className="flex flex-col h-full border-t border-gray-700 bg-gray-900">
            <div className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live YAML Editor</h3>
                    {error && <span className="text-xs text-red-400">Invalid YAML</span>}
                </div>
                <button
                    onClick={handleCopy}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                >
                    Copy YAML
                </button>
            </div>
            <textarea
                className="flex-1 bg-gray-900 text-gray-300 font-mono text-xs p-3 resize-none outline-none focus:bg-gray-800 transition-colors"
                value={code}
                onChange={handleCodeChange}
                spellCheck={false}
            />
        </div>
    );
};
