import type { MermaidConfig } from 'mermaid';
import type { Theme } from '../hooks/useTheme';

export const DEFAULT_CODE = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
`;

export const STORAGE_KEY = 'mermaid-code';

export const DEBOUNCE_DELAY = 300;

export const EXPORT_PIXEL_RATIO = 3;

// Minimum export dimensions to ensure good quality
export const MIN_EXPORT_WIDTH = 2000;
export const MIN_EXPORT_HEIGHT = 1500;

// Solarized color palette
const SOLARIZED = {
    base03: '#002b36',
    base02: '#073642',
    base01: '#586e75',
    base00: '#657b83',
    base0: '#839496',
    base1: '#93a1a1',
    base2: '#eee8d5',
    base3: '#fdf6e3',
    yellow: '#b58900',
    orange: '#cb4b16',
    red: '#dc322f',
    magenta: '#d33682',
    violet: '#6c71c4',
    blue: '#268bd2',
    cyan: '#2aa198',
    green: '#859900',
};

export function getMermaidConfig(theme: Theme): MermaidConfig {
    const isDark = theme === 'dark';

    return {
        startOnLoad: false,
        securityLevel: 'loose',
        fontFamily: 'inherit',
        theme: isDark ? 'dark' : 'default',
        themeVariables: isDark
            ? {
                  primaryColor: SOLARIZED.cyan,
                  primaryTextColor: SOLARIZED.base1,
                  primaryBorderColor: SOLARIZED.base01,
                  lineColor: SOLARIZED.base01,
                  secondaryColor: SOLARIZED.base02,
                  tertiaryColor: SOLARIZED.base02,
                  background: SOLARIZED.base03,
                  mainBkg: SOLARIZED.base02,
                  nodeBorder: SOLARIZED.base01,
                  clusterBkg: SOLARIZED.base02,
                  clusterBorder: SOLARIZED.base01,
                  titleColor: SOLARIZED.base1,
                  edgeLabelBackground: SOLARIZED.base02,
                  actorBkg: SOLARIZED.base02,
                  actorBorder: SOLARIZED.base01,
                  actorTextColor: SOLARIZED.base1,
                  actorLineColor: SOLARIZED.base01,
                  signalColor: SOLARIZED.base1,
                  signalTextColor: SOLARIZED.base1,
                  labelBoxBkgColor: SOLARIZED.base02,
                  labelBoxBorderColor: SOLARIZED.base01,
                  labelTextColor: SOLARIZED.base1,
                  loopTextColor: SOLARIZED.base1,
                  noteBorderColor: SOLARIZED.base01,
                  noteBkgColor: SOLARIZED.yellow,
                  noteTextColor: SOLARIZED.base03,
                  activationBorderColor: SOLARIZED.base01,
                  activationBkgColor: SOLARIZED.base02,
                  sequenceNumberColor: SOLARIZED.base03,
              }
            : {
                  primaryColor: SOLARIZED.blue,
                  primaryTextColor: SOLARIZED.base00,
                  primaryBorderColor: SOLARIZED.base1,
                  lineColor: SOLARIZED.base1,
                  secondaryColor: SOLARIZED.base2,
                  tertiaryColor: SOLARIZED.base2,
                  background: SOLARIZED.base3,
                  mainBkg: SOLARIZED.base2,
                  nodeBorder: SOLARIZED.base1,
                  clusterBkg: SOLARIZED.base2,
                  clusterBorder: SOLARIZED.base1,
                  titleColor: SOLARIZED.base00,
                  edgeLabelBackground: SOLARIZED.base2,
                  actorBkg: SOLARIZED.base2,
                  actorBorder: SOLARIZED.base1,
                  actorTextColor: SOLARIZED.base00,
                  actorLineColor: SOLARIZED.base1,
                  signalColor: SOLARIZED.base00,
                  signalTextColor: SOLARIZED.base00,
                  labelBoxBkgColor: SOLARIZED.base2,
                  labelBoxBorderColor: SOLARIZED.base1,
                  labelTextColor: SOLARIZED.base00,
                  loopTextColor: SOLARIZED.base00,
                  noteBorderColor: SOLARIZED.base1,
                  noteBkgColor: SOLARIZED.yellow,
                  noteTextColor: SOLARIZED.base03,
                  activationBorderColor: SOLARIZED.base1,
                  activationBkgColor: SOLARIZED.base2,
                  sequenceNumberColor: SOLARIZED.base3,
              },
    };
}
