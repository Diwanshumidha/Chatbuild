import { create } from "zustand";


interface AgentState {
  waitlist_users: number;
  add_user: (by: number) => void;
}

const useBearStore = create<AgentState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));


const useAgentSocket = () => {};
