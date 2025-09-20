import { defineStore } from "pinia"
import http from "../api/http"

export const useChatStore = defineStore("chat", {
    state: () => ({
        currentTopicId: null,
        topics: [],
        topicsPage: 1,
        topicsLimit: 20,
        topicsHasMore: true,
        topicsLoading: false,

        messages: [],
        loading: false,
    }),

    actions: {
        startNewTopic() {
            this.currentTopicId = null
            this.messages = []
        },

        async fetchMyTopics({ reset = false } = {}) {
            if (this.topicsLoading) return
            this.topicsLoading = true
            try {
                if (reset) {
                    this.topicsPage = 1
                    this.topics = []
                    this.topicsHasMore = true
                }
                if (!this.topicsHasMore) return

                const { data } = await http.get("/topics/mine", {
                    params: { page: this.topicsPage, limit: this.topicsLimit },
                })
                this.topics.push(...data.items)
                this.topicsHasMore = data.hasMore
                if (data.hasMore) this.topicsPage += 1
            } finally {
                this.topicsLoading = false
            }
        },

        async openTopic(topicId) {
            this.currentTopicId = topicId
            const { data } = await http.get(`/histories/by-topic/${topicId}`)
            this.messages = data.flatMap(h => ([
                { role: "user", text: h.question, ts: h.createdAt },
                { role: "ai", text: h.answer, ts: h.createdAt },
            ]))
        },

        async ask(question) {
            this.loading = true
            try {
                this.messages.push({ role: "user", text: question, ts: Date.now() })
                const payload = this.currentTopicId
                    ? { topicId: this.currentTopicId, question }
                    : { question, title: question.slice(0, 60) }

                const { data } = await http.post("/chat", payload)

                if (data.topicId && !this.currentTopicId) {
                    this.currentTopicId = data.topicId
                    await this.fetchMyTopics({ reset: true })
                } else {
                    await this.fetchMyTopics({ reset: true })
                }

                this.messages.push({ role: "ai", text: data.answer, ts: Date.now() })
            } finally {
                this.loading = false
            }
        },
    },
})
