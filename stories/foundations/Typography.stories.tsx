import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { typography } from '@/lib/tokens'

const textStyles = Object.values(typography).map((style) => ({
  ...style,
  specs: {
    mobile: `${style.mobile.fontSize} / ${style.mobile.lineHeight}`,
    tablet: `${style.tablet.fontSize} / ${style.tablet.lineHeight}`,
    desktop: `${style.desktop.fontSize} / ${style.desktop.lineHeight}`,
  },
}))

function TypographyPage() {
  return (
    <div className="p-8 space-y-12">
      <div>
        <h2 className="title-large mb-8">Text Styles</h2>
        <div className="space-y-8">
          {textStyles.map((style) => (
            <div key={style.className} className="border-b border-white/10 pb-6">
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-text-secondary text-sm font-mono">.{style.className}</span>
                  <span className="text-text-secondary text-sm">weight: {style.fontWeight}</span>
                </div>
                <div className="flex gap-6 text-text-secondary text-sm">
                  <span>Mobile: {style.specs.mobile}</span>
                  <span>Tablet: {style.specs.tablet}</span>
                  <span>Desktop: {style.specs.desktop}</span>
                </div>
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
