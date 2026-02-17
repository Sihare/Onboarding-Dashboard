<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Participants</h1>
      <p class="hdr-crumb">Participants / Participant Group</p>
    </div>

    <div class="toolbar">
      <div class="search-wrap" style="width: 460px">
        <input v-model="search" class="search-input" placeholder="Search" />
        <i class="mdi mdi-magnify search-ico"></i>
      </div>
      <button
        class="btn-solid"
        style="border-radius: 24px; height: 44px; padding: 0 22px; gap: 6px"
        @click="dlg.open = true"
      >
        <i class="mdi mdi-plus" style="font-size: 17px"></i> Create Group
      </button>
    </div>

    <p class="count">
      All segments <span>({{ filtered.length }})</span>
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 38%">Group Code</th>
          <th>Group Name</th>
          <th>Users Mapped</th>
          <th>Created Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="g in filtered" :key="g.id">
          <td
            style="
              font-family: monospace;
              font-size: 12.5px;
              color: #1a1c2e;
              font-weight: 500;
              word-break: break-all;
              line-height: 1.4;
            "
          >
            {{ g.code }}
          </td>
          <td style="color: #333; font-weight: 500">{{ g.name }}</td>
          <td style="color: #555; text-align: center">{{ g.users || "" }}</td>
          <td class="td-date">{{ g.created }}</td>
          <td>
            <div
              class="toggle"
              :class="{ on: g.active }"
              @click="g.active = !g.active"
            >
              <span class="knob"></span>
            </div>
          </td>
          <td>
            <div style="display: flex; gap: 8px; align-items: center">
              <button class="eye-btn" @click="openView(g)">
                <i
                  class="mdi mdi-pencil-outline"
                  style="font-size: 15px; color: #666"
                ></i>
              </button>
              <button class="eye-btn" @click="openView(g)">
                <i
                  class="mdi mdi-eye-outline"
                  style="font-size: 15px; color: #666"
                ></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <transition name="fade">
      <div v-if="dlg.open" class="overlay" @click.self="dlg.open = false">
        <div class="modal">
          <div class="modal-head">Create Group</div>
          <div class="modal-body">
            <div class="field">
              <label class="field-lbl">Group Code</label
              ><input
                v-model="dlg.code"
                class="field-ctrl"
                placeholder="e.g. ABCFGH or TRAILCODE…"
              />
            </div>
            <div class="field">
              <label class="field-lbl">Group Name</label
              ><input
                v-model="dlg.name"
                class="field-ctrl"
                placeholder="e.g. Military"
              />
            </div>
            <div class="field">
              <label class="field-lbl">Users Mapped</label
              ><input
                v-model="dlg.users"
                type="number"
                class="field-ctrl"
                placeholder="0"
              />
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="dlg.open = false">Cancel</button>
            <button class="btn-primary" @click="createGroup">
              Create Group
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="viewDlg.open"
        class="overlay"
        @click.self="viewDlg.open = false"
      >
        <div v-if="viewDlg.g" class="modal modal-md">
          <div class="modal-head">{{ viewDlg.g.name }}</div>
          <div class="modal-body">
            <div
              style="
                display: flex;
                flex-direction: column;
                gap: 14px;
                padding-top: 4px;
              "
            >
              <div>
                <span class="meta-lbl">Group Code</span>
                <p
                  style="
                    font-size: 12.5px;
                    font-family: monospace;
                    color: #1a1c2e;
                    margin-top: 4px;
                    word-break: break-all;
                  "
                >
                  {{ viewDlg.g.code }}
                </p>
              </div>
              <div
                style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px"
              >
                <div>
                  <span class="meta-lbl">Users Mapped</span>
                  <p
                    style="
                      font-size: 15px;
                      font-weight: 700;
                      color: #1a1c2e;
                      margin-top: 4px;
                    "
                  >
                    {{ viewDlg.g.users }}
                  </p>
                </div>
                <div>
                  <span class="meta-lbl">Created Date</span>
                  <p
                    style="
                      font-size: 14px;
                      font-weight: 600;
                      color: #1a1c2e;
                      margin-top: 4px;
                    "
                  >
                    {{ viewDlg.g.created }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="viewDlg.open = false">
              Close
            </button>
            <button class="btn-primary">Edit Group</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { uid, today } from "@/utils/helpers";
import { useLocalStorage } from "@/composables/useLocalStorage";

const search = useLocalStorage("onboard_pg_search", "");

const DEFAULT_GROUPS = [
  {
    id: uid(),
    code: "ABCFGH",
    name: "Military",
    users: 0,
    created: "June 22, 2023",
    active: false,
  },
  {
    id: uid(),
    code: "TRAILCODE17f69123-60e6-4e12-a50f-89a71e3e5fa4",
    name: "Temp TrailCode Description",
    users: 0,
    created: "September 01, 2023",
    active: true,
  },
  {
    id: uid(),
    code: "TRAILCODE35851dbb-af4c-4925-93f3-c3ec426db686",
    name: "Temp TrailCode Description",
    users: 0,
    created: "September 01, 2023",
    active: true,
  },
  {
    id: uid(),
    code: "TRAILCODE3e27694c-a671-4a40-9301-12acce192ccb",
    name: "Temp TrailCode Description",
    users: 0,
    created: "September 01, 2023",
    active: true,
  },
  {
    id: uid(),
    code: "TRAILCODE524058c5-5b9f-4742-bd85-51e391bc7c63",
    name: "Temp TrailCode Description",
    users: 0,
    created: "September 01, 2023",
    active: true,
  },
  {
    id: uid(),
    code: "TRAILCODE5be33ecd-50e6-4903-9152-76044749fbe7",
    name: "Temp TrailCode Description",
    users: 0,
    created: "September 01, 2023",
    active: true,
  },
  {
    id: uid(),
    code: "TRAILCODE8f70d518-c46b-4bd8-9ef6-ccd17b3f6532",
    name: "Temp TrailCode Description",
    users: 0,
    created: "September 01, 2023",
    active: true,
  },
  {
    id: uid(),
    code: "TRAILCODEa2c9e841-d3f5-4b67-8120-9e3ab7c54d21",
    name: "Alpha Group",
    users: 18,
    created: "October 15, 2023",
    active: true,
  },
  {
    id: uid(),
    code: "TRAILCODEb1d8f392-e4a6-4c78-9231-af4bc8d65e32",
    name: "Beta Group",
    users: 22,
    created: "October 15, 2023",
    active: true,
  },
  {
    id: uid(),
    code: "TRAILCODEc3e9a043-f5b7-4d89-a342-bg5cd9e76f43",
    name: "Control Group",
    users: 20,
    created: "November 15, 2023",
    active: true,
  },
];

const groups = useLocalStorage("onboard_groups", DEFAULT_GROUPS);

const filtered = computed(() => {
  const sq = search.value.trim().toLowerCase();
  return sq
    ? groups.value.filter(
        (g) =>
          g.code.toLowerCase().includes(sq) || g.name.toLowerCase().includes(sq)
      )
    : groups.value;
});

const dlg = reactive({ open: false, code: "", name: "", users: "" });
const viewDlg = reactive({ open: false, g: null });

function createGroup() {
  if (!dlg.code.trim() || !dlg.name.trim()) return;
  groups.value.unshift({
    id: uid(),
    code: dlg.code,
    name: dlg.name,
    users: Number(dlg.users) || 0,
    created: today(),
    active: false,
  });
  Object.assign(dlg, { open: false, code: "", name: "", users: "" });
}
function openView(g) {
  viewDlg.g = g;
  viewDlg.open = true;
}
</script>
