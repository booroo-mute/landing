import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ReleaseCard from '@/components/ReleaseCard'

const meta: Meta<typeof ReleaseCard> = {
  title: 'Components/ReleaseCard',
  component: ReleaseCard,
}

export default meta

type Story = StoryObj<typeof ReleaseCard>

export const Default: Story = {}
