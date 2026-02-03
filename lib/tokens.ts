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
    fontWeight: 500,
    mobile: { fontSize: '28px', lineHeight: '36px' },
    tablet: { fontSize: '36px', lineHeight: '46px' },
    desktop: { fontSize: '44px', lineHeight: '56px' },
  },
  titleMedium: {
    className: 'title-medium',
    fontWeight: 400,
    mobile: { fontSize: '18px', lineHeight: '26px' },
    tablet: { fontSize: '22px', lineHeight: '30px' },
    desktop: { fontSize: '24px', lineHeight: '32px' },
  },
  titleMediumSemibold: {
    className: 'title-medium-semibold',
    fontWeight: 600,
    mobile: { fontSize: '18px', lineHeight: '26px' },
    tablet: { fontSize: '22px', lineHeight: '30px' },
    desktop: { fontSize: '24px', lineHeight: '32px' },
  },
  bodyText: {
    className: 'body-text',
    fontWeight: 400,
    mobile: { fontSize: '15px', lineHeight: '22px' },
    tablet: { fontSize: '16px', lineHeight: '24px' },
    desktop: { fontSize: '17px', lineHeight: '24px' },
  },
  titleAccent: {
    className: 'title-accent',
    fontWeight: 400,
    letterSpacing: '0.04em',
    fontFamily: 'Offbit',
    mobile: { fontSize: '24px', lineHeight: '24px' },
    tablet: { fontSize: '28px', lineHeight: '28px' },
    desktop: { fontSize: '32px', lineHeight: '32px' },
  },
} as const
