import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import PostCard from '@/components/PostCard'

const meta: Meta<typeof PostCard> = {
  title: 'Components/PostCard',
  component: PostCard,
}

export default meta

type Story = StoryObj<typeof PostCard>

export const WithPoster: Story = {
  args: {
    href: '/games/dota-2',
    title: 'Голосовой чат в Dota 2: настройка, почему вас не слышно и созвон для стака',
    description:
      'Две кнопки войса в Dota 2 (команда и пати), настройка микрофона и чеклист «меня не слышно».',
    date: '2026-09-07',
    image: '/games/golosovoy-chat-v-dota-2.webp',
  },
}

export const TextOnly: Story = {
  args: {
    href: '/releases/avgust-2026-nadezhnost',
    title: 'Августовское обновление: звонки надёжнее и быстрее',
    description:
      'Соединение готово ещё до ответа, чистый звук на Bluetooth и микрофон, который оживает сам.',
    date: '2026-08-28',
  },
}
