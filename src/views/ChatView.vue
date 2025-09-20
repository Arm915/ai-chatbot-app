<template>
    <section class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div class="mx-auto flex min-h-screen max-w-6xl px-2 py-8">
            <div class="hidden lg:block">
                <TopicSidebar />
            </div>

            <div
                class="flex-1 flex flex-col rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">

                <header class="mb-0 flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div
                        class="flex size-10 items-center justify-center rounded-2xl bg-white shadow ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-gray-700 dark:text-gray-200"
                            viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 2a1 1 0 011 1v1.055A8.003 8.003 0 0120 12v6a3 3 0 01-3 3h-1a1 1 0 110-2h1a1 1 0 001-1v-1H6v1a1 1 0 001 1h1a1 1 0 110 2H7a3 3 0 01-3-3v-6a8.003 8.003 0 017-7.945V3a1 1 0 011-1zm6 11v-1a6 6 0 10-12 0v1h12z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-extrabold text-gray-900 dark:text-white">
                        {{ currentTitle }}
                    </h3>

                    <div class="text-end lg:ml-auto lg:hidden">
                        <HeaderActions />
                    </div>
                </header>

                <div class="flex-1 overflow-y-auto p-4 sm:p-6">
                    <MessageList />
                </div>

                <div
                    class="sticky bottom-0 border-t border-gray-200 bg-white/90 p-3 backdrop-blur dark:border-gray-700 dark:bg-gray-800/90">
                    <ChatBox />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import ChatBox from "../components/ChatBox.vue"
import MessageList from "../components/MessageList.vue"
import TopicSidebar from "../components/TopicSidebar.vue"
import HeaderActions from "../components/HeaderActions.vue"
import { useChatStore } from "../stores/chat"
import { computed } from "vue"

const chat = useChatStore()

const currentTitle = computed(() => {
    const t = chat.topics.find(x => x._id === chat.currentTopicId)
    return t ? t.title : "หัวข้อใหม่"
})
</script>
