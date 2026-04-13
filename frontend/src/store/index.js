import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, token, refreshToken = null) => set({ user, token, refreshToken, isAuthenticated: true }),

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
      },

      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),
    }),
    {
      name: 'sanad_auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken, isAuthenticated: state.isAuthenticated }),
    }
  )
)

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  notifications: [
    { id: 1, type: 'success', text_ar: 'تم قبول طلب السكن الخاص بك', text_fr: 'Votre demande de logement a été acceptée', time_ar: 'منذ ساعة', time_fr: 'Il y a 1h', read: false },
    { id: 2, type: 'warning', text_ar: 'موعد تسليم المذكرة: 3 أيام', text_fr: 'Délai de remise du mémoire : 3 jours', time_ar: 'منذ 3 ساعات', time_fr: 'Il y a 3h', read: false },
    { id: 3, type: 'info', text_ar: 'خدمة جديدة متاحة في فئة الرفاهية', text_fr: 'Nouveau service disponible dans bien-être', time_ar: 'أمس', time_fr: 'Hier', read: true },
  ],
  markRead: (id) => set((s) => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
}))
