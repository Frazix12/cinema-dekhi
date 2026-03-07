"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Simple event emitter for cross-component communication without extra deps
type Listener = () => void;

const listeners = new Set<Listener>();

let _isOpen = false;

export const searchModalEmitter = {
  open() {
    _isOpen = true;
    listeners.forEach((l) => l());
  },
  close() {
    _isOpen = false;
    listeners.forEach((l) => l());
  },
  toggle() {
    _isOpen = !_isOpen;
    listeners.forEach((l) => l());
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const useSearchModal = () => {
  const [isOpen, setIsOpen] = useState(_isOpen);

  useEffect(() => {
    const unsubscribe = searchModalEmitter.subscribe(() => {
      setIsOpen(_isOpen);
    });
    return unsubscribe;
  }, []);

  return {
    isOpen,
    open: searchModalEmitter.open,
    close: searchModalEmitter.close,
    toggle: searchModalEmitter.toggle,
  };
};
