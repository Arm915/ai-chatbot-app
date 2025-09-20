<template>
    <aside class="w-64 flex-shrink-0 pr-4">
        <div class="mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-blue-600 dark:text-blue-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">ประวัติการคุย</h2>
            <button
                class="rounded-lg border border-red-300 px-2 py-1 text-xs hover:bg-red-50 dark:border-red-700 dark:text-white dark:bg-red-600 dark:hover:bg-red-900"
                @click="handleLogout" aria-label="ออกจากระบบ">
                Logout
            </button>
        </div>

        <div class="mb-3">
            <input v-model="q" type="text" placeholder="ค้นหาหัวข้อ..." class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
                    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                    dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        </div>

        <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            <template v-if="filtered.length">
                <button v-for="t in filtered" :key="t._id"
                    class="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    :class="t._id === chat.currentTopicId ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''"
                    @click="open(t._id)">
                    <div class="truncate dark:text-white">{{ t.title || 'ไม่มีชื่อหัวข้อ' }}</div>
                    <p class="text-xs text-gray-200">
                        {{ t.lastAskedAt ? new Date(t.lastAskedAt).toLocaleString() : '' }}
                    </p>
                </button>
            </template>

            <div v-else
                class="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                ยังไม่มีหัวข้อหรือไม่พบผลการค้นหา
            </div>
        </div>

        <div class="mt-3">
            <button class="w-full rounded-lg border border-gray-300 bg-white py-2 text-sm hover:bg-gray-50
               disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                :disabled="!chat.topicsHasMore || chat.topicsLoading" @click="loadMore">
                <span v-if="chat.topicsLoading">กำลังโหลด...</span>
                <span v-else-if="chat.topicsHasMore">โหลดหัวข้อเก่า</span>
                <span v-else>ไม่มีหัวข้อเพิ่มแล้ว</span>
            </button>
        </div>

        <button
            class="mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            @click="newTopic">
            + เริ่มหัวข้อใหม่
        </button>
    </aside>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useChatStore } from "../stores/chat"
import { useAuthStore } from "../stores/auth"
import { useRouter } from "vue-router"

const auth = useAuthStore()
const router = useRouter()

const chat = useChatStore()
const q = ref("")

onMounted(() => {
    chat.fetchMyTopics({ reset: true }).catch(() => { })
})

const filtered = computed(() => {
    const kw = q.value.trim().toLowerCase()
    if (!kw) return chat.topics
    return chat.topics.filter(t => (t.title || '').toLowerCase().includes(kw))
})

function open(tid) {
    if (tid === chat.currentTopicId) return
    chat.openTopic(tid)
}
function newTopic() {
    chat.startNewTopic()
}
function loadMore() {
    chat.fetchMyTopics()
}
const handleLogout = () => {
    auth.logout()
    chat.startNewTopic()
    router.push("/login")
}
</script>