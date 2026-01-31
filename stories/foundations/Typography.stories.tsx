import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { typography } from '@/lib/tokens'

const textStyles = Object.values(typography).map((style) => ({
  ...style,
  specs: `${style.fontSize} / ${style.lineHeight} / ${style.fontWeight}`,
}))

function TypographyPage() {
  return (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="title-large mb-8">Text Styles</h2>
        <div className="space-y-8">
          {textStyles.map((style) => (
            <div key={style.className} className="border-b border-white/10 pb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-text-secondary text-sm font-mono">.{style.className}</span>
                <span className="text-text-secondary text-sm">{style.specs}</span>
              </div>
              <p className={style.className}>
                Быстрая коричневая лиса перепрыгнула через ленивую собаку
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Foundations/Typography',
  component: TypographyPage,
}

export default meta

type Story = StoryObj

export const Default: Story = {}
