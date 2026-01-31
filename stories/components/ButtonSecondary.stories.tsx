import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ButtonSecondary from '@/components/ButtonSecondary'

const meta: Meta<typeof ButtonSecondary> = {
  title: 'Components/ButtonSecondary',
  component: ButtonSecondary,
  argTypes: {
    children: {
      control: 'text',
      description: 'Button label',
    },
    icon: {
      control: 'text',
      description: 'Path to icon image',
    },
  },
}

export default meta

type Story = StoryObj<typeof ButtonSecondary>

export const Default: Story = {
  args: {
    children: 'Подробнее',
  },
}

export const WithIcon: Story = {
  args: {
    children: 'Подробнее',
    icon: '/icon.svg',
  },
}
