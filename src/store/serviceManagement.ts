import { create } from "zustand";

interface ServiceState {
  numberOfService: number
}

export const serviceManagementStore = create<ServiceState>(() => ({
  numberOfService: 0,
}))