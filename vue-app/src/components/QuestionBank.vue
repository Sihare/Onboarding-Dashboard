<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Question Bank</h1>
      <p class="hdr-crumb">Participant Management / Question Bank</p>
    </div>

    <div class="toolbar">
      <div class="search-wrap">
        <input
          v-model="search"
          class="search-input"
          placeholder="Search questions…"
        />
        <i class="mdi mdi-magnify search-ico"></i>
      </div>
      <button class="btn-solid" @click="openAdd">
        Add Question
        <i class="mdi mdi-plus" style="margin-left: 4px; font-size: 15px"></i>
      </button>
    </div>

    <p class="count">
      All questions (<span>{{ filtered.length }}</span
      >)
    </p>

    <table class="data-table" v-if="filtered.length">
      <thead>
        <tr>
          <th style="width: 38%">Question</th>
          <th>Type</th>
          <th>Category</th>
          <th>Used in</th>
          <th>Created</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="q in filtered" :key="q.id">
          <td style="font-weight: 500; color: #1a1c2e">{{ q.text }}</td>
          <td>
            <span class="chip" style="font-size: 11.5px; height: 26px">{{
              q.type
            }}</span>
          </td>
          <td>
            <span class="status-pill pill-blue">{{ q.category }}</span>
          </td>
          <td style="color: #666">{{ q.used }} surveys</td>
          <td class="td-date">{{ q.created }}</td>
          <td>
            <div style="display: flex; gap: 6px">
              <button
                class="eye-btn"
                style="border-color: #ddd"
                title="Edit"
                @click="openEdit(q)"
              >
                <i
                  class="mdi mdi-pencil-outline"
                  style="font-size: 15px; color: #666"
                ></i>
              </button>
              <button
                class="eye-btn"
                style="border-color: #fcc"
                title="Delete"
                @click="askDelete(q)"
              >
                <i
                  class="mdi mdi-trash-can-outline"
                  style="font-size: 15px; color: #e91e63"
                ></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="empty-state" v-else>
      <i class="mdi mdi-help-circle-outline"></i>
      <p class="empty-title">No questions found</p>
      <p class="empty-sub">
        {{
          search
            ? "Try a different search"
            : "Click Add Question to get started"
        }}
      </p>
    </div>

    <transition name="fade">
      <div v-if="dlg.open" class="overlay" @click.self="closeDlg">
        <div class="modal modal-lg">
          <div class="modal-head">
            <i
              class="mdi mdi-help-circle-outline"
              style="font-size: 20px; color: #1a1c2e; margin-right: 8px"
            ></i>
            {{ dlg.editId ? "Edit Question" : "Add New Question" }}
          </div>
          <div class="modal-body">
            <div class="field">
              <label class="field-lbl"
                >Question Text <span style="color: #e91e63">*</span></label
              >
              <textarea
                v-model="dlg.text"
                class="field-ctrl tall"
                placeholder="Enter the full question text…"
                style="height: 80px; resize: vertical"
              ></textarea>
            </div>
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px"
            >
              <div class="field">
                <label class="field-lbl"
                  >Question Type <span style="color: #e91e63">*</span></label
                >
                <select v-model="dlg.type" class="field-ctrl">
                  <option v-for="t in TYPES" :key="t">{{ t }}</option>
                </select>
              </div>
              <div class="field">
                <label class="field-lbl"
                  >Category <span style="color: #e91e63">*</span></label
                >
                <input
                  v-model="dlg.category"
                  class="field-ctrl"
                  placeholder="e.g. Pain, Wellness…"
                  list="cat-suggestions"
                />
                <datalist id="cat-suggestions">
                  <option v-for="c in CATEGORIES" :key="c" :value="c" />
                </datalist>
              </div>
            </div>
            <p
              v-if="dlg.error"
              style="color: #e91e63; font-size: 13px; margin-top: 4px"
            >
              ⚠ {{ dlg.error }}
            </p>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="closeDlg">Cancel</button>
            <button class="btn-primary" @click="saveQuestion">
              {{ dlg.editId ? "Save Changes" : "Add Question" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="del.open" class="overlay" @click.self="del.open = false">
        <div class="modal modal-sm">
          <div class="modal-head">Delete Question</div>
          <div class="modal-body">
            <p style="font-size: 14px; color: #666; line-height: 1.6">
              Delete this question?<br />
              <em style="color: #1a1c2e">"{{ del.text }}"</em>
            </p>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="del.open = false">Cancel</button>
            <button class="btn-danger" @click="doDelete">Delete</button>
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

const TYPES = [
  "Scale",
  "Radio Button",
  "Checkbox",
  "Input",
  "Dropdown",
  "Text",
];
const CATEGORIES = [
  "Pain",
  "Medical",
  "Wellness",
  "Symptoms",
  "Mental Health",
  "Side Effects",
  "Compliance",
  "General",
];

const search = useLocalStorage("onboard_qb_search", "");

const DEFAULT_QUESTIONS = [
  {
    id: uid(),
    text: "How would you rate your overall pain level today?",
    type: "Scale",
    category: "Pain",
    used: 12,
    created: "Oct 5, 2023",
  },
  {
    id: uid(),
    text: "Are you currently taking any prescription medications?",
    type: "Radio Button",
    category: "Medical",
    used: 8,
    created: "Oct 5, 2023",
  },
  {
    id: uid(),
    text: "How many hours of sleep did you get last night?",
    type: "Input",
    category: "Wellness",
    used: 15,
    created: "Oct 12, 2023",
  },
  {
    id: uid(),
    text: "Which of the following symptoms are you experiencing?",
    type: "Checkbox",
    category: "Symptoms",
    used: 10,
    created: "Nov 1, 2023",
  },
  {
    id: uid(),
    text: "On a scale of 1–10, how would you rate your anxiety?",
    type: "Scale",
    category: "Mental Health",
    used: 9,
    created: "Nov 8, 2023",
  },
  {
    id: uid(),
    text: "Have you experienced any side effects?",
    type: "Radio Button",
    category: "Side Effects",
    used: 7,
    created: "Dec 1, 2023",
  },
  {
    id: uid(),
    text: "How often do you use the study product?",
    type: "Dropdown",
    category: "Compliance",
    used: 14,
    created: "Jan 3, 2024",
  },
  {
    id: uid(),
    text: "Please describe any changes you noticed this week.",
    type: "Text",
    category: "General",
    used: 6,
    created: "Jan 10, 2024",
  },
];

const questions = useLocalStorage("onboard_questions", DEFAULT_QUESTIONS);

const filtered = computed(() => {
  const sq = search.value.trim().toLowerCase();
  return sq
    ? questions.value.filter(
        (q) =>
          q.text.toLowerCase().includes(sq) ||
          q.category.toLowerCase().includes(sq) ||
          q.type.toLowerCase().includes(sq)
      )
    : questions.value;
});

const dlg = reactive({
  open: false,
  editId: null,
  text: "",
  type: "Scale",
  category: "",
  error: "",
});
const del = reactive({ open: false, id: null, text: "" });

function openAdd() {
  Object.assign(dlg, {
    open: true,
    editId: null,
    text: "",
    type: "Scale",
    category: "",
    error: "",
  });
}
function openEdit(q) {
  Object.assign(dlg, {
    open: true,
    editId: q.id,
    text: q.text,
    type: q.type,
    category: q.category,
    error: "",
  });
}
function closeDlg() {
  dlg.open = false;
}

function saveQuestion() {
  dlg.error = "";
  if (!dlg.text.trim()) {
    dlg.error = "Question text is required.";
    return;
  }
  if (!dlg.category.trim()) {
    dlg.error = "Category is required.";
    return;
  }

  if (dlg.editId) {
    const q = questions.value.find((x) => x.id === dlg.editId);
    if (q)
      Object.assign(q, {
        text: dlg.text.trim(),
        type: dlg.type,
        category: dlg.category.trim(),
      });
  } else {
    questions.value.unshift({
      id: uid(),
      text: dlg.text.trim(),
      type: dlg.type,
      category: dlg.category.trim(),
      used: 0,
      created: today(),
    });
  }
  closeDlg();
}

function askDelete(q) {
  Object.assign(del, {
    open: true,
    id: q.id,
    text: q.text.length > 60 ? q.text.slice(0, 60) + "…" : q.text,
  });
}
function doDelete() {
  questions.value = questions.value.filter((q) => q.id !== del.id);
  del.open = false;
}
</script>
