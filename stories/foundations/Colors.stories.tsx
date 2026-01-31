import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { colors } from '@/lib/tokens'

const colorGroups = {
  backgrounds: [
    { name: 'Primary', variable: '--background-primary', value: colors.background.primary },
    { name: 'Secondary', variable: '--background-secondary', value: colors.background.secondary },
    { name: 'Tertiary', variable: '--background-tertiary', value: colors.background.tertiary },
  ],
  text: [
    { name: 'Primary', variable: '--text-primary', value: colors.text.primary },
    { name: 'Secondary', variable: '--text-secondary', value: colors.text.secondary },
  ],
  accent: [
    { name: 'Accent', variable: '--accent', value: colors.accent },
  ],
}

function ColorSwatch({ name, variable, value }: { name: string; variable: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded border border-white/10"
        style={{ backgroundColor: value }}
      />
      <div>
        <p className="text-text-primary font-medium">{name}</p>
        <p className="text-text-secondary text-sm">{variable}</p>
        <p className="text-text-secondary text-sm font-mono">{value}</p>
      </div>
    </div>
  )
}

function ColorsPage() {
  return (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="title-large mb-8">Backgrounds</h2>
        <div className="grid grid-cols-3 gap-6">
          {colorGroups.backgrounds.map((color) => (
            <ColorSwatch key={color.variable} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="title-large mb-8">Text</h2>
        <div className="grid grid-cols-3 gap-6">
          {colorGroups.text.map((color) => (
            <ColorSwatch key={color.variable} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="title-large mb-8">Accent</h2>
        <div className="grid grid-cols-3 gap-6">
          {colorGroups.accent.map((color) => (
            <ColorSwatch key={color.variable} {...color} />
          ))}
        </div>
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Foundations/Colors',
  component: ColorsPage,
}

export default meta

type Story = StoryObj

export const Default: Story = {}
