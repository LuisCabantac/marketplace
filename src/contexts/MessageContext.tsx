"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useMessageCount } from '@/hooks/useMessageCount';

interface MessageContextType {
  messageCount: number;
  loading: boolean;
  incrementMessageCount: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: ReactNode;
}

export function MessageProvider({ children }: MessageProviderProps) {
  const { messageCount, loading, incrementMessageCount } = useMessageCount();

  return (
    <MessageContext.Provider value={{ messageCount, loading, incrementMessageCount }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
}
