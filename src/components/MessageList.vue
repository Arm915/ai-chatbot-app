<template>
    <div ref="wrap" class="mx-auto mt-4 w-full max-w-3xl space-y-3">
        <div v-for="m in chat.messages" :key="m.ts" class="flex"
            :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
            <div v-if="m.role !== 'user'"
                class="mr-2 flex size-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-gray-600 dark:text-gray-300"
                    viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm7 9a7 7 0 00-14 0v1h14v-1z" />
                </svg>
            </div>

            <div class="max-w-[80%] rounded-2xl px-4 py-2 text-sm md:text-base shadow ring-1 ring-gray-900/5" :class="m.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white text-gray-800 rounded-bl-sm dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700'">
                <div class="whitespace-pre-wrap break-words">{{ m.text }}</div>
                <div class="mt-1 text-[11px] md:text-xs opacity-70">
                    {{ m.role === 'user' ? 'คุณ' : 'AI' }} · {{ formatTime(m.ts) }}
                </div>
            </div>

            <div v-for="m in messages" :key="m.ts" class="mb-2">
                <div v-if="m.role === 'user'" class="font-semibold text-blue-600">
                    {{ m.user ? m.user + " (ผู้ใช้)" : "คุณ" }} :
                </div>
                <div v-else class="font-semibold text-green-600">AI :</div>
                <div>{{ m.text }}</div>
            </div>
        </div>

        <div v-if="chat.loading" class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div class="flex size-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3 text-gray-600 dark:text-gray-300"
                    viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            </div>
            <div class="flex items-center gap-1">
                <span
                    class="inline-block size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]"></span>
                <span class="inline-block size-2 animate-bounce rounded-full bg-gray-400"></span>
                <span class="inline-block size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></span>
            </div>
            <span class="text-sm">กำลังถาม AI ...</span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch, nextTick, ref } from "vue"
import { useChatStore } from "../stores/chat"

const chat = useChatStore()
const wrap = ref(null)

const scrollToBottom = async () => {
    await nextTick()
    wrap.value?.scrollTo({ top: wrap.value.scrollHeight, behavior: "smooth" })
}

watch(() => chat.messages.length, scrollToBottom)
watch(() => chat.loading, scrollToBottom)

onMounted(scrollToBottom)

const formatTime = (ts) => {
    try {
        const d = new Date(ts)
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch {
        return ""
    }
}
</script>

<style scoped>
:host,
.messages-container {
    max-height: 70vh;
    overflow-y: auto;
}
</style>
