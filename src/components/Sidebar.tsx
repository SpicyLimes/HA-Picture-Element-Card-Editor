import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { YamlEditor } from './YamlEditor';

export const Sidebar: React.FC = () => {
    const { addElement } = useEditorStore();

    const generateId = () => {
        if (typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    };

    const handleAddStateIcon = () => {
        addElement({
            id: generateId(),
            type: 'state-icon',
            x: 50,
            y: 50,
            config: {
                entity: 'light.living_room',
                tap_action: { action: 'toggle' }
            }
        });
    };

    const handleAddStateLabel = () => {
        addElement({
            id: generateId(),
            type: 'state-label',
            x: 50,
            y: 50,
            config: {
                entity: 'sensor.temperature',
                style: {
                    'color': 'white',
                    'font-weight': 'bold'
                }
            }
        });
    };

    const handleAddStateBadge = () => {
        addElement({
            id: generateId(),
            type: 'state-badge',
            x: 50,
            y: 50,
            config: {
                entity: 'sensor.temperature'
            }
        });
    };

    const handleAddIcon = () => {
        addElement({
            id: generateId(),
            type: 'icon',
            x: 50,
            y: 50,
            config: {
                icon: 'mdi:home',
                style: {
                    '--paper-item-icon-color': 'white'
                }
            }
        });
    };

    const handleAddImage = () => {
        addElement({
            id: generateId(),
            type: 'image',
            x: 50,
            y: 50,
            config: {
                image: 'https://demo.home-assistant.io/stub_config/bedroom.png',
                style: {
                    'width': '10%'
                }
            }
        });
    };

    const handleAddConditional = () => {
        addElement({
            id: generateId(),
            type: 'conditional',
            x: 50,
            y: 50,
            config: {
                conditions: [
                    { entity: 'input_boolean.test', state: 'on' }
                ]
            },
            elements: []
        });
    };

    return (
        <div className="w-80 bg-gray-800 text-white flex flex-col border-r border-gray-700 h-full flex-shrink-0">
            {/* Tools Section */}
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-sm font-bold uppercase text-gray-400 mb-3 tracking-wider text-center">Add Elements</h2>

                {/* Entity Linked Elements */}
                <div className="mb-4">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">State Based</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleAddStateIcon}
                            className="p-3 bg-gray-700 hover:bg-gray-600 rounded flex flex-col items-center justify-center gap-2 transition-all group aspect-square"
                            title="State Icon - Changes icon/color based on entity state"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12,2L2,12H5V22H19V12H22L12,2Z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium text-gray-300 group-hover:text-white text-center">State Icon</span>
                        </button>

                        <button
                            onClick={handleAddStateLabel}
                            className="p-3 bg-gray-700 hover:bg-gray-600 rounded flex flex-col items-center justify-center gap-2 transition-all group aspect-square"
                            title="State Label - Displays the text state of an entity"
                        >
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <span className="font-bold text-xs">Abc</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-300 group-hover:text-white text-center">State Label</span>
                        </button>

                        <button
                            onClick={handleAddStateBadge}
                            className="p-3 bg-gray-700 hover:bg-gray-600 rounded flex flex-col items-center justify-center gap-2 transition-all group aspect-square"
                            title="State Badge - Standard Home Assistant circular badge"
                        >
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors border-2 border-orange-500/30">
                                <span className="font-bold text-[9px]">21°</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-300 group-hover:text-white text-center">Badge</span>
                        </button>
                    </div>
                </div>

                {/* Static / Structural Elements */}
                <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Static & Groups</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleAddIcon}
                            className="p-3 bg-gray-700 hover:bg-gray-600 rounded flex flex-col items-center justify-center gap-2 transition-all group aspect-square"
                            title="Static Icon - Simple icon with no state link"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-600/50 text-gray-300 flex items-center justify-center group-hover:bg-gray-500 group-hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M13,3V9H21V3H13M13,21H21V11H13V21M3,21H11V15H3V21M3,13H11V3H3V13Z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium text-gray-300 group-hover:text-white text-center">Static Icon</span>
                        </button>

                        <button
                            onClick={handleAddImage}
                            className="p-3 bg-gray-700 hover:bg-gray-600 rounded flex flex-col items-center justify-center gap-2 transition-all group aspect-square"
                            title="Image - Overlay image or camera stream"
                        >
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M21,19V5C21,3.89 20.1,3 19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.89,21 5,21H19C20.1,21 21,20.1 21,19M8.5,13.5L11,16.5L14.5,12L19,18H5L8.5,13.5Z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium text-gray-300 group-hover:text-white text-center">Image</span>
                        </button>

                        <button
                            onClick={handleAddConditional}
                            className="p-3 bg-gray-700 hover:bg-gray-600 rounded flex flex-col items-center justify-center gap-2 transition-all group aspect-square"
                            title="Conditional - Group elements and show/hide based on state"
                        >
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M13,2V5H11V2H13M20.96,15.29L19.55,13.88L21.67,11.76L23.08,13.17L20.96,15.29M11,19V22H13V19H11M2.33,13.17L3.74,11.76L5.86,13.88L4.45,15.29L2.33,13.17M11,7A5,5 0 0,0 6,12A5,5 0 0,0 11,17A5,5 0 0,0 16,12A5,5 0 0,0 11,7Z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-medium text-gray-300 group-hover:text-white text-center">Conditional</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Live YAML Editor */}
            <div className="flex-1 min-h-0">
                <YamlEditor />
            </div>
        </div>
    );
};
