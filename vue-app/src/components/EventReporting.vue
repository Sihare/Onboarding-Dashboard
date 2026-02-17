<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Event Reporting</h1>
      <p class="hdr-crumb">Participant Management / Event Reporting</p>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <p class="stat-label">Total Events</p>
        <p class="stat-value">{{ events.length }}</p>
        <p class="stat-sub">All time</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">High Severity</p>
        <p class="stat-value stat-down">{{ highCount }}</p>
        <p class="stat-sub">Requires review</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">This Month</p>
        <p class="stat-value">3</p>
        <p class="stat-sub stat-up">↑ 1 from last month</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Resolved</p>
        <p class="stat-value stat-up">5</p>
        <p class="stat-sub">Out of 8</p>
      </div>
    </div>

    <p class="count">
      All events (<span>{{ events.length }}</span
      >)
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Event Type</th>
          <th>Participant</th>
          <th>Survey</th>
          <th>Date</th>
          <th>Severity</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in events" :key="e.id">
          <td style="font-weight: 500; color: #1a1c2e">{{ e.event }}</td>
          <td class="td-name">{{ e.participant }}</td>
          <td style="color: #666">{{ e.survey }}</td>
          <td class="td-date">{{ e.date }}</td>
          <td>
            <span class="status-pill" :class="sevClass[e.severity]">{{
              e.severity
            }}</span>
          </td>
          <td>
            <button class="eye-btn"><i class="mdi mdi-eye-outline"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { uid } from "@/utils/helpers";
import { useLocalStorage } from "@/composables/useLocalStorage";

const DEFAULT_EVENTS = [
  {
    id: uid(),
    event: "Survey Completed",
    participant: "Ramvasanth Mahendran",
    survey: "Core – Week 4",
    date: "February 10, 2025",
    severity: "Info",
  },
  {
    id: uid(),
    event: "Adverse Event Reported",
    participant: "Sarah Johnson",
    survey: "Core – Week 3",
    date: "February 8, 2025",
    severity: "High",
  },
  {
    id: uid(),
    event: "Survey Skipped",
    participant: "Michael Chen",
    survey: "Core – Week 4",
    date: "February 10, 2025",
    severity: "Medium",
  },
  {
    id: uid(),
    event: "Study Dropout",
    participant: "Amanda Foster",
    survey: "—",
    date: "January 12, 2024",
    severity: "High",
  },
  {
    id: uid(),
    event: "Protocol Deviation",
    participant: "David Kim",
    survey: "Baseline Survey 1",
    date: "December 5, 2023",
    severity: "Medium",
  },
  {
    id: uid(),
    event: "Late Survey Submission",
    participant: "Emily Rodriguez",
    survey: "Core – Week 2",
    date: "November 18, 2023",
    severity: "Low",
  },
  {
    id: uid(),
    event: "Survey Completed",
    participant: "Jessica Thompson",
    survey: "Core – Week 4",
    date: "February 9, 2025",
    severity: "Info",
  },
  {
    id: uid(),
    event: "Product Not Taken",
    participant: "Robert Williams",
    survey: "Core – Week 1",
    date: "January 8, 2024",
    severity: "Medium",
  },
];

const events = useLocalStorage("onboard_events", DEFAULT_EVENTS);

const sevClass = {
  High: "pill-red",
  Medium: "pill-amber",
  Low: "pill-blue",
  Info: "pill-green",
};

const highCount = computed(
  () => events.value.filter((e) => e.severity === "High").length
);
</script>
