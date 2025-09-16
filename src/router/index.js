import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "../stores/auth"

const LoginView = () => import("../views/LoginView.vue")
const ChatView = () => import("../views/ChatView.vue")
const AdminView = () => import("../views/AdminView.vue")

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/login", component: LoginView },
        { path: "/", component: ChatView, meta: { requiresAuth: true } },
        { path: "/admin", component: AdminView, meta: { requiresAuth: true } },
    ],
})

router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.token) return "/login"
})

export default router
