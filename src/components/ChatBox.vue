<template>
    <form @submit.prevent="submit"
        class="flex w-full items-center gap-2 rounded-2xl bg-white shadow ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
        <input v-model="text" type="text" inputmode="text" autocomplete="off" :disabled="loading"
            placeholder="พิมพ์คำถาม..."
            class="flex-1 rounded-xl border border-transparent bg-gray-50 px-4 py-2 text-gray-900 placeholder:text-gray-400
             focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
             disabled:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
            @keydown.enter.exact.prevent="submit" />

        <button type="submit" :disabled="loading || !text.trim()" class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white
             hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300
             disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700"
            aria-label="ส่งข้อความ">
            <span v-if="loading"
                class="mr-2 inline-block size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="mr-2 size-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            ส่ง
        </button>
    </form>
</template>

<script setup>
import { ref, computed } from "vue"
import { useChatStore } from "../stores/chat"

const chat = useChatStore()
const text = ref("")
const loading = computed(() => chat.loading)

const submit = async () => {
    const q = text.value.trim()
    if (!q || loading.value) return
    await chat.ask(q)
    text.value = ""
}
</script>
