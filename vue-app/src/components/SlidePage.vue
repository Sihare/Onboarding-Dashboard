<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">{{ parentTitle }}</h1>
      <p class="hdr-crumb">{{ crumb }}</p>
    </div>

    <div class="toolbar">
      <div class="search-wrap">
        <input v-model="q" class="search-input" placeholder="Search" />
        <i class="mdi mdi-magnify search-ico"></i>
      </div>
      <div class="toolbar-actions">
        <button
          class="btn-outline"
          :class="{ 'btn-active': rearrange }"
          @click="rearrange = !rearrange"
        >
          <i
            class="mdi mdi-sort-variant"
            style="margin-right: 4px; font-size: 15px"
          ></i
          >Rearrange
        </button>
        <button class="btn-solid" @click="openAdd">
          Add
          <i class="mdi mdi-plus" style="margin-left: 4px; font-size: 15px"></i>
        </button>
      </div>
    </div>

    <p class="count">
      All slides (<span>{{ filtered.length }}</span
      >)
    </p>

    <div class="grid" v-if="filtered.length">
      <article
        v-for="slide in filtered"
        :key="slide.id"
        class="card"
        :class="{ grab: rearrange }"
      >
        <div class="card-top">
          <span class="chip">{{ slide.type }}</span>
          <div class="card-actions">
            <button class="act-btn act-pink" @click="askDelete(slide.id)">
              <i class="mdi mdi-trash-can-outline"></i>
            </button>
            <button class="act-btn act-grey" @click="openEdit(slide)">
              <i class="mdi mdi-pencil-outline"></i>
            </button>
            <button class="act-btn act-grey" @click="openView(slide)">
              <i class="mdi mdi-eye-outline"></i>
            </button>
          </div>
        </div>
        <h3 class="card-title">{{ slide.title }}</h3>
        <div class="card-meta">
          <div class="meta">
            <span class="meta-lbl">{{ slide.dateLabel }}</span
            ><span class="meta-val">{{ slide.date }}</span>
          </div>
          <div class="meta">
            <span class="meta-lbl">Revisions</span
            ><span class="meta-val">{{ slide.revisions }}</span>
          </div>
        </div>
        <div class="status-row">
          <span class="status-txt"
            >Status: {{ slide.active ? "ACTIVE" : "INACTIVE" }}</span
          >
          <div
            class="toggle"
            :class="{ on: slide.active }"
            @click="slide.active = !slide.active"
          >
            <span class="knob"></span>
          </div>
        </div>
        <p class="card-id">ID: {{ slide.id }}</p>
      </article>
    </div>
    <div class="empty-state" v-else>
      <i class="mdi mdi-cards-outline"></i>
      <p class="empty-title">No slides</p>
      <p class="empty-sub">
        {{ q ? "Try a different search" : "Click Add to create slides" }}
      </p>
    </div>

    <transition name="fade">
      <div v-if="dlg.open" class="overlay" @click.self="dlg.open = false">
        <div class="modal">
          <div class="modal-head">
            {{ dlg.editId ? "Edit Slide" : "Add New Slide" }}
          </div>
          <div class="modal-body">
            <div class="field">
              <label class="field-lbl">Slide Type</label>
              <select v-model="dlg.type" class="field-ctrl">
                <option v-for="t in TYPES" :key="t">{{ t }}</option>
              </select>
            </div>
            <div class="field">
              <label class="field-lbl">Title</label>
              <input
                v-model="dlg.title"
                class="field-ctrl"
                placeholder="Enter slide title"
              />
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="dlg.open = false">Cancel</button>
            <button class="btn-primary" @click="saveSlide">
              {{ dlg.editId ? "Save Changes" : "Add Slide" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="del.open" class="overlay" @click.self="del.open = false">
        <div class="modal modal-sm">
          <div class="modal-head">Delete Slide</div>
          <div class="modal-body">
            <p style="font-size: 14px; color: #666">
              Are you sure you want to delete this slide?
            </p>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="del.open = false">Cancel</button>
            <button class="btn-danger" @click="doDelete">Delete</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="view.open" class="overlay" @click.self="view.open = false">
        <div v-if="view.slide" class="modal modal-md">
          <div class="modal-head">
            {{ view.slide.title }}
            <span
              class="chip"
              style="font-size: 11px; height: 24px; padding: 0 10px"
              >{{ view.slide.type }}</span
            >
          </div>
          <div class="modal-body">
            <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                padding-top: 4px;
              "
            >
              <div style="display: flex; flex-direction: column; gap: 2px">
                <span class="meta-lbl">{{ view.slide.dateLabel }}</span
                ><span class="meta-val">{{ view.slide.date }}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px">
                <span class="meta-lbl">Revisions</span
                ><span class="meta-val">{{ view.slide.revisions }}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px">
                <span class="meta-lbl">Status</span
                ><span
                  class="meta-val"
                  :style="{ color: view.slide.active ? '#16a34a' : '#dc2626' }"
                  >{{ view.slide.active ? "ACTIVE" : "INACTIVE" }}</span
                >
              </div>
              <div
                style="
                  grid-column: 1/-1;
                  display: flex;
                  flex-direction: column;
                  gap: 2px;
                "
              >
                <span class="meta-lbl">ID</span
                ><span
                  style="font-size: 11px; color: #bbb; word-break: break-all"
                  >{{ view.slide.id }}</span
                >
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-primary" @click="view.open = false">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { SLIDE_DATA } from "@/data/slideData";
import { uid, today } from "@/utils/helpers";
import { useLocalStorage } from "@/composables/useLocalStorage";

const props = defineProps({
  pageKey: String,
  parentTitle: String,
  crumb: String,
});

const TYPES = [
  "Static Text",
  "Radio Button",
  "Input",
  "Checkbox",
  "Dropdown",
  "Text",
  "Scale",
];

const slides = useLocalStorage(
  `onboard_slides_${props.pageKey}`,
  JSON.parse(JSON.stringify(SLIDE_DATA[props.pageKey] || []))
);
const q = useLocalStorage(`onboard_slides_q_${props.pageKey}`, "");
const rearrange = useLocalStorage(
  `onboard_slides_rearrange_${props.pageKey}`,
  false
);

const filtered = computed(() => {
  const sq = q.value.trim().toLowerCase();
  return sq
    ? slides.value.filter(
        (s) =>
          s.title.toLowerCase().includes(sq) ||
          s.type.toLowerCase().includes(sq)
      )
    : slides.value;
});

const dlg = reactive({
  open: false,
  editId: null,
  type: "Static Text",
  title: "",
});
const del = reactive({ open: false, id: null });
const view = reactive({ open: false, slide: null });

function openAdd() {
  Object.assign(dlg, {
    open: true,
    editId: null,
    type: "Static Text",
    title: "",
  });
}
function openEdit(sl) {
  Object.assign(dlg, {
    open: true,
    editId: sl.id,
    type: sl.type,
    title: sl.title,
  });
}
function openView(sl) {
  view.slide = sl;
  view.open = true;
}

function saveSlide() {
  if (!dlg.title.trim()) return;
  if (dlg.editId) {
    const s = slides.value.find((x) => x.id === dlg.editId);
    if (s) {
      s.type = dlg.type;
      s.title = dlg.title;
      s.dateLabel = "Last Edited";
      s.date = today();
      s.revisions++;
    }
  } else {
    slides.value.push({
      id: uid(),
      type: dlg.type,
      title: dlg.title,
      dateLabel: "Created at",
      date: today(),
      revisions: 0,
      active: false,
    });
  }
  dlg.open = false;
}

function askDelete(id) {
  Object.assign(del, { open: true, id });
}
function doDelete() {
  slides.value = slides.value.filter((s) => s.id !== del.id);
  del.open = false;
}
</script>
