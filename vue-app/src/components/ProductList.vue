<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Products</h1>
      <p class="hdr-crumb">Participant Management / Products / Product list</p>
    </div>

    <div class="toolbar">
      <div class="search-wrap">
        <input
          v-model="search"
          class="search-input"
          placeholder="Search products…"
        />
        <i class="mdi mdi-magnify search-ico"></i>
      </div>
      <button class="btn-solid" @click="openAdd">
        Add Product
        <i class="mdi mdi-plus" style="margin-left: 4px; font-size: 15px"></i>
      </button>
    </div>

    <p class="count">
      All products (<span>{{ filtered.length }}</span
      >)
    </p>

    <table class="data-table" v-if="filtered.length">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Price</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td class="td-name">{{ p.name }}</td>
          <td style="font-family: monospace; font-size: 12.5px; color: #555">
            {{ p.sku }}
          </td>
          <td>{{ p.category }}</td>
          <td>{{ p.stock }}</td>
          <td style="font-weight: 600">{{ p.price }}</td>
          <td>
            <span class="status-pill" :class="statusClass(p.status)">{{
              p.status
            }}</span>
          </td>
          <td>
            <div style="display: flex; gap: 6px">
              <button
                class="eye-btn"
                style="border-color: #ddd"
                title="Edit"
                @click="openEdit(p)"
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
                @click="askDelete(p)"
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
      <i class="mdi mdi-package-variant-closed"></i>
      <p class="empty-title">No products found</p>
      <p class="empty-sub">
        {{
          search ? "Try a different search" : "Click Add Product to get started"
        }}
      </p>
    </div>

    <transition name="fade">
      <div v-if="dlg.open" class="overlay" @click.self="closeDlg">
        <div class="modal modal-lg">
          <div class="modal-head">
            <i
              class="mdi mdi-package-variant"
              style="font-size: 20px; color: #1a1c2e; margin-right: 8px"
            ></i>
            {{ dlg.editId ? "Edit Product" : "Add New Product" }}
          </div>
          <div class="modal-body">
            <div
              style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px"
            >
              <div class="field">
                <label class="field-lbl"
                  >Product Name <span style="color: #e91e63">*</span></label
                >
                <input
                  v-model="dlg.name"
                  class="field-ctrl"
                  placeholder="e.g. CBD Oil 10mg"
                />
              </div>
              <div class="field">
                <label class="field-lbl"
                  >SKU <span style="color: #e91e63">*</span></label
                >
                <input
                  v-model="dlg.sku"
                  class="field-ctrl"
                  placeholder="e.g. CBD-010"
                  style="font-family: monospace"
                />
              </div>
              <div class="field">
                <label class="field-lbl">Category</label>
                <select v-model="dlg.category" class="field-ctrl">
                  <option v-for="c in CATEGORIES" :key="c">{{ c }}</option>
                </select>
              </div>
              <div class="field">
                <label class="field-lbl">Status</label>
                <select v-model="dlg.status" class="field-ctrl">
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div class="field">
                <label class="field-lbl">Stock Quantity</label>
                <input
                  v-model.number="dlg.stock"
                  type="number"
                  min="0"
                  class="field-ctrl"
                  placeholder="0"
                />
              </div>
              <div class="field">
                <label class="field-lbl">Price</label>
                <input
                  v-model="dlg.price"
                  class="field-ctrl"
                  placeholder="e.g. $24.99"
                />
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
            <button class="btn-primary" @click="saveProduct">
              {{ dlg.editId ? "Save Changes" : "Add Product" }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="del.open" class="overlay" @click.self="del.open = false">
        <div class="modal modal-sm">
          <div class="modal-head">Delete Product</div>
          <div class="modal-body">
            <p style="font-size: 14px; color: #666; line-height: 1.6">
              Are you sure you want to delete
              <strong style="color: #1a1c2e">{{ del.name }}</strong
              >?<br />This action cannot be undone.
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
import { uid } from "@/utils/helpers";
import { useLocalStorage } from "@/composables/useLocalStorage";

const CATEGORIES = [
  "Tincture",
  "Edible",
  "Capsule",
  "Topical",
  "Supplement",
  "Placebo",
  "Other",
];

const search = useLocalStorage("onboard_products_search", "");

const DEFAULT_PRODUCTS = [
  {
    id: uid(),
    name: "CBD Oil 10mg",
    sku: "CBD-010",
    category: "Tincture",
    stock: 245,
    price: "$24.99",
    status: "Active",
  },
  {
    id: uid(),
    name: "CBD Oil 25mg",
    sku: "CBD-025",
    category: "Tincture",
    stock: 180,
    price: "$39.99",
    status: "Active",
  },
  {
    id: uid(),
    name: "CBD Oil 50mg",
    sku: "CBD-050",
    category: "Tincture",
    stock: 120,
    price: "$59.99",
    status: "Active",
  },
  {
    id: uid(),
    name: "CBD Gummies 15mg",
    sku: "GUM-015",
    category: "Edible",
    stock: 500,
    price: "$34.99",
    status: "Active",
  },
  {
    id: uid(),
    name: "CBD Capsules 20mg",
    sku: "CAP-020",
    category: "Capsule",
    stock: 300,
    price: "$44.99",
    status: "Active",
  },
  {
    id: uid(),
    name: "Placebo Oil",
    sku: "PLB-001",
    category: "Tincture",
    stock: 200,
    price: "$0.00",
    status: "Active",
  },
  {
    id: uid(),
    name: "CBD Cream 500mg",
    sku: "CRM-500",
    category: "Topical",
    stock: 80,
    price: "$49.99",
    status: "Inactive",
  },
  {
    id: uid(),
    name: "Hemp Protein",
    sku: "PRT-001",
    category: "Supplement",
    stock: 0,
    price: "$29.99",
    status: "Out of Stock",
  },
];

const products = useLocalStorage("onboard_products", DEFAULT_PRODUCTS);

const filtered = computed(() => {
  const sq = search.value.trim().toLowerCase();
  return sq
    ? products.value.filter(
        (p) =>
          p.name.toLowerCase().includes(sq) || p.sku.toLowerCase().includes(sq)
      )
    : products.value;
});

function statusClass(s) {
  return s === "Active"
    ? "pill-green"
    : s === "Inactive"
    ? "pill-grey"
    : "pill-amber";
}

const dlg = reactive({
  open: false,
  editId: null,
  name: "",
  sku: "",
  category: "Tincture",
  price: "",
  stock: 0,
  status: "Active",
  error: "",
});
const del = reactive({ open: false, id: null, name: "" });

function openAdd() {
  Object.assign(dlg, {
    open: true,
    editId: null,
    name: "",
    sku: "",
    category: "Tincture",
    price: "",
    stock: 0,
    status: "Active",
    error: "",
  });
}
function openEdit(p) {
  Object.assign(dlg, {
    open: true,
    editId: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: p.price,
    stock: p.stock,
    status: p.status,
    error: "",
  });
}
function closeDlg() {
  dlg.open = false;
}

function saveProduct() {
  dlg.error = "";
  if (!dlg.name.trim()) {
    dlg.error = "Product name is required.";
    return;
  }
  if (!dlg.sku.trim()) {
    dlg.error = "SKU is required.";
    return;
  }
  const price = dlg.price.trim()
    ? dlg.price.trim().startsWith("$")
      ? dlg.price.trim()
      : `$${dlg.price.trim()}`
    : "$0.00";
  if (dlg.editId) {
    const p = products.value.find((x) => x.id === dlg.editId);
    if (p)
      Object.assign(p, {
        name: dlg.name.trim(),
        sku: dlg.sku.trim(),
        category: dlg.category,
        price,
        stock: dlg.stock,
        status: dlg.status,
      });
  } else {
    products.value.unshift({
      id: uid(),
      name: dlg.name.trim(),
      sku: dlg.sku.trim(),
      category: dlg.category,
      price,
      stock: dlg.stock,
      status: dlg.status,
    });
  }
  closeDlg();
}

function askDelete(p) {
  Object.assign(del, { open: true, id: p.id, name: p.name });
}
function doDelete() {
  products.value = products.value.filter((p) => p.id !== del.id);
  del.open = false;
}
</script>
