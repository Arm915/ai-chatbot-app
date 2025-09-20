<template>
    <div class="ml-auto flex items-center gap-2">
        <button
            class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            @click="isOpen = true" aria-label="เปิดประวัติการคุย">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            ประวัติ
        </button>
    </div>

    <teleport to="body">
        <div v-show="isOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" @click="isOpen = false" />
        <div class="fixed inset-y-0 right-0 z-50 w-96 max-w-[90%] translate-x-full transform bg-white p-4 shadow-xl
             transition-transform duration-200 ease-out dark:bg-gray-900" :class="isOpen ? '!translate-x-0' : ''"
            role="dialog" aria-modal="true" aria-label="ประวัติการคุย">
            <div class="mb-3 flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">ประวัติการคุย</h2>
                <div class="flex items-center gap-2">
                    <button
                        class="rounded-lg border border-red-300 px-2 py-1 text-xs hover:bg-red-50 dark:border-red-700 dark:text-white dark:bg-red-600 dark:hover:bg-red-900"
                        @click="handleLogout" aria-label="ออกจากระบบ">
                        Logout
                    </button>
                    <button class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="isOpen = false"
                        aria-label="ปิด">
                        <svg xmlns="http://www.w3.org/2000/svg" class="size-5 text-gray-600 dark:text-gray-300"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="mb-3">
                <input v-model="q" type="text" placeholder="ค้นหาหัวข้อ..." class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
                 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
            </div>

            <div class="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                <template v-if="filtered.length">
                    <button v-for="t in filtered" :key="t._id"
                        class="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        :class="t._id === chat.currentTopicId ? 'bg-gray-200 dark:bg-gray-800 font-semibold' : ''"
                        @click="openTopic(t._id)">
                        <div class="truncate dark:text-white">{{ t.title || 'ไม่มีชื่อหัวข้อ' }}</div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ t.lastAskedAt ? new Date(t.lastAskedAt).toLocaleString() : '' }}
                        </p>
                    </button>
                </template>
                <div v-else
                    class="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    ยังไม่มีหัวข้อหรือไม่พบผลการค้นหา
                </div>
            </div>

            <div class="mt-3 space-y-2">
                <button
                    class="w-full rounded-lg border border-gray-300 bg-white py-2 text-sm hover:bg-gray-50
                 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
                    :disabled="!chat.topicsHasMore || chat.topicsLoading" @click="loadMore">
                    <span v-if="chat.topicsLoading">กำลังโหลด...</span>
                    <span v-else-if="chat.topicsHasMore">โหลดหัวข้อเก่า</span>
                    <span v-else>ไม่มีหัวข้อเพิ่มแล้ว</span>
                </button>

                <button
                    class="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                    @click="startNew">
                    + เริ่มหัวข้อใหม่
                </button>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useChatStore } from "../stores/chat"

const auth = useAuthStore()
const chat = useChatStore()
const router = useRouter()
const route = useRoute()

onMounted(() => chat.fetchMyTopics({ reset: true }).catch(() => { }))

const q = ref("")
const isOpen = ref(false)

const filtered = computed(() => {
    const kw = q.value.trim().toLowerCase()
    if (!kw) return chat.topics
    return chat.topics.filter(t => (t.title || "").toLowerCase().includes(kw))
})

function openTopic(tid) {
    if (tid !== chat.currentTopicId) chat.openTopic(tid)
    isOpen.value = false
}
function startNew() {
    chat.startNewTopic()
    isOpen.value = false
}
function loadMore() {
    chat.fetchMyTopics()
}
function handleLogout() {
    auth.logout()
    router.push("/login")
    isOpen.value = false
}

watch(() => route.fullPath, () => (isOpen.value = false))
</script>