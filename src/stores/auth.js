import { defineStore } from "pinia"
import http from "../api/http"

export const useAuthStore = defineStore("auth", {
    state: () => ({        
        token: localStorage.getItem("token") || "",
        user: JSON.parse(localStorage.getItem("user") || "null"),
    }),
    actions: {
        async register(payload) {
            await http.post("/auth/register", payload)
        },
        async login(payload) {
            const { data } = await http.post("/auth/login", payload)
            this.token = data.token
            this.user = data.user
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.user))
        },
        logout() {
            this.token = ""
            this.user = null
            localStorage.removeItem("token")
            localStorage.removeItem("user")
        },
        get isLoggedIn() { return !!this.token }
    },
})
