import React from 'react'
import type { Preview } from '@storybook/nextjs-vite'
import { Golos_Text } from 'next/font/google'
import { colors } from '../lib/tokens'
import '../app/globals.css'

const golosText = Golos_Text({
  variable: '--font-golos',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: colors.background.primary },
        { name: 'secondary', value: colors.background.secondary },
        { name: 'tertiary', value: colors.background.tertiary },
      ],
    },
    a11y: {
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <div className={`${golosText.variable} font-golos`}>
        <Story />
      </div>
    ),
  ],
}

export default preview
