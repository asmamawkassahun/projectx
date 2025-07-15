import { create } from "zustand";

interface ConversationStore {
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  conversationId: null,
  setConversationId: (id) => set({ conversationId: id }),
}));
