import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { useHAStore } from '../store/haStore';
import { IconPicker } from './IconPicker';

export const PropertiesPanel: React.FC = () => {
    const { selectedElementId, elements, updateElement, removeElement } = useEditorStore();
    const { entities } = useHAStore();

    const selectedElement = elements.find(el => el.id === selectedElementId);

    if (!selectedElement) {
        return (
            <div className="w-80 bg-gray-800 text-white flex flex-col border-l border-gray-700 h-full p-4 items-center justify-center text-gray-500">
                <p>Select an element to edit properties.</p>
            </div>
        );
    }

    const handleChange = (key: string, value: any) => {
        updateElement(selectedElement.id, {
            config: { ...selectedElement.config, [key]: value }
        });
    };

    const handleStyleChange = (key: string, value: string) => {
        const currentStyle = selectedElement.config.style || {};
        updateElement(selectedElement.id, {
            config: {
                ...selectedElement.config,
                style: { ...currentStyle, [key]: value }
            }
        });
    };

    return (
        <div className="w-80 bg-gray-800 text-white flex flex-col border-l border-gray-700 h-full overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                <h2 className="text-lg font-bold">Properties</h2>
                <button
                    onClick={() => removeElement(selectedElement.id)}
                    className="text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20 text-sm transition-colors"
                    title="Delete Element"
                >
                    Delete
                </button>
            </div>

            <div className="p-4 space-y-5">
                {/* Type Info */}
                <div className="pb-2 border-b border-gray-700/50">
                    <span className="text-xs font-mono text-gray-500 bg-gray-900 px-1 py-0.5 rounded">ID: {selectedElement.id.slice(0, 8)}...</span>
                </div>

                {/* Entity */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Entity</label>
                    <input
                        list="entities"
                        value={selectedElement.config.entity || ''}
                        onChange={(e) => handleChange('entity', e.target.value)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-sm border border-gray-600 outline-none focus:border-blue-500 transition-colors"
                        placeholder="light.living_room"
                    />
                    <datalist id="entities">
                        {entities.map((e: any) => (
                            <option key={e.entity_id} value={e.entity_id} />
                        ))}
                    </datalist>
                </div>

                {/* Text (Only if Label) */}
                {selectedElement.type === 'label' && (
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Text / Prefix</label>
                        <input
                            value={selectedElement.config.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            className="w-full bg-gray-700 px-3 py-2 rounded text-sm border border-gray-600 outline-none focus:border-blue-500 transition-colors"
                            placeholder="Display Text"
                        />
                    </div>
                )}

                {/* Icon */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Icon</label>
                    <IconPicker
                        value={selectedElement.config.icon || ''}
                        onChange={(val: string) => handleChange('icon', val)}
                    />
                </div>

                {/* Icon Size */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Icon Size (px)</label>
                    <input
                        type="number"
                        value={parseInt(selectedElement.config.style?.['--mdc-icon-size'] || '24')}
                        onChange={(e) => handleStyleChange('--mdc-icon-size', `${e.target.value}px`)}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-sm border border-gray-600 outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Tap Action */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Tap Action</label>
                    <select
                        value={selectedElement.config.tap_action?.action || 'none'}
                        onChange={(e) => handleChange('tap_action', { action: e.target.value })}
                        className="w-full bg-gray-700 px-3 py-2 rounded text-sm border border-gray-600 outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="none">None</option>
                        <option value="toggle">Toggle</option>
                        <option value="more-info">More Info</option>
                        <option value="navigate">Navigate</option>
                        <option value="call-service">Call Service</option>
                    </select>
                </div>

                {/* Styles */}
                <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-sm font-bold mb-3 text-gray-400">Style & Appearance</h3>

                    {/* Position Readout (Editable) */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Left (%)</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.x)}
                                onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                                className="w-full bg-gray-700 px-2 py-1 rounded text-xs border border-gray-600 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Top (%)</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.y)}
                                onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                                className="w-full bg-gray-700 px-2 py-1 rounded text-xs border border-gray-600 focus:border-blue-500"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
