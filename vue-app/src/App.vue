<template>
  <v-app>
    <div class="app-shell">
      <AppSidebar :active="currentPage" @navigate="currentPage = $event" />

      <main class="main-area">
        <!-- Slide pages (Signup + Baseline + Surveys) -->
        <SlidePage
          v-if="isSlide"
          :key="currentPage"
          :pageKey="currentPage"
          :parentTitle="pageConfig.parentTitle"
          :crumb="pageConfig.crumb"
        />

        <!-- Participant Management pages -->
        <ParticipantDirectory v-else-if="currentPage === 'Participant Directory'" />
        <ParticipantGroups    v-else-if="currentPage === 'Participant Groups'" />
        <ProductList          v-else-if="currentPage === 'Product list'" />
        <ProductCategories    v-else-if="currentPage === 'Product Categories'" />
        <QuestionBank         v-else-if="currentPage === 'Question Bank'" />
        <NotificationsPage    v-else-if="currentPage === 'Notifications'" />
        <OrdersPage           v-else-if="currentPage === 'Orders'" />
        <EventReporting       v-else-if="currentPage === 'Event Reporting'" />
        <FAQPage              v-else-if="currentPage === 'FAQ'" />
        <ChatPage             v-else-if="currentPage === 'Chat'" />

        <!-- Dashboard / fallback -->
        <div v-else class="page">
          <div class="hdr">
            <h1 class="hdr-title">Dashboard</h1>
            <p class="hdr-crumb">Home / Dashboard</p>
          </div>
          <div class="empty-state">
            <i class="mdi mdi-view-dashboard-outline"></i>
            <p class="empty-title">Dashboard</p>
            <p class="empty-sub">Coming soon</p>
          </div>
        </div>
      </main>
    </div>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

import AppSidebar          from '@/components/AppSidebar.vue'
import SlidePage           from '@/components/SlidePage.vue'
import ParticipantDirectory from '@/components/ParticipantDirectory.vue'
import ParticipantGroups   from '@/components/ParticipantGroups.vue'
import ProductList         from '@/components/ProductList.vue'
import ProductCategories   from '@/components/ProductCategories.vue'
import QuestionBank        from '@/components/QuestionBank.vue'
import NotificationsPage   from '@/components/NotificationsPage.vue'
import OrdersPage          from '@/components/OrdersPage.vue'
import EventReporting      from '@/components/EventReporting.vue'
import FAQPage             from '@/components/FAQPage.vue'
import ChatPage            from '@/components/ChatPage.vue'

// Persist the last visited page so refresh restores the same view
const currentPage = useLocalStorage('onboard_current_page', 'Participant Directory')

// Pages that use the generic SlidePage component
const SLIDE_PAGES_MAP = {
  'About':              { parentTitle: 'Signup',    crumb: 'Signup / About'                                           },
  'Consent':            { parentTitle: 'Signup',    crumb: 'Signup / Consent'                                         },
  'Screening':          { parentTitle: 'Signup',    crumb: 'Signup / Screening'                                       },
  'Intro':              { parentTitle: 'Signup',    crumb: 'Signup / Intro'                                           },
  'Baseline Survey 1':  { parentTitle: 'Baseline',  crumb: 'Onboarding Management / Baseline / Baseline Survey 1'    },
  'Baseline Survey 2':  { parentTitle: 'Baseline',  crumb: 'Onboarding Management / Baseline / Baseline Survey 2'    },
  'Core':               { parentTitle: 'Surveys',   crumb: 'Participant Management / Surveys / Core'                  },
  'Conditional':        { parentTitle: 'Surveys',   crumb: 'Participant Management / Surveys / Conditional'           },
}

const isSlide     = computed(() => currentPage.value in SLIDE_PAGES_MAP)
const pageConfig  = computed(() => SLIDE_PAGES_MAP[currentPage.value] || {})
</script>
