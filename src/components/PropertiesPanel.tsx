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

    const handleActionChange = (actionType: 'tap_action' | 'hold_action' | 'double_tap_action', field: string, value: any) => {
        const currentAction = selectedElement.config[actionType] || { action: 'none' };
        handleChange(actionType, { ...currentAction, [field]: value });
    };

    const PropertySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="pt-4 border-t border-gray-700/50">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">{title}</h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );

    return (
        <div className="w-80 bg-gray-800 text-white flex flex-col border-l border-gray-700 h-full overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 sticky top-0 z-20">
                <div>
                    <h2 className="text-lg font-bold">Properties</h2>
                    <span className="text-[10px] uppercase font-mono text-blue-400">{selectedElement.type}</span>
                </div>
                <button
                    onClick={() => removeElement(selectedElement.id)}
                    className="text-red-400 hover:text-red-300 px-3 py-1 rounded bg-red-900/20 border border-red-900/50 text-xs font-bold transition-all hover:bg-red-900/40"
                    title="Delete Element"
                >
                    Delete
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Core Config */}
                <div className="space-y-4">
                    {/* Entity */}
                    {['state-icon', 'state-label', 'state-badge', 'conditional'].includes(selectedElement.type) && (
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Entity</label>
                            <input
                                list="entities"
                                value={selectedElement.config.entity || ''}
                                onChange={(e) => handleChange('entity', e.target.value)}
                                className="w-full bg-gray-900/50 px-3 py-2 rounded text-sm border border-gray-700 outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g., light.living_room"
                            />
                            <datalist id="entities">
                                {entities.map((e: any) => (
                                    <option key={e.entity_id} value={e.entity_id} />
                                ))}
                            </datalist>
                        </div>
                    )}

                    {/* Element Specific Logic */}
                    {selectedElement.type === 'state-label' && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Prefix</label>
                                <input
                                    value={selectedElement.config.prefix || ''}
                                    onChange={(e) => handleChange('prefix', e.target.value)}
                                    className="w-full bg-gray-900/50 px-2 py-1.5 rounded text-xs border border-gray-700"
                                    placeholder="e.g. Temp: "
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Suffix</label>
                                <input
                                    value={selectedElement.config.suffix || ''}
                                    onChange={(e) => handleChange('suffix', e.target.value)}
                                    className="w-full bg-gray-900/50 px-2 py-1.5 rounded text-xs border border-gray-700"
                                    placeholder="e.g. °C"
                                />
                            </div>
                        </div>
                    )}

                    {['icon', 'state-icon'].includes(selectedElement.type) && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Icon</label>
                                <IconPicker
                                    value={selectedElement.config.icon || ''}
                                    onChange={(val: string) => handleChange('icon', val)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Icon Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={selectedElement.config.style?.['--paper-item-icon-color'] || '#ffffff'}
                                        onChange={(e) => handleStyleChange('--paper-item-icon-color', e.target.value)}
                                        className="w-10 h-8 bg-transparent border-none cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={selectedElement.config.style?.['--paper-item-icon-color'] || ''}
                                        onChange={(e) => handleStyleChange('--paper-item-icon-color', e.target.value)}
                                        className="flex-1 bg-gray-900/50 px-2 py-1 rounded text-xs border border-gray-700"
                                        placeholder="var(--primary-color)"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {selectedElement.type === 'image' && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Static Image URL</label>
                                <input
                                    value={selectedElement.config.image || ''}
                                    onChange={(e) => handleChange('image', e.target.value)}
                                    className="w-full bg-gray-900/50 px-3 py-2 rounded text-sm border border-gray-700"
                                    placeholder="/local/floorplan/overlay.png"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Camera Entity</label>
                                <input
                                    list="cameras"
                                    value={selectedElement.config.camera_image || ''}
                                    onChange={(e) => handleChange('camera_image', e.target.value)}
                                    className="w-full bg-gray-900/50 px-3 py-2 rounded text-sm border border-gray-700"
                                    placeholder="camera.front_door"
                                />
                                <datalist id="cameras">
                                    {entities.filter((e: any) => e.entity_id.startsWith('camera.')).map((e: any) => (
                                        <option key={e.entity_id} value={e.entity_id} />
                                    ))}
                                </datalist>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <PropertySection title="Actions">
                    <div className="space-y-4">
                        {(['tap_action', 'hold_action', 'double_tap_action'] as const).map(actionKey => (
                            <div key={actionKey} className="p-3 bg-gray-900/30 rounded border border-gray-700/50">
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">{actionKey.replace('_', ' ')}</label>
                                <select
                                    value={selectedElement.config[actionKey]?.action || 'none'}
                                    onChange={(e) => handleActionChange(actionKey, 'action', e.target.value)}
                                    className="w-full bg-gray-700 px-2 py-1.5 rounded text-xs border border-gray-600 outline-none"
                                >
                                    <option value="none">None</option>
                                    <option value="toggle">Toggle</option>
                                    <option value="more-info">More Info</option>
                                    <option value="navigate">Navigate</option>
                                    <option value="call-service">Call Service</option>
                                    <option value="perform-action">Perform Action</option>
                                    <option value="url">Open URL</option>
                                </select>

                                {selectedElement.config[actionKey]?.action === 'navigate' && (
                                    <input
                                        value={selectedElement.config[actionKey]?.navigation_path || ''}
                                        onChange={(e) => handleActionChange(actionKey, 'navigation_path', e.target.value)}
                                        className="mt-2 w-full bg-gray-800 px-2 py-1.5 rounded text-xs border border-gray-700"
                                        placeholder="/lovelace/lights"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </PropertySection>

                {/* Styling */}
                <PropertySection title="Styling & Appearance">
                    {/* Position */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Left (%)</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.x)}
                                onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })}
                                className="w-full bg-gray-700 px-2 py-1.5 rounded text-xs border border-gray-600 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 mb-1">Top (%)</label>
                            <input
                                type="number"
                                value={Math.round(selectedElement.y)}
                                onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })}
                                className="w-full bg-gray-700 px-2 py-1.5 rounded text-xs border border-gray-600 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Size for non-icons */}
                    {!['icon', 'state-icon', 'state-badge'].includes(selectedElement.type) && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">Width</label>
                                <input
                                    value={selectedElement.config.style?.width || ''}
                                    onChange={(e) => handleStyleChange('width', e.target.value)}
                                    className="w-full bg-gray-700 px-2 py-1.5 rounded text-xs border border-gray-600"
                                    placeholder="e.g. 10%"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">Height</label>
                                <input
                                    value={selectedElement.config.style?.height || ''}
                                    onChange={(e) => handleStyleChange('height', e.target.value)}
                                    className="w-full bg-gray-700 px-2 py-1.5 rounded text-xs border border-gray-600"
                                    placeholder="e.g. auto"
                                />
                            </div>
                        </div>
                    )}

                    {/* Borders */}
                    <div className="space-y-3 p-3 bg-gray-900/30 rounded border border-gray-700/50">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Border & Radius</label>
                        <div>
                            <label className="block text-[9px] text-gray-500 mb-1 italic">Border (e.g. 2px solid white)</label>
                            <input
                                value={selectedElement.config.style?.border || ''}
                                onChange={(e) => handleStyleChange('border', e.target.value)}
                                className="w-full bg-gray-800 px-2 py-1.5 rounded text-xs border border-gray-700"
                                placeholder="2px solid red"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] text-gray-500 mb-1 italic">Radius (e.g. 50% or 8px)</label>
                            <input
                                value={selectedElement.config.style?.['border-radius'] || ''}
                                onChange={(e) => handleStyleChange('border-radius', e.target.value)}
                                className="w-full bg-gray-800 px-2 py-1.5 rounded text-xs border border-gray-700"
                                placeholder="10px"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] text-gray-500 mb-1 italic">Box Shadow</label>
                            <input
                                value={selectedElement.config.style?.['box-shadow'] || ''}
                                onChange={(e) => handleStyleChange('box-shadow', e.target.value)}
                                className="w-full bg-gray-800 px-2 py-1.5 rounded text-xs border border-gray-700"
                                placeholder="0 4px 8px rgba(0,0,0,0.5)"
                            />
                        </div>
                    </div>

                    {/* Advanced: Filter */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">CSS Filter (brightness, etc.)</label>
                        <input
                            value={selectedElement.config.style?.filter || selectedElement.config.filter || ''}
                            onChange={(e) => {
                                handleStyleChange('filter', e.target.value);
                                handleChange('filter', e.target.value);
                            }}
                            className="w-full bg-gray-700 px-3 py-2 rounded text-sm border border-gray-600"
                            placeholder="brightness(0.5) grayscale(1)"
                        />
                        <p className="text-[9px] text-gray-500 mt-1 italic">Note: Use 'filter' for images, 'style.filter' for others.</p>
                    </div>
                </PropertySection>
            </div>
        </div>
    );
};
