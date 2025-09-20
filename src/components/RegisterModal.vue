<template>
  <teleport to="body">
    <transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center" @keydown.esc="close"
        role="dialog" aria-modal="true" :aria-busy="submitting ? 'true' : 'false'" aria-labelledby="register-title">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="close"></div>

        <transition appear enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100" leave-active-class="duration-150 ease-in"
          leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div
            class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
            <div class="mb-4 flex items-start justify-between">
              <h4 id="register-title" class="text-xl font-extrabold text-gray-900 dark:text-white">
                {{ title }}
              </h4>
              <button type="button" @click="close"
                class="inline-flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-300 dark:text-gray-400 dark:hover:bg-gray-700/50"
                aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="onSubmit" class="space-y-4">
              <div>
                <label for="reg-userName" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  You name
                </label>
                <div class="relative">
                  <input ref="userNameInput" v-model="userName" id="reg-userName" type="userName"
                    autocomplete="userName" placeholder="name" required class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900
                           focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                           dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                </div>
              </div>

              <div>
                <label for="reg-email" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Your email
                </label>
                <div class="relative">
                  <input ref="emailInput" v-model="email" id="reg-email" type="email" autocomplete="email"
                    placeholder="name@company.com" required :aria-invalid="emailTaken ? 'true' : 'false'"
                    :aria-describedby="emailTaken ? 'reg-email-error' : null" class="w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-gray-900
             focus:outline-none focus:ring-2
             dark:bg-gray-700 dark:text-white" :class="emailTaken
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'" />
                </div>
                <p v-if="emailTaken" id="reg-email-error" class="mt-3 text-sm text-red-600 dark:text-red-400">
                  อีเมลนี้ถูกใช้งานแล้ว
                </p>
              </div>

              <div>
                <label for="reg-password" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Password
                </label>
                <input v-model="password" id="reg-password" type="password" autocomplete="new-password"
                  placeholder="••••••••" required class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>

              <div>
                <label for="reg-confirm" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Confirm password
                </label>
                <input v-model="confirm" id="reg-confirm" type="password" autocomplete="new-password"
                  placeholder="••••••••" required class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900
                         focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              </div>

              <div class="mt-2 grid grid-cols-2 gap-3">
                <button type="button" @click="close" class="rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 transition
                         hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700/40">
                  Login here
                </button>

                <button type="submit" :disabled="!canSubmit || submitting" class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition
                         hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300
                         disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700">
                  <span v-if="submitting"
                    class="mr-2 inline-block size-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>{{ submitting ? "Create an account..." : "Create an account" }}</span>
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from "vue"

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "Create an account" },
})
const emit = defineEmits(["update:modelValue", "submit"])

const userName = ref("")
const email = ref("")
const password = ref("")
const confirm = ref("")
const error = ref("")
const submitting = ref(false)
const emailTaken = ref(false)
const emailInput = ref(null)

const focusEmail = async () => {
  await nextTick()
  emailInput.value?.focus()
}

watch(() => props.modelValue, (open) => {
  if (open) {
    userName.value = ""
    email.value = ""
    password.value = ""
    confirm.value = ""
    error.value = ""
    emailTaken.value = false
    document.body.classList.add("overflow-hidden")
    focusEmail()
  } else {
    document.body.classList.remove("overflow-hidden")
  }
}, { immediate: true })

watch(email, () => {
  if (emailTaken.value) emailTaken.value = false
  if (error.value === "อีเมลนี้ถูกใช้งานแล้ว" || error.value === "Email already registered") {
    error.value = ""
  }
})

const close = () => emit("update:modelValue", false)

const canSubmit = computed(() => {
  const okUserName = !!userName.value && userName.value.length >= 3
  const okEmail = !!email.value && /\S+@\S+\.\S+/.test(email.value)
  const okPass = password.value?.length >= 6
  const match = password.value === confirm.value
  return okUserName && okEmail && okPass && match
})

const onSubmit = async () => {
  error.value = ""
  emailTaken.value = false
  if (password.value !== confirm.value) {
    error.value = "รหัสผ่านไม่ตรงกัน"
    return
  }
  if (password.value.length < 6) {
    error.value = "รหัสผ่านควรยาวอย่างน้อย 6 ตัวอักษร"
    return
  }

  submitting.value = true
  try {
    const err = await new Promise((resolve) => {
      emit("submit", { username: userName.value, email: email.value, password: password.value }, resolve)
    })

    if (err) {
      const status = err?.statusCode ?? err?.response?.status
      const msg = err?.message || "Create an account failed"

      if (status === 409) {
        emailTaken.value = true
        error.value = msg === "Email already registered" ? "อีเมลนี้ถูกใช้งานแล้ว" : msg
        await focusEmail()
        return
      }

      error.value = msg
      return
    }

    close()
  } finally {
    submitting.value = false
  }
}

const onEsc = (e) => {
  if (e.key === "Escape" && props.modelValue) close()
}
onMounted(() => window.addEventListener("keydown", onEsc))
onBeforeUnmount(() => window.removeEventListener("keydown", onEsc))
</script>
