<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Product Categories</h1>
      <p class="hdr-crumb">
        Participant Management / Products / Product Categories
      </p>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px">
      <button class="btn-solid" @click="openAdd">
        Add Category
        <i class="mdi mdi-plus" style="margin-left: 4px; font-size: 15px"></i>
      </button>
    </div>

    <div class="card-2col" v-if="cats.length">
      <div v-for="c in cats" :key="c.id" class="info-card">
        <div class="info-card-head">
          <div style="display: flex; align-items: center; gap: 12px">
            <div
              style="
                width: 42px;
                height: 42px;
                border-radius: 10px;
                background: #f0f0f8;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <i
                class="mdi"
                :class="c.icon"
                style="font-size: 22px; color: #1a1c2e"
              ></i>
            </div>
            <span class="info-card-title">{{ c.name }}</span>
          </div>
          <span class="info-card-badge badge-blue">{{ c.count }} products</span>
        </div>
        <p class="info-card-sub">{{ c.desc }}</p>
        <div class="info-card-actions">
          <button class="btn-xs-outline" @click="openEdit(c)">Edit</button>
          <button
            class="btn-xs-outline"
            style="color: #e91e63; border-color: #e91e63"
            @click="askDelete(c)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else>
      <i class="mdi mdi-shape-outline"></i>
      <p class="empty-title">No categories yet</p>
      <p class="empty-sub">Click Add Category to create one</p>
    </div>

    <!-- Add / Edit Modal -->
    <transition name="fade">
      <div v-if="dlg.open" class="overlay" @click.self="closeDlg">
        <div class="modal">
          <div class="modal-head">
            <i
              class="mdi mdi-shape-outline"
              style="font-size: 20px; color: #1a1c2e; margin-right: 8px"
            ></i>
            {{ dlg.editId ? "Edit Category" : "Add New Category" }}
          </div>
          <div class="modal-body">
            <div class="field">
              <label class="field-lbl"
                >Category Name <span style="color: #e91e63">*</span></label
              >
              <input
                v-model="dlg.name"
                class="field-ctrl"
                placeholder="e.g. Tincture"
              />
            </div>
            <div class="field">
              <label class="field-lbl">Description</label>
              <input
                v-model="dlg.desc"
                class="field-ctrl"
                placeholder="Short description of this category"
              />
            </div>
            <div class="field">
              <label class="field-lbl">Icon</label>
              <select v-model="dlg.icon" class="field-ctrl">
                <option
                  v-for="ico in ICONS"
                  :key="ico.value"
                  :value="ico.value"
                >
                  {{ ico.label }}
                </option>
              </select>
              <div
                style="
                  margin-top: 8px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                "
              >
                <div
                  style="
                    width: 36px;
                    height: 36px;
                    background: #f0f0f8;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <i
                    class="mdi"
                    :class="dlg.icon"
                    style="font-size: 20px; color: #1a1c2e"
                  ></i>
                </div>
                <span style="font-size: 13px; color: #999">Preview</span>
              </div>
            </div>
            <div class="field">
              <label class="field-lbl">Product Count</label>
              <input
                v-model.number="dlg.count"
                type="number"
                min="0"
                class="field-ctrl"
                placeholder="0"
              />
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
            <button class="btn-primary" @click="saveCat">
              {{ dlg.editId ? "Save Changes" : "Add Category" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="del.open" class="overlay" @click.self="del.open = false">
        <div class="modal modal-sm">
          <div class="modal-head">Delete Category</div>
          <div class="modal-body">
            <p style="font-size: 14px; color: #666; line-height: 1.6">
              Delete <strong style="color: #1a1c2e">{{ del.name }}</strong
              >?<br />This cannot be undone.
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
import { reactive } from "vue";
import { uid } from "@/utils/helpers";
import { useLocalStorage } from "@/composables/useLocalStorage";

const ICONS = [
  { value: "mdi-bottle-tonic-outline", label: "🧴 Bottle / Tincture" },
  { value: "mdi-food-apple-outline", label: "🍎 Food / Edible" },
  { value: "mdi-pill-outline", label: "💊 Pill / Capsule" },
  { value: "mdi-lotion-outline", label: "🧴 Lotion / Topical" },
  { value: "mdi-leaf", label: "🌿 Leaf / Hemp" },
  { value: "mdi-flask-outline", label: "🧪 Flask / Placebo" },
  { value: "mdi-package-variant", label: "📦 Package" },
  { value: "mdi-star-outline", label: "⭐ Star" },
];

const DEFAULT_CATS = [
  {
    id: uid(),
    name: "Tincture",
    desc: "Liquid CBD oil drops",
    count: 3,
    icon: "mdi-bottle-tonic-outline",
  },
  {
    id: uid(),
    name: "Edible",
    desc: "CBD-infused food products",
    count: 1,
    icon: "mdi-food-apple-outline",
  },
  {
    id: uid(),
    name: "Capsule",
    desc: "Measured CBD capsules",
    count: 1,
    icon: "mdi-pill-outline",
  },
  {
    id: uid(),
    name: "Topical",
    desc: "Skin-applied CBD products",
    count: 1,
    icon: "mdi-lotion-outline",
  },
  {
    id: uid(),
    name: "Supplement",
    desc: "Hemp nutritional supplements",
    count: 1,
    icon: "mdi-leaf",
  },
  {
    id: uid(),
    name: "Placebo",
    desc: "Control group products",
    count: 1,
    icon: "mdi-flask-outline",
  },
];

const cats = useLocalStorage("onboard_categories", DEFAULT_CATS);

const dlg = reactive({
  open: false,
  editId: null,
  name: "",
  desc: "",
  icon: "mdi-package-variant",
  count: 0,
  error: "",
});
const del = reactive({ open: false, id: null, name: "" });

function openAdd() {
  Object.assign(dlg, {
    open: true,
    editId: null,
    name: "",
    desc: "",
    icon: "mdi-package-variant",
    count: 0,
    error: "",
  });
}
function openEdit(c) {
  Object.assign(dlg, {
    open: true,
    editId: c.id,
    name: c.name,
    desc: c.desc,
    icon: c.icon,
    count: c.count,
    error: "",
  });
}
function closeDlg() {
  dlg.open = false;
}

function saveCat() {
  dlg.error = "";
  if (!dlg.name.trim()) {
    dlg.error = "Category name is required.";
    return;
  }
  if (dlg.editId) {
    const c = cats.value.find((x) => x.id === dlg.editId);
    if (c)
      Object.assign(c, {
        name: dlg.name.trim(),
        desc: dlg.desc.trim(),
        icon: dlg.icon,
        count: dlg.count,
      });
  } else {
    cats.value.unshift({
      id: uid(),
      name: dlg.name.trim(),
      desc: dlg.desc.trim(),
      icon: dlg.icon,
      count: dlg.count,
    });
  }
  closeDlg();
}

function askDelete(c) {
  Object.assign(del, { open: true, id: c.id, name: c.name });
}
function doDelete() {
  cats.value = cats.value.filter((c) => c.id !== del.id);
  del.open = false;
}
</script>
