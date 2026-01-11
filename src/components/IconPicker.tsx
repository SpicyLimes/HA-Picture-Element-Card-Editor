import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as mdiIcons from '@mdi/js';
import Icon from '@mdi/react';

interface IconPickerProps {
    value: string;
    onChange: (value: string) => void;
}

// Convert camelCase to kebab-case
const camelToKebab = (str: string) => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// Generate icon list once
const ICON_LIST = Object.keys(mdiIcons).map(key => ({
    name: 'mdi:' + camelToKebab(key.substring(3)), // remove 'mdi' prefix from variable name
    path: (mdiIcons as any)[key] as string
}));

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredIcons = useMemo(() => {
        if (!search) return ICON_LIST.slice(0, 50);
        const lowerSearch = search.toLowerCase();
        return ICON_LIST.filter(icon => icon.name.includes(lowerSearch)).slice(0, 50);
    }, [search]);

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={isOpen ? search : value}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => {
                        setSearch(''); // Clear search on focus to show all/recent? Or keep value?
                        setIsOpen(true);
                    }}
                    className="w-full bg-gray-700 px-3 py-2 rounded text-sm border border-gray-600 outline-none focus:border-blue-500 transition-colors pl-9"
                    placeholder="Search icons..."
                />
                {/* Preview Icon overlay */}
                <div className="absolute left-2 top-2 text-gray-400 pointer-events-none">
                    {value ? (
                        <Icon path={(mdiIcons as any)[String('mdi' + value.replace(/^mdi:/, '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(''))] || mdiIcons.mdiHelpCircle} size={0.8} />
                    ) : (
                        <span className="text-xs mt-1 block">mdi:</span>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded shadow-xl max-h-60 overflow-y-auto left-0">
                    {filteredIcons.map(icon => (
                        <div
                            key={icon.name}
                            className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() => {
                                onChange(icon.name);
                                setSearch('');
                                setIsOpen(false);
                            }}
                        >
                            <Icon path={icon.path} size={1} className="text-gray-400" />
                            <span className="text-sm text-gray-200">{icon.name}</span>
                        </div>
                    ))}
                    {filteredIcons.length === 0 && (
                        <div className="p-3 text-sm text-gray-500 text-center">No icons found</div>
                    )}
                </div>
            )}
        </div>
    );
};
