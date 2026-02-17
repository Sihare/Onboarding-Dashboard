<template>
  <aside class="sidebar">
    <div class="logo-wrap">
      <div class="logo-inner">
        <div class="logo-icon">
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 3L5 8.5V18C5 25.7 11.2 32.9 19 35C26.8 32.9 33 25.7 33 18V8.5L19 3Z"
              fill="url(#shieldGrad)"
            />
            <polyline
              points="8,19 12,19 14,13 17,25 20,15 23,22 25,19 30,19"
              fill="none"
              stroke="white"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="shieldGrad"
                x1="5"
                y1="3"
                x2="33"
                y2="35"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stop-color="#4f5db8" />
                <stop offset="100%" stop-color="#e91e63" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="logo-text">
          <span class="logo-title">OnBoard</span>
          <span class="logo-sub">Study Platform</span>
        </div>
      </div>
    </div>

    <nav class="nav">
      <div
        class="nav-flat"
        :class="{ 'nav-active': active === 'Dashboard' }"
        @click="go('Dashboard')"
      >
        Dashboard
      </div>

      <div class="nav-section">
        <div class="nav-sect-hdr" @click="tog('onb')">
          <span>Onboarding Management</span>
          <i
            class="mdi chev"
            :class="s.onb ? 'mdi-chevron-up open' : 'mdi-chevron-down'"
          ></i>
        </div>
        <transition name="slide">
          <div v-show="s.onb">
             <div class="nav-sub-hdr" @click="tog('signup')">
              <i class="mdi mdi-account-plus-outline sub-ico"></i>
              <span>Signup</span>
              <i
                class="mdi chev"
                :class="s.signup ? 'mdi-chevron-up open' : 'mdi-chevron-down'"
                style="margin-left: auto"
              ></i>
            </div>
            <transition name="slide">
              <div v-show="s.signup">
                <div
                  v-for="l in ['About', 'Consent', 'Screening', 'Intro']"
                  :key="l"
                  class="nav-leaf"
                  :class="{ 'leaf-active': active === l }"
                  @click="go(l)"
                >
                  {{ l }}
                </div>
              </div>
            </transition>
             <div class="nav-sub-hdr" @click="tog('baseline')">
              <i class="mdi mdi-file-document-outline sub-ico"></i>
              <span>Baseline</span>
              <i
                class="mdi chev"
                :class="s.baseline ? 'mdi-chevron-up open' : 'mdi-chevron-down'"
                style="margin-left: auto"
              ></i>
            </div>
            <transition name="slide">
              <div v-show="s.baseline">
                <div
                  v-for="l in ['Baseline Survey 1', 'Baseline Survey 2']"
                  :key="l"
                  class="nav-leaf"
                  :class="{ 'leaf-active': active === l }"
                  @click="go(l)"
                >
                  {{ l }}
                </div>
              </div>
            </transition>
          </div>
        </transition>
      </div>

       <div class="nav-section">
        <div class="nav-sect-hdr" @click="tog('part')">
          <span>Participant Management</span>
          <i
            class="mdi chev"
            :class="s.part ? 'mdi-chevron-up open' : 'mdi-chevron-down'"
          ></i>
        </div>
        <transition name="slide">
          <div v-show="s.part">
             <div class="nav-sub-hdr" @click="tog('participants')">
              <i class="mdi mdi-account-group-outline sub-ico"></i>
              <span>Participants</span>
              <i
                class="mdi chev"
                :class="
                  s.participants ? 'mdi-chevron-up open' : 'mdi-chevron-down'
                "
                style="margin-left: auto"
              ></i>
            </div>
            <transition name="slide">
              <div v-show="s.participants">
                <div
                  class="nav-leaf"
                  :class="{ 'leaf-active': active === 'Participant Directory' }"
                  @click="go('Participant Directory')"
                >
                  Participant Directory
                </div>
                <div
                  class="nav-leaf"
                  :class="{ 'leaf-active': active === 'Participant Groups' }"
                  @click="go('Participant Groups')"
                >
                  Participant Groups
                </div>
              </div>
            </transition>
             <div class="nav-sub-hdr" @click="tog('products')">
              <i class="mdi mdi-cube-outline sub-ico"></i>
              <span>Products</span>
              <i
                class="mdi chev"
                :class="s.products ? 'mdi-chevron-up open' : 'mdi-chevron-down'"
                style="margin-left: auto"
              ></i>
            </div>
            <transition name="slide">
              <div v-show="s.products">
                <div
                  v-for="l in ['Product list', 'Product Categories']"
                  :key="l"
                  class="nav-leaf"
                  :class="{ 'leaf-active': active === l }"
                  @click="go(l)"
                >
                  {{ l }}
                </div>
              </div>
            </transition>
             <div class="nav-sub-hdr" @click="tog('surveys')">
              <i class="mdi mdi-chart-bar sub-ico"></i>
              <span>Surveys</span>
              <i
                class="mdi chev"
                :class="s.surveys ? 'mdi-chevron-up open' : 'mdi-chevron-down'"
                style="margin-left: auto"
              ></i>
            </div>
            <transition name="slide">
              <div v-show="s.surveys">
                <div
                  v-for="l in ['Core', 'Conditional']"
                  :key="l"
                  class="nav-leaf"
                  :class="{ 'leaf-active': active === l }"
                  @click="go(l)"
                >
                  {{ l }}
                </div>
              </div>
            </transition>
             <div
              class="nav-sub-hdr"
              :class="{ 'flat-active': active === 'Question Bank' }"
              @click="go('Question Bank')"
            >
              <i class="mdi mdi-help-circle-outline sub-ico"></i
              ><span>Question Bank</span>
            </div>
            <div
              class="nav-sub-hdr"
              :class="{ 'flat-active': active === 'Notifications' }"
              @click="go('Notifications')"
            >
              <i class="mdi mdi-bell-outline sub-ico"></i
              ><span>Notifications</span>
            </div>
            <div
              class="nav-sub-hdr"
              :class="{ 'flat-active': active === 'Orders' }"
              @click="go('Orders')"
            >
              <i class="mdi mdi-clipboard-list-outline sub-ico"></i
              ><span>Orders</span>
            </div>
            <div
              class="nav-sub-hdr"
              :class="{ 'flat-active': active === 'Event Reporting' }"
              @click="go('Event Reporting')"
            >
              <i class="mdi mdi-file-chart-outline sub-ico"></i
              ><span>Event Reporting</span>
            </div>
            <div
              class="nav-sub-hdr"
              :class="{ 'flat-active': active === 'FAQ' }"
              @click="go('FAQ')"
            >
              <i class="mdi mdi-text-box-outline sub-ico"></i><span>FAQ</span>
            </div>
            <div
              class="nav-sub-hdr"
              :class="{ 'flat-active': active === 'Chat' }"
              @click="go('Chat')"
            >
              <i class="mdi mdi-chat-outline sub-ico"></i><span>Chat</span>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <div class="sidebar-logout">
      <i class="mdi mdi-power" style="margin-right: 8px; font-size: 18px"></i>
      Logout
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({ active: String });
const emit = defineEmits(["navigate"]);

const s = ref({
  onb: true,
  signup: true,
  baseline: false,
  part: false,
  participants: false,
  products: false,
  surveys: false,
});

const tog = (k) => (s.value[k] = !s.value[k]);
const go = (p) => emit("navigate", p);

watch(
  () => props.active,
  (v) => {
    if (["About", "Consent", "Screening", "Intro"].includes(v)) {
      s.value.onb = true;
      s.value.signup = true;
    }
    if (["Baseline Survey 1", "Baseline Survey 2"].includes(v)) {
      s.value.onb = true;
      s.value.baseline = true;
    }
    if (["Participant Directory", "Participant Groups"].includes(v)) {
      s.value.part = true;
      s.value.participants = true;
    }
    if (["Product list", "Product Categories"].includes(v)) {
      s.value.part = true;
      s.value.products = true;
    }
    if (["Core", "Conditional"].includes(v)) {
      s.value.part = true;
      s.value.surveys = true;
    }
    if (
      [
        "Question Bank",
        "Orders",
        "FAQ",
        "Event Reporting",
        "Chat",
        "Notifications",
      ].includes(v)
    ) {
      s.value.part = true;
    }
  },
  { immediate: true }
);
</script>
