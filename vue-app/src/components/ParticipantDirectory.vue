<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Participants</h1>
      <p class="hdr-crumb">Participants / Participant Directory / {{ tab }}</p>
    </div>

    <div
      style="
        background: #fff;
        border-radius: 12px;
        padding: 10px 12px;
        margin-bottom: 20px;
        border: 1.5px solid #ebebeb;
        display: flex;
        align-items: center;
      "
    >
      <div class="status-tabs" style="margin-bottom: 0">
        <button
          v-for="t in TABS"
          :key="t"
          class="tab-btn"
          :class="{ 'tab-active': tab === t }"
          @click="tab = t"
        >
          {{ t }}
        </button>
      </div>
    </div>

    <div class="toolbar">
      <div class="search-wrap">
        <input
          v-model="phoneSearch"
          class="search-input"
          placeholder="Search by phone number"
        />
        <i class="mdi mdi-magnify search-ico"></i>
      </div>
      <div style="display: flex; gap: 10px">
        <button class="btn-settings">
          <i class="mdi mdi-cog-outline" style="font-size: 17px"></i> Settings
        </button>
        <button class="btn-solid" @click="openAdd">
          Add Participant
          <i class="mdi mdi-plus" style="margin-left: 4px; font-size: 15px"></i>
        </button>
      </div>
    </div>

    <p class="count">
      Participants <span>({{ filtered.length }})</span>
    </p>

    <table class="data-table" v-if="filtered.length">
      <thead>
        <tr>
          <th>Participant Name</th>
          <th>Phone</th>
          <th>Signup Date</th>
          <th>Verification type</th>
          <th>Status Action</th>
          <th>View details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td class="td-name">{{ p.name }}</td>
          <td class="td-phone">{{ p.phone }}</td>
          <td class="td-date">{{ p.date }}</td>
          <td class="td-vtype">{{ p.vtype }}</td>
          <td>
            <div
              class="toggle"
              :class="{ on: p.active }"
              @click="p.active = !p.active"
            >
              <span class="knob"></span>
            </div>
          </td>
          <td>
            <button class="eye-btn" @click="openView(p)">
              <i class="mdi mdi-eye-outline"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="empty-state" v-else>
      <i class="mdi mdi-account-group-outline"></i>
      <p class="empty-title">No participants</p>
      <p class="empty-sub">No participants found in this category</p>
    </div>

    <transition name="fade">
      <div
        v-if="viewDlg.open"
        class="overlay"
        @click.self="viewDlg.open = false"
      >
        <div v-if="viewDlg.p" class="modal modal-md">
          <div class="modal-head">{{ viewDlg.p.name }}</div>
          <div class="modal-body">
            <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                padding-top: 4px;
              "
            >
              <div style="display: flex; flex-direction: column; gap: 4px">
                <span class="meta-lbl">Phone</span
                ><span
                  style="font-size: 14px; font-weight: 600; color: #1a1c2e"
                  >{{ viewDlg.p.phone }}</span
                >
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px">
                <span class="meta-lbl">Signup Date</span
                ><span
                  style="font-size: 14px; font-weight: 600; color: #1a1c2e"
                  >{{ viewDlg.p.date }}</span
                >
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px">
                <span class="meta-lbl">Verification</span
                ><span
                  style="font-size: 14px; font-weight: 600; color: #1a1c2e"
                  >{{ viewDlg.p.vtype }}</span
                >
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px">
                <span class="meta-lbl">Status</span
                ><span
                  style="font-size: 14px; font-weight: 600"
                  :style="{ color: viewDlg.p.active ? '#16a34a' : '#dc2626' }"
                  >{{ viewDlg.p.active ? "Active" : "Inactive" }}</span
                >
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-primary" @click="viewDlg.open = false">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="addDlg.open" class="overlay" @click.self="addDlg.open = false">
        <div class="modal modal-lg">
          <div class="modal-head">
            <i
              class="mdi mdi-account-plus-outline"
              style="font-size: 20px; color: #1a1c2e; margin-right: 8px"
            ></i>
            Add New Participant
          </div>
          <div class="modal-body">
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px"
            >
              <div class="field" style="grid-column: 1/-1">
                <label class="field-lbl"
                  >Full Name <span style="color: #e91e63">*</span></label
                >
                <input
                  v-model="addDlg.name"
                  class="field-ctrl"
                  placeholder="e.g. Sarah Johnson"
                />
              </div>
              <div class="field">
                <label class="field-lbl"
                  >Phone Number <span style="color: #e91e63">*</span></label
                >
                <input
                  v-model="addDlg.phone"
                  class="field-ctrl"
                  placeholder="+1 555 000 0000"
                  style="font-family: monospace"
                />
              </div>
              <div class="field">
                <label class="field-lbl">Verification Type</label>
                <select v-model="addDlg.vtype" class="field-ctrl">
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>
              <div class="field">
                <label class="field-lbl">Group / Status</label>
                <select v-model="addDlg.statusGroup" class="field-ctrl">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="paused">Paused</option>
                  <option value="pending">Pending Onboarding</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <p
              v-if="addDlg.error"
              style="color: #e91e63; font-size: 13px; margin-top: 4px"
            >
              ⚠ {{ addDlg.error }}
            </p>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="addDlg.open = false">
              Cancel
            </button>
            <button class="btn-primary" @click="saveParticipant">
              Add Participant
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { uid } from "@/utils/helpers";
import { useLocalStorage } from "@/composables/useLocalStorage";

