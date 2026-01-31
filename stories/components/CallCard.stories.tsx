import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CallCard from '@/components/CallCard'

const meta: Meta<typeof CallCard> = {
  title: 'Components/CallCard',
  component: CallCard,
}

export default meta

type Story = StoryObj<typeof CallCard>

export const Default: Story = {}
