import { defineStore } from "pinia"
import http from "../api/http"

export const useChatStore = defineStore("chat", {
    state: () => ({
        messages: [],   // [{role:"user"/"ai", text, ts}]
        loading: false,
    }),
    actions: {
        async ask(question) {
            this.loading = true
            try {
                this.messages.push({ role: "user", text: question, ts: Date.now() })
                const { data } = await http.post("/chat", { question })
                this.messages.push({ role: "ai", text: data.answer, ts: Date.now() })
            } finally {
                this.loading = false
            }
        },
        async fetchHistory() {
            const { data } = await http.get("/history") // [{question, answer, createdAt}]
            this.messages = []
            data.forEach(h => {
                this.messages.push({ role: "user", text: h.question, ts: h.createdAt })
                this.messages.push({ role: "ai", text: h.answer, ts: h.createdAt })
            })
        }
    },
})
