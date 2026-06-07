<script setup lang="ts">
import { computed, h, ref, watch, type VNode } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterView, useRouter } from 'vue-router'
import { AppstoreOutlined, CalendarOutlined, CheckCircleOutlined, ToolOutlined } from '@ant-design/icons-vue'

const authStore = useAuthStore()
const router = useRouter()
const collapsed = ref(false)

const menuItems = computed(() => {
  const items: { key: string; label: string; icon: () => VNode }[] = [
    { key: '/instruments', label: '仪器大厅', icon: () => h(AppstoreOutlined) },
    { key: '/reservations', label: '我的预约', icon: () => h(CalendarOutlined) },
  ]
  if (authStore.isAdmin) {
    items.push(
      { key: '/admin/instruments', label: '仪器管理', icon: () => h(ToolOutlined) },
      { key: '/admin/reservations', label: '预约审批', icon: () => h(CheckCircleOutlined) },
    )
  }
  return items
})

function handleMenuClick(menuInfo: { key: string }) {
  router.push(menuInfo.key)
}

async function handleLogout() {
  await authStore.logout()
  // 导航由 watch 在检测到 isLoggedIn 变化后统一执行，避免双重导航竞态
}

// 监听登录状态，未登录时自动跳转
watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (!isLoggedIn && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
})
</script>

<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        {{ collapsed ? '仪' : '仪器共享管理系统' }}
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :inline-collapsed="collapsed"
        :selectedKeys="[router.currentRoute.value.path]"
        @click="handleMenuClick"
        :items="menuItems"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px; display: flex; align-items: center; justify-content: flex-end; gap: 16px;">
        <span v-if="authStore.user">
          {{ authStore.user.real_name }}
          <a-tag :color="authStore.role === 'admin' ? 'blue' : authStore.role === 'teacher' ? 'green' : 'default'" style="margin-left: 4px;">
            {{ authStore.role === 'admin' ? '管理员' : authStore.role === 'teacher' ? '教师' : '学生' }}
          </a-tag>
        </span>
        <a-button type="link" @click="handleLogout">退出登录</a-button>
      </a-layout-header>
      <a-layout-content style="margin: 24px; min-height: 280px;">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
