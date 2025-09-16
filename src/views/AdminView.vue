<template>
    <div class="container py-4">
        <h3>History (Admin)</h3>
        <button class="btn btn-outline-primary mb-3" @click="chat.fetchHistory()">รีเฟรช</button>
        <MessageList />
    </div>
</template>

<script setup>
import { useChatStore } from "../stores/chat"
import MessageList from "../components/MessageList.vue"
const chat = useChatStore()
</script>
