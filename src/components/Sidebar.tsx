import React from 'react';
import { useHAStore } from '../store/haStore';
import { clsx } from 'clsx';
import { useEditorStore } from '../store/editorStore';
import { YamlEditor } from './YamlEditor';

export const Sidebar: React.FC = () => {
    const { url, token, isConnected, isLoading, error, setConnection, connect } = useHAStore();
    const { addElement } = useEditorStore();

    const handleAddIcon = () => {
        // Add a default icon element to center of canvas
        addElement({
            id: crypto.randomUUID(),
            type: 'icon',
            x: 50,
            y: 50,
            config: {
                icon: 'mdi:home', // Default icon
                style: {
                    '--paper-item-icon-color': 'var(--primary-text-color)'
                }
            }
        });
    };

    const handleAddLabel = () => {
        addElement({
            id: crypto.randomUUID(),
            type: 'label',
            x: 50,
            y: 50,
            config: {
                entity: 'sensor.time',
                style: {
                    'color': 'white',
                    'font-weight': 'bold'
                }
            }
        });
    };

    return (
        <div className="w-80 bg-gray-800 text-white flex flex-col border-r border-gray-700 h-full flex-shrink-0">
            {/* HA Connection Section */}
            <div className="p-4 border-b border-gray-700 bg-gray-900/50">
                <h2 className="text-sm font-bold uppercase text-gray-400 mb-3 tracking-wider">HA Connection</h2>
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Instance URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setConnection(e.target.value, token)}
                            className="w-full bg-gray-700 text-white px-3 py-1.5 rounded text-sm border border-gray-600 focus:border-blue-500 outline-none transition-colors placeholder-gray-500"
                            placeholder="http://192.168.x.x:8123"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Long-Lived Access Token</label>
                        <input
                            type="password"
                            value={token}
                            onChange={(e) => setConnection(url, e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-1.5 rounded text-sm border border-gray-600 focus:border-blue-500 outline-none transition-colors placeholder-gray-500"
                            placeholder="Paste token here..."
                        />
                    </div>

                    <button
                        onClick={connect}
                        disabled={isLoading}
                        className={clsx(
                            "mt-1 w-full py-2 rounded text-sm font-medium transition-all shadow-sm",
                            isConnected
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-900/20"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20",
                            isLoading && "opacity-70 cursor-wait"
                        )}
                    >
                        {isLoading ? 'Connecting...' : isConnected ? 'Connected Successfully' : 'Connect'}
                    </button>

                    {error && <p className="text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-900/50">{error}</p>}
                </div>
            </div>

            {/* Tools Section */}
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-sm font-bold uppercase text-gray-400 mb-3 tracking-wider">Elements</h2>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleAddIcon}
                        className="p-3 bg-gray-700 hover:bg-gray-600 rounded flex flex-col items-center justify-center gap-2 transition-colors group aspect-square"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            {/* Simple Icon placeholder */}
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M12,2L2,12H5V22H19V12H22L12,2Z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-300 group-hover:text-white">Icon</span>
                    </button>

                    {/* Label Element */}
                    <button
                        onClick={handleAddLabel}
                        className="p-3 bg-gray-700 hover:bg-gray-600 rounded flex flex-col items-center justify-center gap-2 transition-colors group aspect-square hover:ring-2 hover:ring-purple-500/50"
                    >
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <span className="font-bold text-xs">Abc</span>
                        </div>
                        <span className="text-xs font-medium text-gray-300 group-hover:text-white">Label</span>
                    </button>
                </div>
            </div>

            {/* Live YAML Editor */}
            <div className="flex-1 min-h-0">
                <YamlEditor />
            </div>
        </div>
    );
};
