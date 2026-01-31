import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { fonts } from '@/lib/tokens'

const fontsList = [
  {
    ...fonts.golos,
    description: 'Основной шрифт для интерфейса',
    fontFamily: 'var(--font-golos), sans-serif',
  },
  {
    ...fonts.offbit,
    description: 'Акцентный шрифт для заголовков',
    fontFamily: fonts.offbit.family,
  },
]

function FontsPage() {
  return (
    <div className="p-8 space-y-12">
      {fontsList.map((font) => (
        <div key={font.name}>
          <div className="mb-6">
            <h2 className="title-large">{font.name}</h2>
            <p className="text-text-secondary mt-2">{font.description}</p>
            <p className="text-text-secondary text-sm font-mono mt-1">{font.variable}</p>
          </div>

          <div className="space-y-4">
            {font.weights.map((weight) => (
              <div
                key={weight}
                className="flex items-baseline gap-6 border-b border-white/10 pb-4"
              >
                <span className="text-text-secondary text-sm w-24">
                  {weight}
                </span>
                <p
                  className="text-text-primary text-2xl"
                  style={{
                    fontFamily: font.fontFamily,
                    fontWeight: weight,
                  }}
                >
                  Быстрая коричневая лиса 0123456789
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const meta: Meta = {
  title: 'Foundations/Fonts',
  component: FontsPage,
}

export default meta

type Story = StoryObj

export const Default: Story = {}
