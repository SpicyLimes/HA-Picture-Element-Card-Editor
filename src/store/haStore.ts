import { create } from 'zustand';
import { fetchEntities } from '../services/ha-api';

interface HAState {
    entity_id: string;
    state: string;
    attributes: Record<string, any>;
}

interface HAConnectionState {
    url: string;
    token: string;
    isConnected: boolean;
    isLoading: boolean;
    entities: HAState[];
    error: string | null;
    setConnection: (url: string, token: string) => void;
    connect: () => Promise<void>;
}

export const useHAStore = create<HAConnectionState>((set, get) => ({
    url: '',
    token: '',
    isConnected: false,
    isLoading: false,
    entities: [],
    error: null,
    setConnection: (url, token) => set({ url, token }),
    connect: async () => {
        const { url, token } = get();
        if (!url || !token) {
            set({ error: 'URL and Token are required' });
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const entities = await fetchEntities(url, token);
            set({ entities, isConnected: true, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to connect', isConnected: false, isLoading: false });
        }
    },
}));
