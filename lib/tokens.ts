// Design System Tokens
// При изменении цветов — обнови также globals.css (:root)

export const colors = {
  background: {
    primary: '#121212',
    secondary: '#1F1F1F',
    tertiary: '#171717',
  },
  text: {
    primary: '#F3F3F3',
    secondary: '#848484',
  },
  accent: '#B5EF77',
} as const

export const fonts = {
  golos: {
    name: 'Golos Text',
    variable: '--font-golos',
    weights: [400, 500, 600, 700] as const,
  },
  offbit: {
    name: 'Offbit',
    variable: '--font-offbit',
    family: '"Offbit", sans-serif',
    weights: [400, 700] as const,
  },
} as const

export const typography = {
  titleLarge: {
    className: 'title-large',
    fontSize: '44px',
    lineHeight: '56px',
    fontWeight: 500,
  },
  titleMedium: {
    className: 'title-medium',
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 400,
  },
  titleMediumSemibold: {
    className: 'title-medium-semibold',
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 600,
  },
  bodyText: {
    className: 'body-text',
    fontSize: '17px',
    lineHeight: '24px',
    fontWeight: 400,
  },
  titleAccent: {
    className: 'title-accent',
    fontSize: '32px',
    lineHeight: '32px',
    fontWeight: 400,
    letterSpacing: '0.04em',
    fontFamily: 'Offbit',
  },
} as const
