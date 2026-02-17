<div align="center">

<br/>

<img src="https://img.shields.io/badge/Vue-3.4-42b883?style=for-the-badge&logo=vuedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Vuetify-3.5-1867C0?style=for-the-badge&logo=vuetify&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" />

<br/><br/>

# 🛡️ OnBoard — Study Management Dashboard

**A full-featured clinical study onboarding & participant management platform**  
built with Vue 3, Vuetify 3, and Vite — with full localStorage persistence.

<br/>

[✨ Features](#-features) · [🚀 Quick Start](#-quick-start) · [📁 Project Structure](#-project-structure) · [📄 Pages](#-pages) · [🛠 Tech Stack](#-tech-stack)

<br/>

---

</div>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🗂 Onboarding Management
- Multi-step **Signup flows** — About, Consent, Screening, Intro
- **Baseline Surveys** (Survey 1 & 2) with slide management
- Add, Edit, Delete & Rearrange slides per section
- Toggle Active / Inactive per slide with status tracking
- Full revision history per slide card

</td>
<td width="50%">

### 👥 Participant Management
- **Participant Directory** with 5 status tabs (Active, Inactive, Paused, Pending, Disabled)
- **Participant Groups** with TRAILCODE support & toggle switches
- Add new participants with verification type & group assignment
- Phone number search with live filtering

</td>
</tr>
<tr>
<td width="50%">

### 📦 Product & Order Tracking
- Full **Product List** with SKU, stock, price, and status management
- **Product Categories** with icon picker and product counts
- **Orders** with auto-generated IDs, participant lookup & date picker
- Status pipeline: Pending → Processing → Shipped → Delivered

</td>
<td width="50%">

### 📊 Surveys & Question Bank
- **Core** and **Conditional** survey slide management
- Reusable **Question Bank** with type & category tagging
- 6 question types: Scale, Radio Button, Checkbox, Input, Dropdown, Text
- Track how many surveys each question is used in

</td>
</tr>
<tr>
<td width="50%">

### 🔔 Notifications & Events
- Per-notification toggles for **Email / SMS / Push**
- **Event Reporting** dashboard with severity stats (High / Medium / Low / Info)
- Summary stat cards: total events, high severity, monthly count, resolved
- Recent notification feed

</td>
<td width="50%">

### 💬 FAQ & Chat
- Accordion-style **FAQ** with Published / Draft status and categories
- Real-time **Chat** interface with conversation history per contact
- Unread badge indicators and contact search
- All chat messages persisted across sessions

</td>
</tr>
</table>

### 🔒 localStorage Persistence
> Every change you make — toggle states, new entries, edits, deleted rows, active tabs, even the last page visited — **survives a browser refresh** automatically. No backend required.

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v20.19+ or v22.12+ |
| npm | v9+ |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/onboard-dashboard.git
cd onboard-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser. 🎉

### Build for Production

```bash
# Build optimised bundle
npm run build

# Preview the production build locally
npm run preview
```

### Reset All Data

To wipe localStorage and restore default seed data, run in the browser console:

```js
Object.keys(localStorage)
  .filter(k => k.startsWith('onboard_'))
  .forEach(k => localStorage.removeItem(k))
location.reload()
```

---

## 📁 Project Structure

```
vue-app/
│
├── index.html                      # App shell
├── vite.config.js                  # Vite configuration
├── package.json
│
└── src/
    ├── main.js                     # App entry point
    ├── App.vue                     # Root layout + client-side routing
    │
    ├── assets/
    │   └── global.css              # All shared styles (sidebar, tables, cards, chat…)
    │
    ├── plugins/
    │   └── vuetify.js              # Vuetify 3 + MDI icon setup
    │
    ├── composables/
    │   └── useLocalStorage.js      # 🔑 Reactive ref auto-synced to localStorage
    │
    ├── utils/
    │   └── helpers.js              # uid() · today() helpers
    │
    ├── data/
    │   └── slideData.js            # Seed data for all 8 slide pages
    │
    └── components/
        ├── AppSidebar.vue          # Dark collapsible navigation sidebar
        ├── SlidePage.vue           # Reusable slide card grid component
        │
        ├── ParticipantDirectory.vue  # Tabbed participant list + Add modal
        ├── ParticipantGroups.vue     # TRAILCODE groups table + Create modal
        │
        ├── ProductList.vue           # Product table + Add/Edit/Delete
        ├── ProductCategories.vue     # Category cards + Add/Edit/Delete
        │
        ├── QuestionBank.vue          # Question table + Add/Edit/Delete
        ├── NotificationsPage.vue     # Email/SMS/Push toggles
        ├── OrdersPage.vue            # Orders table + New Order modal
        ├── EventReporting.vue        # Stats cards + events table
        ├── FAQPage.vue               # Accordion FAQ + Add/Edit/Delete
        └── ChatPage.vue              # Chat UI with persistent history
```

---

## 📄 Pages

### 🔷 Onboarding Management

| Page | Description |
|------|-------------|
| **About** | Signup slide cards — What are Cannabinoids, Welcome Message, etc. |
| **Consent** | Consent form slides — Introduction, Privacy Policy, Agreement |
| **Screening** | Eligibility slides — Age Verification, Medical History, Pain Scale |
| **Intro** | Study introduction — Welcome, Timeline, Coordinator, Requirements |
| **Baseline Survey 1** | Initial health metrics — Overall Health, Sleep, Pain, Anxiety |
| **Baseline Survey 2** | Quality of life metrics — Fatigue, Appetite, Depression Screening |

### 🔷 Participant Management

| Page | Description |
|------|-------------|
| **Participant Directory** | All participants with status tabs, toggle switches and phone search |
| **Participant Groups** | Group segmentation with TRAILCODE identifiers |
| **Product List** | Study products with stock, price and status management |
| **Product Categories** | Category management with custom icons |
| **Core Surveys** | Weekly recurring survey slides |
| **Conditional Surveys** | Logic-driven conditional slides |
| **Question Bank** | Reusable question library |
| **Notifications** | Communication channel toggles per notification type |
| **Orders** | Product dispatch tracking per participant |
| **Event Reporting** | Adverse events, protocol deviations and study milestones |
| **FAQ** | Participant-facing FAQ with publish/draft workflow |
| **Chat** | Direct messaging with participants |

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Vue 3](https://vuejs.org/) | `^3.4.0` | Reactive UI framework with Composition API |
| [Vuetify 3](https://vuetifyjs.com/) | `^3.5.0` | Material Design component library |
| [Vite](https://vitejs.dev/) | `^5.0.0` | Lightning-fast dev server & bundler |
| [@mdi/font](https://materialdesignicons.com/) | `^7.3.67` | Material Design icon set |
| [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue) | `^5.0.0` | Vue SFC support for Vite |

### Patterns Used

- ⚡ **Composition API** (`<script setup>`) throughout
- 🔁 **`useLocalStorage` composable** — single source of truth for all persistence
- 🧩 **Reusable `SlidePage` component** — drives 8 different slide management pages from one component
- 🎨 **Custom CSS design system** — no utility framework; clean handcrafted styles
- 🔀 **Template-based routing** — lightweight `v-else-if` routing without Vue Router overhead

---

## 🗃 localStorage Keys

All data is namespaced under `onboard_*` to avoid collisions:

| Key | Stores |
|-----|--------|
| `onboard_current_page` | Last visited page |
| `onboard_slides_<pageKey>` | Slides per section (About, Consent, etc.) |
| `onboard_participants` | Participant list + toggle states |
| `onboard_pd_tab` | Active status tab |
| `onboard_groups` | Participant groups |
| `onboard_products` | Product catalog |
| `onboard_categories` | Product categories |
| `onboard_questions` | Question bank |
| `onboard_notifications` | Email / SMS / Push settings |
| `onboard_orders` | Order history |
| `onboard_events` | Event reporting log |
| `onboard_faqs` | FAQ entries + publish state |
| `onboard_chat_messages` | Full message history per contact |
| `onboard_chat_active` | Last selected chat contact |

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m 'Add amazing feature'`
4. Push to the branch — `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ using Vue 3 + Vuetify 3

</div>
