<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'
import type { LoginRequest } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<LoginRequest>({
  username: '',
  password: '',
})

const selectedRole = ref<string>('student')
const loading = ref(false)
const passwordVisible = ref(false)

async function onSubmit() {
  if (!form.username || !form.password) {
    message.warning('请填写用户名和密码')
    return
  }
  loading.value = true
  try {
    await authStore.login(form)
    message.success('登录成功')
    router.push('/instruments')
  } catch (err: any) {
    const msg = err?.response?.data?.detail || '登录失败，请重试'
    message.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-banner">
      <div class="banner-overlay">
        <div class="banner-content">
          <h1>实验室仪器共享管理系统</h1>
          <p>桂林电子科技大学</p>
        </div>
      </div>
    </div>
    <div class="login-panel">
      <div class="login-form-container">
        <h2 class="login-title">欢迎登录</h2>
        <a-segmented
          v-model:value="selectedRole"
          :options="[
            { value: 'student', label: '学生' },
            { value: 'teacher', label: '教师' },
          ]"
          disabled
          style="margin-bottom: 24px; width: 100%;"
          block
        />
        <a-form :model="form" layout="vertical" @submit.prevent="onSubmit">
          <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
            <a-input
              v-model:value="form.username"
              placeholder="请输入用户名"
              size="large"
              autocomplete="username"
            />
          </a-form-item>
          <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password
              v-model:value="form.password"
              placeholder="请输入密码"
              size="large"
              :visible="passwordVisible"
              @update:visible="passwordVisible = $event"
              autocomplete="current-password"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading" block size="large">
              登录
            </a-button>
          </a-form-item>
        </a-form>
        <div class="login-footer">
          还没有账号？
          <router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 520px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.login-banner {
  flex: 1;
  background: url('@/assets/hero.png') center/cover no-repeat;
  position: relative;
  min-height: 520px;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 75, 135, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  color: #fff;
  text-align: center;
  padding: 24px;
}

.banner-content h1 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
}

.banner-content p {
  font-size: 16px;
  opacity: 0.9;
}

.login-panel {
  width: 420px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-form-container {
  width: 100%;
  max-width: 320px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
  color: var(--text-primary, #1f2937);
}

.login-footer {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
}

.login-footer a {
  color: var(--primary-color, #1890ff);
}

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
    max-width: 100%;
  }
  .login-banner {
    display: none;
  }
  .login-panel {
    width: 100%;
    padding: 32px 24px;
  }
}
</style>
