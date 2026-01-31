import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import FeatureItem from '@/components/FeatureItem'

const meta: Meta<typeof FeatureItem> = {
  title: 'Components/FeatureItem',
  component: FeatureItem,
}

export default meta

type Story = StoryObj<typeof FeatureItem>

export const Default: Story = {}
