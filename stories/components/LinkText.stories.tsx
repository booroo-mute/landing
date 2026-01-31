import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import LinkText from '@/components/LinkText'

const meta: Meta<typeof LinkText> = {
  title: 'Components/LinkText',
  component: LinkText,
  argTypes: {
    children: {
      control: 'text',
      description: 'Link text',
    },
    href: {
      control: 'text',
      description: 'Link URL',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta

type Story = StoryObj<typeof LinkText>

export const Default: Story = {
  args: {
    children: 'Другие платформы',
    href: '#',
  },
}
