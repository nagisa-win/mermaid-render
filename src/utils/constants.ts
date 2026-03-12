import type { MermaidConfig } from 'mermaid';

export const DEFAULT_CODE = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
`;

export const STORAGE_KEY = 'mermaid-code';

export const DEBOUNCE_DELAY = 300;

export const EXPORT_PIXEL_RATIO = 2;

export const MERMAID_CONFIG: MermaidConfig = {
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'inherit',
};
