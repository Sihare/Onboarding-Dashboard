<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">FAQ</h1>
      <p class="hdr-crumb">Participant Management / FAQ</p>
    </div>

    <div
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      "
    >
      <p class="count" style="margin: 0">
        All FAQs (<span>{{ faqs.length }}</span
        >)
      </p>
      <button class="btn-solid" @click="openAdd">
        Add FAQ
        <i class="mdi mdi-plus" style="margin-left: 4px; font-size: 15px"></i>
      </button>
    </div>

    <div
      style="display: flex; flex-direction: column; gap: 10px; max-width: 900px"
      v-if="faqs.length"
    >
      <div
        v-for="f in faqs"
        :key="f.id"
        style="
          background: #fff;
          border-radius: 12px;
          border: 1.5px solid #ebebeb;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        "
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            cursor: pointer;
          "
          @click="toggleOpen(f.id)"
        >
          <div
            style="
              display: flex;
              align-items: center;
              gap: 14px;
              flex: 1;
              min-width: 0;
            "
          >
            <span class="status-pill pill-blue" style="flex-shrink: 0">{{
              f.category
            }}</span>
            <span
              style="
                font-size: 14.5px;
                font-weight: 500;
                color: #1a1c2e;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
              >{{ f.q }}</span
            >
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              gap: 10px;
              margin-left: 14px;
              flex-shrink: 0;
            "
          >
            <span
              class="status-pill"
              :class="f.published ? 'pill-green' : 'pill-grey'"
            >
              {{ f.published ? "Published" : "Draft" }}
            </span>
            <i
              class="mdi"
              :class="openId === f.id ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              style="color: #aaa; font-size: 20px"
            ></i>
          </div>
        </div>

        <div
          v-show="openId === f.id"
          style="padding: 0 20px 18px; border-top: 1px solid #f5f5f5"
        >
          <p
            style="
              font-size: 13.5px;
              color: #555;
              line-height: 1.7;
              padding-top: 14px;
            "
          >
            {{ f.a }}
          </p>
          <div style="display: flex; gap: 8px; margin-top: 14px">
            <button class="btn-xs-outline" @click.stop="openEdit(f)">
              <i class="mdi mdi-pencil-outline" style="margin-right: 4px"></i
              >Edit
            </button>
            <button
              class="btn-xs-outline"
              style="color: #e91e63; border-color: #e91e63"
              @click.stop="askDelete(f)"
            >
              <i class="mdi mdi-trash-can-outline" style="margin-right: 4px"></i
              >Delete
            </button>
            <button
              class="btn-xs-outline"
              style="margin-left: auto"
              @click.stop="f.published = !f.published"
            >
              {{ f.published ? "Unpublish" : "Publish" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <i class="mdi mdi-text-box-outline"></i>
      <p class="empty-title">No FAQs yet</p>
      <p class="empty-sub">Click Add FAQ to create your first entry</p>
    </div>

    <transition name="fade">
      <div v-if="dlg.open" class="overlay" @click.self="closeDlg">
        <div class="modal modal-lg">
          <div class="modal-head">
            <i
              class="mdi mdi-frequently-asked-questions"
              style="font-size: 20px; color: #1a1c2e; margin-right: 8px"
            ></i>
            {{ dlg.editId ? "Edit FAQ" : "Add New FAQ" }}
          </div>
          <div class="modal-body">
            <div class="field">
              <label class="field-lbl"
                >Question <span style="color: #e91e63">*</span></label
              >
              <input
                v-model="dlg.q"
                class="field-ctrl"
                placeholder="Enter the question participants might ask…"
              />
            </div>
            <div class="field">
              <label class="field-lbl"
                >Answer <span style="color: #e91e63">*</span></label
              >
              <textarea
                v-model="dlg.a"
                class="field-ctrl"
                style="height: 100px; resize: vertical; padding: 10px 12px"
                placeholder="Provide a clear, helpful answer…"
              ></textarea>
            </div>
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px"
            >
              <div class="field">
                <label class="field-lbl"
                  >Category <span style="color: #e91e63">*</span></label
                >
                <input
                  v-model="dlg.category"
                  class="field-ctrl"
                  placeholder="e.g. Product, Safety…"
                  list="faq-cats"
                />
                <datalist id="faq-cats">
                  <option v-for="c in CATEGORIES" :key="c" :value="c" />
                </datalist>
              </div>
              <div class="field">
                <label class="field-lbl">Status</label>
                <select v-model="dlg.published" class="field-ctrl">
                  <option :value="true">Published</option>
                  <option :value="false">Draft</option>
                </select>
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
            <button class="btn-primary" @click="saveFaq">
              {{ dlg.editId ? "Save Changes" : "Add FAQ" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="del.open" class="overlay" @click.self="del.open = false">
        <div class="modal modal-sm">
          <div class="modal-head">Delete FAQ</div>
          <div class="modal-body">
            <p style="font-size: 14px; color: #666; line-height: 1.6">
              Delete this FAQ entry?<br />
              <em style="color: #1a1c2e">"{{ del.q }}"</em>
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
import { ref, reactive } from "vue";
import { uid } from "@/utils/helpers";
import { useLocalStorage } from "@/composables/useLocalStorage";

const CATEGORIES = [
  "Product",
  "Surveys",
  "General",
  "Safety",
  "Eligibility",
  "Privacy",
  "Technical",
  "Study Protocol",
];

const openId = ref(null);

const DEFAULT_FAQS = [
  {
    id: uid(),
    category: "Product",
    published: true,
    q: "How do I take my assigned study product?",
    a: "Follow the instructions provided in your study kit. Take the product as directed at the same time each day.",
  },
  {
    id: uid(),
    category: "Surveys",
    published: true,
    q: "What happens if I miss a survey?",
    a: "Complete it as soon as possible. Contact your coordinator if you miss more than 2 consecutive surveys.",
  },
  {
    id: uid(),
    category: "General",
    published: true,
    q: "How long does the study last?",
    a: "The study runs for 12 weeks. You will receive weekly surveys and monthly check-ins.",
  },
  {
    id: uid(),
    category: "Safety",
    published: true,
    q: "Are there any side effects I should report?",
    a: "Yes — report any unusual symptoms immediately using the in-app reporting tool or by calling your coordinator.",
  },
  {
    id: uid(),
    category: "Eligibility",
    published: false,
    q: "Can I participate if I am on other medications?",
    a: "This depends on your screening results. Your eligibility is determined during the screening phase.",
  },
  {
    id: uid(),
    category: "Privacy",
    published: true,
    q: "How is my data kept private?",
    a: "All data is anonymized and stored securely. Only authorized study staff can access identifiable information.",
  },
];

const faqs = useLocalStorage("onboard_faqs", DEFAULT_FAQS);

function toggleOpen(id) {
  openId.value = openId.value === id ? null : id;
}

const dlg = reactive({
  open: false,
  editId: null,
  q: "",
  a: "",
  category: "",
  published: true,
  error: "",
});
const del = reactive({ open: false, id: null, q: "" });

function openAdd() {
  Object.assign(dlg, {
    open: true,
    editId: null,
    q: "",
    a: "",
    category: "",
    published: true,
    error: "",
  });
}
function openEdit(f) {
  Object.assign(dlg, {
    open: true,
    editId: f.id,
    q: f.q,
    a: f.a,
    category: f.category,
    published: f.published,
    error: "",
  });
}
function closeDlg() {
  dlg.open = false;
}

function saveFaq() {
  dlg.error = "";
  if (!dlg.q.trim()) {
    dlg.error = "Question is required.";
    return;
  }
  if (!dlg.a.trim()) {
    dlg.error = "Answer is required.";
    return;
  }
  if (!dlg.category.trim()) {
    dlg.error = "Category is required.";
    return;
  }

  if (dlg.editId) {
    const f = faqs.value.find((x) => x.id === dlg.editId);
    if (f)
      Object.assign(f, {
        q: dlg.q.trim(),
        a: dlg.a.trim(),
        category: dlg.category.trim(),
        published: dlg.published,
      });
  } else {
    faqs.value.unshift({
      id: uid(),
      q: dlg.q.trim(),
      a: dlg.a.trim(),
      category: dlg.category.trim(),
      published: dlg.published,
    });
  }
  closeDlg();
}

function askDelete(f) {
  Object.assign(del, {
    open: true,
    id: f.id,
    q: f.q.length > 60 ? f.q.slice(0, 60) + "…" : f.q,
  });
}
function doDelete() {
  faqs.value = faqs.value.filter((f) => f.id !== del.id);
  del.open = false;
}
</script>
