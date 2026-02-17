# Onboarding Management — Vue 3 + Vite

A full-featured onboarding management dashboard built with **Vue 3**, **Vuetify 3**, and **Vite**.

---

## 📁 Project Structure

```
onboarding-management/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.js               # App entry point
    ├── App.vue               # Root component + page routing
    ├── assets/
    │   └── global.css        # All shared CSS styles
    ├── plugins/
    │   └── vuetify.js        # Vuetify 3 setup
    ├── utils/
    │   └── helpers.js        # uid() and today() helpers
    ├── data/
    │   └── slideData.js      # Initial slide data for all survey pages
    └── components/
        ├── AppSidebar.vue          # Collapsible dark sidebar navigation
        ├── SlidePage.vue           # Reusable slide card grid (About, Consent, etc.)
        ├── ParticipantDirectory.vue
        ├── ParticipantGroups.vue
        ├── ProductList.vue
        ├── ProductCategories.vue
        ├── QuestionBank.vue
        ├── NotificationsPage.vue
        ├── OrdersPage.vue
        ├── EventReporting.vue
        ├── FAQPage.vue
        └── ChatPage.vue
```

---

## 🚀 Quick Start

### Requirements
- **Node.js** v20.19+ or v22.12+ (required by Vite 4)
- npm v9+

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview the built output
```

---

## 📄 Pages

| Page | Path in app |
|---|---|
| Dashboard | Home |
| **Onboarding → Signup** | About, Consent, Screening, Intro |
| **Onboarding → Baseline** | Baseline Survey 1, Baseline Survey 2 |
| **Participants** | Participant Directory, Participant Groups |
| **Products** | Product list, Product Categories |
| **Surveys** | Core, Conditional |
| Question Bank | — |
| Notifications | — |
| Orders | — |
| Event Reporting | — |
| FAQ | — |
| Chat | — |

---

## 🛠 Tech Stack

| Tool | Version |
|---|---|
| Vue | 3.4 |
| Vuetify | 3.5 |
| Vite | 4.5.3 |
| @mdi/font | 7.3.67 |
