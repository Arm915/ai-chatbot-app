<template>
    <div class="container py-4">
        <h3>ถาม–ตอบกับ AI</h3>
        <ChatBox />
        <MessageList />
    </div>
</template>

<script setup>
import ChatBox from "../components/ChatBox.vue"
import MessageList from "../components/MessageList.vue"
</script>
