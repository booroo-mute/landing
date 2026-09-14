import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CtaBanner from '@/components/CtaBanner'
import { OSProvider } from '@/components/OSProvider'

const meta: Meta<typeof CtaBanner> = {
  title: 'Components/CtaBanner',
  component: CtaBanner,
  // useOS() требует провайдер; в браузере Storybook определится реальная ОС
  decorators: [
    (Story) => (
      <OSProvider>
        <div className="max-w-[920px]">
          <Story />
        </div>
      </OSProvider>
    ),
  ],
  argTypes: {
    compact: { control: 'boolean', description: 'Компактная однострочная версия для середины статьи' },
    heading: { control: 'text', description: 'Заголовок (в компактной версии — первая строка)' },
    text: { control: 'text', description: 'Подводка (в компактной версии — вторая строка)' },
  },
}

export default meta

type Story = StoryObj<typeof CtaBanner>

export const Full: Story = {
  args: {},
}

export const Compact: Story = {
  args: { compact: true },
}

export const CustomCopy: Story = {
  args: {
    heading: 'Созвон для пати без VPN',
    text: 'Комната до 8 человек, демонстрация экрана и ноль настроек. Зарегистрируйся и зови своих по ссылке.',
  },
}
