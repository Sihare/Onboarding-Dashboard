<template>
  <div class="page">
    <div class="hdr">
      <h1 class="hdr-title">Orders</h1>
      <p class="hdr-crumb">Participant Management / Orders</p>
    </div>

    <div class="toolbar">
      <div class="search-wrap">
        <input v-model="search" class="search-input" placeholder="Search by order ID, participant or product…" />
        <i class="mdi mdi-magnify search-ico"></i>
      </div>
      <button class="btn-solid" @click="openAdd">
        New Order <i class="mdi mdi-plus" style="margin-left:4px;font-size:15px"></i>
      </button>
    </div>

    <p class="count">All orders (<span>{{ filtered.length }}</span>)</p>

    <table class="data-table" v-if="filtered.length">
      <thead>
        <tr>
          <th>Order ID</th><th>Participant</th><th>Product</th>
          <th>Qty</th><th>Date</th><th>Status</th><th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in filtered" :key="o.id">
          <td style="font-family:monospace;font-weight:600;color:#1a1c2e">{{ o.id }}</td>
          <td class="td-name">{{ o.participant }}</td>
          <td>{{ o.product }}</td>
          <td>{{ o.qty }}</td>
          <td class="td-date">{{ o.date }}</td>
          <td><span class="status-pill" :class="statusClass[o.status]">{{ o.status }}</span></td>
          <td>
            <div style="display:flex;gap:6px">
              <button class="eye-btn" title="Edit" @click="openEdit(o)">
                <i class="mdi mdi-pencil-outline" style="font-size:15px;color:#666"></i>
              </button>
              <button class="eye-btn" style="border-color:#fcc" title="Delete" @click="askDelete(o)">
                <i class="mdi mdi-trash-can-outline" style="font-size:15px;color:#e91e63"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="empty-state" v-else>
      <i class="mdi mdi-clipboard-list-outline"></i>
      <p class="empty-title">No orders found</p>
      <p class="empty-sub">{{ search ? 'Try a different search' : 'Click New Order to create one' }}</p>
    </div>

     <transition name="fade">
      <div v-if="dlg.open" class="overlay" @click.self="closeDlg">
        <div class="modal modal-lg">
          <div class="modal-head">
            <i class="mdi mdi-clipboard-plus-outline" style="font-size:20px;color:#1a1c2e;margin-right:8px"></i>
            {{ dlg.editId ? 'Edit Order' : 'New Order' }}
          </div>
          <div class="modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">
              <div class="field" style="grid-column:1/-1">
                <label class="field-lbl">Participant Name <span style="color:#e91e63">*</span></label>
                <input v-model="dlg.participant" class="field-ctrl" placeholder="e.g. Sarah Johnson" list="participant-list" />
                <datalist id="participant-list">
                  <option v-for="n in PARTICIPANTS" :key="n" :value="n" />
                </datalist>
              </div>
              <div class="field">
                <label class="field-lbl">Product <span style="color:#e91e63">*</span></label>
                <select v-model="dlg.product" class="field-ctrl">
                  <option v-for="p in PRODUCTS" :key="p">{{ p }}</option>
                </select>
              </div>
              <div class="field">
                <label class="field-lbl">Quantity</label>
                <input v-model.number="dlg.qty" type="number" min="1" class="field-ctrl" />
              </div>
              <div class="field">
                <label class="field-lbl">Status</label>
                <select v-model="dlg.status" class="field-ctrl">
                  <option v-for="s in STATUSES" :key="s">{{ s }}</option>
                </select>
              </div>
              <div class="field">
                <label class="field-lbl">Order Date</label>
                <input v-model="dlg.date" type="date" class="field-ctrl" />
              </div>
            </div>
            <p v-if="dlg.error" style="color:#e91e63;font-size:13px;margin-top:4px">⚠ {{ dlg.error }}</p>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="closeDlg">Cancel</button>
            <button class="btn-primary" @click="saveOrder">{{ dlg.editId ? 'Save Changes' : 'Create Order' }}</button>
          </div>
        </div>
      </div>
    </transition>

     <transition name="fade">
      <div v-if="del.open" class="overlay" @click.self="del.open = false">
        <div class="modal modal-sm">
          <div class="modal-head">Delete Order</div>
          <div class="modal-body">
            <p style="font-size:14px;color:#666;line-height:1.6">
              Delete order <strong style="color:#1a1c2e">{{ del.id }}</strong> for <strong style="color:#1a1c2e">{{ del.participant }}</strong>?<br/>This cannot be undone.
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
import { reactive, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const PARTICIPANTS = [
  'Ramvasanth Mahendran','Sarah Johnson','Michael Chen',
  'Emily Rodriguez','David Kim','Jessica Thompson','Robert Williams','Amanda Foster',
]
const PRODUCTS = ['CBD Oil 10mg','CBD Oil 25mg','CBD Oil 50mg','CBD Gummies 15mg','CBD Capsules 20mg','Placebo Oil','CBD Cream 500mg','Hemp Protein']
const STATUSES = ['Pending','Processing','Shipped','Delivered','Cancelled']

const statusClass = {
  Delivered: 'pill-green', Shipped: 'pill-blue',
  Processing: 'pill-amber', Pending: 'pill-grey', Cancelled: 'pill-red',
}

const search = useLocalStorage('onboard_orders_search', '')

const DEFAULT_ORDERS = [
  { id: 'ORD-001', participant: 'Ramvasanth Mahendran', product: 'CBD Oil 10mg',      qty: 1, date: 'October 25, 2023',  status: 'Delivered'  },
  { id: 'ORD-002', participant: 'Ramvasanth Mahendran', product: 'CBD Oil 10mg',      qty: 1, date: 'October 13, 2023',  status: 'Delivered'  },
  { id: 'ORD-003', participant: 'Ramvasanth Mahendran', product: 'Placebo Oil',       qty: 1, date: 'October 9, 2023',   status: 'Delivered'  },
  { id: 'ORD-004', participant: 'Sarah Johnson',        product: 'CBD Oil 25mg',      qty: 2, date: 'November 1, 2023',  status: 'Shipped'    },
  { id: 'ORD-005', participant: 'Michael Chen',         product: 'CBD Gummies 15mg',  qty: 1, date: 'November 5, 2023',  status: 'Processing' },
  { id: 'ORD-006', participant: 'Emily Rodriguez',      product: 'CBD Oil 50mg',      qty: 1, date: 'November 10, 2023', status: 'Pending'    },
  { id: 'ORD-007', participant: 'David Kim',            product: 'Placebo Oil',       qty: 1, date: 'December 1, 2023',  status: 'Delivered'  },
  { id: 'ORD-008', participant: 'Jessica Thompson',     product: 'CBD Oil 10mg',      qty: 2, date: 'December 8, 2023',  status: 'Shipped'    },
  { id: 'ORD-009', participant: 'Robert Williams',      product: 'CBD Capsules 20mg', qty: 1, date: 'January 5, 2024',   status: 'Processing' },
  { id: 'ORD-010', participant: 'Amanda Foster',        product: 'CBD Oil 25mg',      qty: 1, date: 'January 12, 2024',  status: 'Cancelled'  },
]

const orders = useLocalStorage('onboard_orders', DEFAULT_ORDERS)

const filtered = computed(() => {
  const sq = search.value.trim().toLowerCase()
  return sq ? orders.value.filter(o =>
    o.participant.toLowerCase().includes(sq) ||
    o.id.toLowerCase().includes(sq) ||
    o.product.toLowerCase().includes(sq)
  ) : orders.value
})

 function nextOrderId() {
  const nums = orders.value
    .map(o => parseInt(o.id.replace('ORD-', '')))
    .filter(n => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return `ORD-${String(max + 1).padStart(3, '0')}`
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const dlg = reactive({ open: false, editId: null, participant: '', product: 'CBD Oil 10mg', qty: 1, status: 'Pending', date: todayISO(), error: '' })
const del = reactive({ open: false, id: '', participant: '' })

function openAdd() {
  Object.assign(dlg, { open: true, editId: null, participant: '', product: 'CBD Oil 10mg', qty: 1, status: 'Pending', date: todayISO(), error: '' })
}
function openEdit(o) {
  Object.assign(dlg, { open: true, editId: o.id, participant: o.participant, product: o.product, qty: o.qty, status: o.status, date: todayISO(), error: '' })
}
function closeDlg() { dlg.open = false }

function saveOrder() {
  dlg.error = ''
  if (!dlg.participant.trim()) { dlg.error = 'Participant name is required.'; return }
  if (dlg.qty < 1)             { dlg.error = 'Quantity must be at least 1.'; return }

  const dateStr = formatDate(dlg.date)

  if (dlg.editId) {
    const o = orders.value.find(x => x.id === dlg.editId)
    if (o) Object.assign(o, { participant: dlg.participant.trim(), product: dlg.product, qty: dlg.qty, status: dlg.status, date: dateStr })
  } else {
    orders.value.unshift({ id: nextOrderId(), participant: dlg.participant.trim(), product: dlg.product, qty: dlg.qty, status: dlg.status, date: dateStr })
  }
  closeDlg()
}

function askDelete(o) { Object.assign(del, { open: true, id: o.id, participant: o.participant }) }
function doDelete()   { orders.value = orders.value.filter(o => o.id !== del.id); del.open = false }
</script>
