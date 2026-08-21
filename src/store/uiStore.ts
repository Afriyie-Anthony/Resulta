import { create } from 'zustand';

/**
 * Zustand UI store — lightweight global UI state that doesn't belong
 * in the server cache (TanStack Query).
 *
 * Usage:
 *   const { sidebarCollapsed, toggleSidebar } = useUiStore();
 */
interface UiState {
  /** Whether the admin sidebar is collapsed to icon-only mode */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  /** Active admin route key — used for breadcrumb and nav highlighting */
  activeAdminView: string;
  setActiveAdminView: (view: string) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  activeAdminView: 'dashboard',
  setActiveAdminView: (view) => set({ activeAdminView: view }),
}));
