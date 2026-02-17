<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Chat</h1>
      <p class="hdr-crumb">Participant Management / Chat</p>
    </div>

    <div class="chat-shell">
      <div class="chat-list">
        <div class="chat-list-head">
          <input
            v-model="chatSearch"
            class="chat-list-search"
            placeholder="Search participants…"
          />
        </div>
        <div
          v-for="c in filteredContacts"
          :key="c.id"
          class="chat-item"
          :class="{ active: activeContact && activeContact.id === c.id }"
          @click="selectContact(c)"
        >
          <div class="avatar">{{ c.initials }}</div>
          <div style="flex: 1; min-width: 0">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <span class="chat-name">{{ c.name }}</span>
              <span class="chat-time">{{ c.time }}</span>
            </div>
            <p class="chat-preview">{{ c.preview }}</p>
          </div>
          <div
            v-if="c.unread"
            style="
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #e91e63;
              color: #fff;
              font-size: 11px;
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            "
          >
            {{ c.unread }}
          </div>
        </div>
      </div>

      <div class="chat-main">
        <template v-if="activeContact">
          <div class="chat-header">
            <div class="avatar">{{ activeContact.initials }}</div>
            <div>
              <div class="chat-header-name">{{ activeContact.name }}</div>
              <div class="chat-header-sub">Study Participant</div>
            </div>
          </div>

          <div class="chat-messages">
            <div
              v-for="(m, i) in currentMessages"
              :key="i"
              class="msg"
              :class="m.from"
            >
              <div class="msg-bubble">{{ m.text }}</div>
              <span class="msg-time">{{ m.time }}</span>
            </div>
          </div>

          <div class="chat-input-row">
            <input
              v-model="msgInput"
              class="chat-input"
              placeholder="Type a message…"
              @keyup.enter="sendMsg"
            />
            <button class="chat-send" @click="sendMsg">
              <i class="mdi mdi-send" style="font-size: 18px"></i>
            </button>
          </div>
        </template>

        <div v-else class="empty-state">
          <i class="mdi mdi-chat-outline"></i>
          <p class="empty-title">Select a conversation</p>
          <p class="empty-sub">Choose a participant from the list</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";

const chatSearch = useLocalStorage("onboard_chat_search", "");
const msgInput = ref("");
const activeContactId = useLocalStorage("onboard_chat_active", 1);

const contacts = ref([
  {
    id: 1,
    name: "Ramvasanth Mahendran",
    initials: "RM",
    preview: "Sure, I'll take it tonight",
    time: "2m ago",
    unread: 0,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    initials: "SJ",
    preview: "Can I change my dosage?",
    time: "1h ago",
    unread: 2,
  },
  {
    id: 3,
    name: "Michael Chen",
    initials: "MC",
    preview: "I missed the survey, sorry",
    time: "3h ago",
    unread: 1,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    initials: "ER",
    preview: "Feeling much better this week!",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 5,
    name: "David Kim",
    initials: "DK",
    preview: "Is the product available yet?",
    time: "2 days ago",
    unread: 0,
  },
  {
    id: 6,
    name: "Jessica Thompson",
    initials: "JT",
    preview: "Completed week 4 survey",
    time: "3 days ago",
    unread: 0,
  },
]);

const DEFAULT_MESSAGES = {
  1: [
    {
      from: "them",
      text: "Hello, I received my study kit today!",
      time: "10:00 AM",
    },
    {
      from: "me",
      text: "Great! Please follow the dosage instructions in the kit.",
      time: "10:05 AM",
    },
    { from: "them", text: "Should I take it with food?", time: "10:08 AM" },
    {
      from: "me",
      text: "Yes, it is best taken with a meal.",
      time: "10:10 AM",
    },
    { from: "them", text: "Sure, I'll take it tonight", time: "10:12 AM" },
  ],
  2: [
    {
      from: "them",
      text: "Hi, I have a question about my dosage.",
      time: "9:00 AM",
    },
    {
      from: "me",
      text: "Of course, what would you like to know?",
      time: "9:05 AM",
    },
    { from: "them", text: "Can I change my dosage?", time: "9:06 AM" },
  ],
  3: [
    { from: "them", text: "Hi, I missed yesterday's survey.", time: "8:00 AM" },
    { from: "them", text: "I missed the survey, sorry", time: "8:01 AM" },
  ],
  4: [
    { from: "them", text: "Week 4 check-in done!", time: "Yesterday" },
    { from: "me", text: "Excellent, thank you!", time: "Yesterday" },
    { from: "them", text: "Feeling much better this week!", time: "Yesterday" },
  ],
  5: [
    { from: "them", text: "Is the product available yet?", time: "2 days ago" },
  ],
  6: [
    { from: "them", text: "Completed week 4 survey", time: "3 days ago" },
    { from: "me", text: "Thank you Jessica!", time: "3 days ago" },
  ],
};

const messageMap = useLocalStorage("onboard_chat_messages", DEFAULT_MESSAGES);

const activeContact = computed(
  () =>
    contacts.value.find((c) => c.id === activeContactId.value) ||
    contacts.value[0]
);

const filteredContacts = computed(() => {
  const sq = chatSearch.value.trim().toLowerCase();
  return sq
    ? contacts.value.filter((c) => c.name.toLowerCase().includes(sq))
    : contacts.value;
});

const currentMessages = computed(() => {
  if (!activeContact.value) return [];
  return messageMap.value[activeContact.value.id] || [];
});

function selectContact(c) {
  activeContactId.value = c.id;
}

function sendMsg() {
  if (!msgInput.value.trim() || !activeContact.value) return;
  const id = activeContact.value.id;
  if (!messageMap.value[id]) messageMap.value[id] = [];
  messageMap.value[id] = [
    ...messageMap.value[id],
    {
      from: "me",
      text: msgInput.value,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];
  msgInput.value = "";
}
</script>