const TABS = ["Active", "Inactive", "Paused", "Pending Onboarding", "Disabled"];
const tab = useLocalStorage("onboard_pd_tab", "Active");
const phoneSearch = useLocalStorage("onboard_pd_search", "");

const DEFAULT_PARTICIPANTS = [
  {
    id: uid(),
    name: "Ramvasanth Mahendran",
    phone: "+15463846844",
    date: "October 25, 2023",
    vtype: "Automatic",
    active: true,
  },
  {
    id: uid(),
    name: "Ramvasanth Mahendran",
    phone: "+14313948434",
    date: "October 13, 2023",
    vtype: "Automatic",
    active: true,
  },
  {
    id: uid(),
    name: "Ramvasanth Mahendran",
    phone: "+11213812531",
    date: "October 9, 2023",
    vtype: "Automatic",
    active: true,
  },
  {
    id: uid(),
    name: "Ramvasanth Mahendran",
    phone: "+19652443868",
    date: "October 3, 2023",
    vtype: "Automatic",
    active: true,
  },
  {
    id: uid(),
    name: "Ramvasanth Mahendran",
    phone: "+19428435463",
    date: "September 20, 2023",
    vtype: "Automatic",
    active: true,
  },
  {
    id: uid(),
    name: "Ramvasanth Mahendran",
    phone: "+19428465814",
    date: "September 20, 2023",
    vtype: "Automatic",
    active: true,
  },
  {
    id: uid(),
    name: "Ramvasanth Mahendran",
    phone: "+19343546345",
    date: "August 18, 2023",
    vtype: "Automatic",
    active: true,
  },
  {
    id: uid(),
    name: "Sarah Johnson",
    phone: "+12025551234",
    date: "November 1, 2023",
    vtype: "Manual",
    active: false,
  },
  {
    id: uid(),
    name: "Michael Chen",
    phone: "+13105558765",
    date: "November 5, 2023",
    vtype: "Automatic",
    active: false,
  },
  {
    id: uid(),
    name: "Emily Rodriguez",
    phone: "+17025554321",
    date: "November 10, 2023",
    vtype: "Manual",
    active: false,
  },
  {
    id: uid(),
    name: "David Kim",
    phone: "+16465559876",
    date: "December 1, 2023",
    vtype: "Automatic",
    active: false,
    status: "paused",
  },
  {
    id: uid(),
    name: "Jessica Thompson",
    phone: "+14085553456",
    date: "December 8, 2023",
    vtype: "Manual",
    active: false,
    status: "paused",
  },
  {
    id: uid(),
    name: "Robert Williams",
    phone: "+18025557890",
    date: "January 5, 2024",
    vtype: "Automatic",
    active: false,
    status: "pending",
  },
  {
    id: uid(),
    name: "Amanda Foster",
    phone: "+13055552345",
    date: "January 12, 2024",
    vtype: "Manual",
    active: false,
    status: "disabled",
  },
];

const participants = useLocalStorage(
  "onboard_participants",
  DEFAULT_PARTICIPANTS
);

const filtered = computed(() => {
  let list = participants.value;
  if (tab.value === "Active") list = list.filter((p) => p.active && !p.status);
  else if (tab.value === "Inactive")
    list = list.filter((p) => !p.active && !p.status);
  else if (tab.value === "Paused")
    list = list.filter((p) => p.status === "paused");
  else if (tab.value === "Pending Onboarding")
    list = list.filter((p) => p.status === "pending");
  else if (tab.value === "Disabled")
    list = list.filter((p) => p.status === "disabled");
  if (phoneSearch.value.trim())
    list = list.filter((p) => p.phone.includes(phoneSearch.value.trim()));
  return list;
});

const viewDlg = reactive({ open: false, p: null });
const addDlg = reactive({
  open: false,
  name: "",
  phone: "",
  vtype: "Automatic",
  statusGroup: "active",
  error: "",
});

function openView(p) {
  viewDlg.p = p;
  viewDlg.open = true;
}

function openAdd() {
  Object.assign(addDlg, {
    open: true,
    name: "",
    phone: "",
    vtype: "Automatic",
    statusGroup: "active",
    error: "",
  });
}

function saveParticipant() {
  addDlg.error = "";
  if (!addDlg.name.trim()) {
    addDlg.error = "Full name is required.";
    return;
  }
  if (!addDlg.phone.trim()) {
    addDlg.error = "Phone number is required.";
    return;
  }

  const active = addDlg.statusGroup === "active";
  const status = ["paused", "pending", "disabled"].includes(addDlg.statusGroup)
    ? addDlg.statusGroup
    : undefined;

  const entry = {
    id: uid(),
    name: addDlg.name.trim(),
    phone: addDlg.phone.trim(),
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    vtype: addDlg.vtype,
    active,
    ...(status ? { status } : {}),
  };
  participants.value.unshift(entry);
  addDlg.open = false;
}
</script>
