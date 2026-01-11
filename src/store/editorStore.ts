import { create } from 'zustand';

export interface EditorElement {
    id: string;
    type: string; // 'icon', 'label', 'image', etc.
    x: number;
    y: number;
    config: Record<string, any>;
}

interface EditorState {
    elements: EditorElement[];
    selectedElementId: string | null;
    backgroundImage: string | null;
    addElement: (element: EditorElement) => void;
    updateElement: (id: string, updates: Partial<EditorElement>) => void;
    removeElement: (id: string) => void;
    selectElement: (id: string | null) => void;
    setBackgroundImage: (url: string | null) => void;
    setElements: (elements: EditorElement[]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    elements: [],
    selectedElementId: null,
    backgroundImage: null,
    setElements: (elements) => set({ elements }),
    addElement: (element) =>
        set((state) => ({ elements: [...state.elements, element] })),
    updateElement: (id, updates) =>
        set((state) => ({
            elements: state.elements.map((el) =>
                el.id === id ? { ...el, ...updates } : el
            ),
        })),
    removeElement: (id) =>
        set((state) => ({
            elements: state.elements.filter((el) => el.id !== id),
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        })),
    selectElement: (id) => set({ selectedElementId: id }),
    setBackgroundImage: (url) => set({ backgroundImage: url }),
}));
