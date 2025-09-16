<template>
    <form @submit.prevent="submit" class="d-flex gap-2">
        <input v-model="text" class="form-control" placeholder="พิมพ์คำถาม..." :disabled="loading" />
        <button class="btn btn-success" :disabled="loading || !text.trim()">ส่ง</button>
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
    if (!q) return
    await chat.ask(q)
    text.value = ""
}
</script>
