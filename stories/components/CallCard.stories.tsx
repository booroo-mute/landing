import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CallCard from '@/components/CallCard'

const meta: Meta<typeof CallCard> = {
  title: 'Components/CallCard',
  component: CallCard,
  args: {
    title: 'Звони как удобно',
    description: 'Разговоры 1-1 и комнаты до 8 участников',
    imageSrc: '/calls.png',
    imageAlt: 'Интерфейс звонка в Mute',
  },
}

export default meta

type Story = StoryObj<typeof CallCard>

export const Default: Story = {}
