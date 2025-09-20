import { defineStore } from "pinia"
import http from "../api/http"

export const useAdminChatStore = defineStore("adminChat", {
    state: () => ({
        topics: [],
        currentTopicId: null,
        messages: [],
        loading: false,
    }),
    actions: {
        async fetchAllTopics() {
            const { data } = await http.get("/admin/topics")
            this.topics = data
        },
        async openTopic(topicId) {
            this.currentTopicId = topicId
            const { data } = await http.get(`/admin/histories/${topicId}`)
            this.messages = data.flatMap(h => ([
                { role: "user", text: h.question, ts: h.createdAt, user: h.userName },
                { role: "ai", text: h.answer, ts: h.createdAt }
            ]))
        },
    },
})
