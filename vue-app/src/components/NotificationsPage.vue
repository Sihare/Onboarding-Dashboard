<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Notifications</h1>
      <p class="hdr-crumb">Participant Management / Notifications</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px">
      <div>
        <p
          style="
            font-size: 15px;
            font-weight: 600;
            color: #1a1c2e;
            margin-bottom: 14px;
          "
        >
          Notification Settings
        </p>
        <div class="notif-section">
          <div class="notif-section-head" style="background: #f8f8f8">
            <span class="notif-section-title">Notification Type</span>
            <div
              style="
                display: flex;
                gap: 24px;
                font-size: 12px;
                font-weight: 600;
                color: #aaa;
              "
            >
              <span>Email</span><span>SMS</span><span>Push</span>
            </div>
          </div>
          <div v-for="n in notifications" :key="n.id" class="notif-item">
            <div class="notif-item-left">
              <span class="notif-item-label">{{ n.label }}</span>
              <span class="notif-item-sub">{{ n.sub }}</span>
            </div>
            <div style="display: flex; gap: 18px; align-items: center">
              <div
                class="toggle"
                :class="{ on: n.email }"
                @click="n.email = !n.email"
                style="width: 38px; height: 22px"
              >
                <span
                  class="knob"
                  style="width: 16px; height: 16px; top: 3px; left: 3px"
                ></span>
              </div>
              <div
                class="toggle"
                :class="{ on: n.sms }"
                @click="n.sms = !n.sms"
                style="width: 38px; height: 22px"
              >
                <span
                  class="knob"
                  style="width: 16px; height: 16px; top: 3px; left: 3px"
                ></span>
              </div>
              <div
                class="toggle"
                :class="{ on: n.push }"
                @click="n.push = !n.push"
                style="width: 38px; height: 22px"
              >
                <span
                  class="knob"
                  style="width: 16px; height: 16px; top: 3px; left: 3px"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p
          style="
            font-size: 15px;
            font-weight: 600;
            color: #1a1c2e;
            margin-bottom: 14px;
          "
        >
          Recent Notifications
        </p>
        <div class="notif-section">
          <div v-for="n in recent" :key="n.id" class="notif-item">
            <div style="display: flex; gap: 12px; align-items: flex-start">
              <i
                class="mdi"
                :class="
                  n.type === 'warn'
                    ? 'mdi-alert-circle-outline'
                    : n.type === 'success'
                    ? 'mdi-check-circle-outline'
                    : 'mdi-information-outline'
                "
                :style="{
                  color:
                    n.type === 'warn'
                      ? '#d97706'
                      : n.type === 'success'
                      ? '#16a34a'
                      : '#2563eb',
                  fontSize: '20px',
                  marginTop: '1px',
                }"
              >
              </i>
              <div>
                <p style="font-size: 13.5px; color: #333; font-weight: 500">
                  {{ n.msg }}
                </p>
                <p style="font-size: 12px; color: #aaa; margin-top: 2px">
                  {{ n.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from "@/composables/useLocalStorage";

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    label: "Survey Reminder",
    sub: "Send reminder when survey is due",
    email: true,
    sms: true,
    push: false,
  },
  {
    id: 2,
    label: "Study Update",
    sub: "Notify participants of study changes",
    email: true,
    sms: false,
    push: true,
  },
  {
    id: 3,
    label: "Missed Survey Alert",
    sub: "Alert when participant misses a survey",
    email: true,
    sms: true,
    push: true,
  },
  {
    id: 4,
    label: "Onboarding Welcome",
    sub: "Welcome message for new participants",
    email: true,
    sms: true,
    push: false,
  },
  {
    id: 5,
    label: "Product Shipment",
    sub: "Notify when product ships",
    email: true,
    sms: false,
    push: false,
  },
  {
    id: 6,
    label: "Study Completion",
    sub: "Notify at end of study",
    email: true,
    sms: true,
    push: true,
  },
];

const notifications = useLocalStorage(
  "onboard_notifications",
  DEFAULT_NOTIFICATIONS
);

const recent = [
  {
    id: 1,
    msg: "Survey reminder sent to 14 participants",
    time: "2 hours ago",
    type: "info",
  },
  {
    id: 2,
    msg: "3 participants missed the weekly survey",
    time: "1 day ago",
    type: "warn",
  },
  {
    id: 3,
    msg: "Welcome email sent to Amanda Foster",
    time: "3 days ago",
    type: "success",
  },
  {
    id: 4,
    msg: "Product shipment notification sent to Group A",
    time: "5 days ago",
    type: "success",
  },
  {
    id: 5,
    msg: "Study update broadcast to all active participants",
    time: "1 week ago",
    type: "info",
  },
];
</script>
