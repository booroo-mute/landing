import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ButtonPrimary from '@/components/ButtonPrimary'

const meta: Meta<typeof ButtonPrimary> = {
  title: 'Components/ButtonPrimary',
  component: ButtonPrimary,
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

type Story = StoryObj<typeof ButtonPrimary>

export const Default: Story = {
  args: {
    children: 'Скачать',
  },
}

export const WithIcon: Story = {
  args: {
    children: 'Скачать',
    icon: '/icon.svg',
  },
}
