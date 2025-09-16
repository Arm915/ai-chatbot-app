<template>
    <nav class="flex items-center justify-between bg-white px-6 py-3 shadow-md">
        <h1 class="text-xl font-bold text-blue-600 hover:text-blue-700">
            AI ChatBot
        </h1>

        <div v-if="auth.isLoggedIn">
            <button @click="handleLogout"
                class="rounded-md border border-red-500 px-4 py-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white">
                Logout
            </button>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from "../stores/auth"
import { useRouter } from "vue-router"

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    auth.logout()
    router.push("/login")
}
</script>
