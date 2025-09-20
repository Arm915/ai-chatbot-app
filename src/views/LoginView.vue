<template>
    <section class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-300">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
            <p href="#" class="flex items-center mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                AI ChatBot
            </p>

            <div
                class="w-full bg-white rounded-2xl shadow-lg transition hover:shadow-2xl md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border dark:border-gray-700">
                <div class="p-8 space-y-6">
                    <h1
                        class="text-2xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
                        Login
                    </h1>

                    <form @submit.prevent="onSubmit" class="space-y-6">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Email
                            </label>
                            <input type="email" id="email" v-model="email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="name@company.com" required />
                        </div>

                        <div>
                            <label for="password"
                                class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Password
                            </label>
                            <input type="password" id="password" v-model="password" placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required />
                        </div>
                        <button type="submit" :disabled="loading"
                            class="w-full flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700">
                            <span v-if="loading"
                                class="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                            Login
                        </button>

                        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don’t have an account yet?
                            <button type="button" @click="showRegister = true"
                                class="font-medium text-blue-400 hover:underline">
                                Sign up here
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>

        <RegisterModal v-model="showRegister" title="Create an account" @submit="handleRegister" />
    </section>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "../stores/auth"
import { useRouter } from "vue-router"
import RegisterModal from "../components/RegisterModal.vue"

const email = ref("")
const password = ref("")
const loading = ref(false)
const showRegister = ref(false)

const auth = useAuthStore()
const router = useRouter()

const onSubmit = async () => {
    loading.value = true
    try {
        await auth.login({ email: email.value, password: password.value })

        if (auth.user?.role === "admin") {
            router.push("/admin")
        } else {
            router.push("/")
        }
    } catch (e) {
        alert("เข้าสู่ระบบไม่สำเร็จ")
    } finally {
        loading.value = false
    }
}

const handleRegister = async ({ username, email, password }, done) => {
    if (typeof auth.register !== "function") {
        return done({ statusCode: 500, message: "ยังไม่ได้เชื่อมต่อระบบสมัครสมาชิก" })
    }

    try {
        await auth.register({ username, email, password })
        done(null)

        try {
            await auth.login({ email, password })
            router.push("/")
        } catch {
        }
    } catch (e) {
        const status = e?.statusCode || e?.response?.status || e?.status || 500
        const msgFromApi =
            e?.message ||
            e?.response?.data?.message ||
            (status === 409 ? "Email already registered" : "Register failed")
        return done({ statusCode: status, message: msgFromApi })
    }
}
</script>
