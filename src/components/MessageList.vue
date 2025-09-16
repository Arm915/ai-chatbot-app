<template>
    <div class="mt-3">
        <div v-for="m in chat.messages" :key="m.ts" class="mb-2">
            <div :class="m.role === 'user' ? 'text-end' : 'text-start'">
                <span class="badge" :class="m.role === 'user' ? 'bg-primary' : 'bg-secondary'">{{ m.role }}</span>
                <div class="p-2 border rounded mt-1">{{ m.text }}</div>
            </div>
        </div>
        <div v-if="chat.loading" class="text-muted mt-2">กำลังถาม AI ...</div>
    </div>
</template>

<script setup>
import { useChatStore } from "../stores/chat"
const chat = useChatStore()
</script>
