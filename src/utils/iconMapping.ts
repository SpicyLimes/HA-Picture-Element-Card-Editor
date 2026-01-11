import * as mdiIcons from '@mdi/js';

// Helper to convert kebab-case icon name (without mdi: prefix) to camelCase variable name
// e.g. "account-circle" -> "mdiAccountCircle"
const toCamelCase = (str: string) => {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
};

export const getIconPath = (iconName: string): string => {
    if (!iconName) return mdiIcons.mdiHelpCircle;

    const name = iconName.replace(/^mdi:/, '');
    const camelNameConvert_ = `mdi${toCamelCase(name).charAt(0).toUpperCase() + toCamelCase(name).substring(1)}`;

    // @ts-ignore
    let path = mdiIcons[camelNameConvert_];

    if (!path) {
        // Try direct match if user typed camelCase?
        // @ts-ignore
        path = mdiIcons[name];
    }

    if (!path) {
        // Fallback
        return mdiIcons.mdiHelpCircle;
    }

    return path;
};
