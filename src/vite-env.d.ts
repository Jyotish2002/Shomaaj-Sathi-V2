/// <reference types="vite/client" />

// Google Translate API types
interface GoogleTranslateElement {
  new (options: {
    pageLanguage: string;
    includedLanguages?: string;
    layout?: number;
    autoDisplay?: boolean;
  }, elementId: string): void;
  InlineLayout: {
    SIMPLE: number;
    HORIZONTAL: number;
    VERTICAL: number;
  };
}

interface GoogleTranslate {
  TranslateElement: GoogleTranslateElement;
}

interface Google {
  translate: GoogleTranslate;
}

declare global {
  interface Window {
    google?: Google;
    googleTranslateElementInit?: () => void;
    initGoogleTranslate?: () => void;
  }
}
