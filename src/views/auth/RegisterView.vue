<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { message } from 'ant-design-vue'
import type { RegisterRequest } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<RegisterRequest & { confirm_password?: string }>({
  username: '',
  password: '',
  confirm_password: '',
  role: 'student',
  real_name: '',
  student_id: '',
  department: '',
  phone: '',
  email: '',
})

const loading = ref(false)

async function onSubmit() {
  if (!form.username || !form.password || !form.real_name) {
    message.warning('请填写必填项')
    return
  }
  if (form.password.length < 6) {
    message.warning('密码长度至少6位')
    return
  }
  if (form.password !== form.confirm_password) {
    message.warning('两次密码输入不一致')
    return
  }

  loading.value = true
  try {
    await authStore.register({
      username: form.username,
      password: form.password,
      role: form.role,
      real_name: form.real_name,
      student_id: form.student_id || undefined,
      department: form.department || undefined,
      phone: form.phone || undefined,
      email: form.email || undefined,
    })
    message.success('注册成功，请登录')
    router.push('/login')
  } catch (err: any) {
    const msg = err?.response?.data?.detail || '注册失败，请重试'
    message.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-wrapper">
    <div class="register-banner">
      <div class="banner-overlay">
        <div class="banner-content">
          <h1>实验室仪器共享管理系统</h1>
          <p>桂林电子科技大学</p>
        </div>
      </div>
    </div>
    <div class="register-panel">
      <div class="register-form-container">
        <h2 class="register-title">创建账号</h2>
        <a-segmented
          v-model:value="form.role"
          :options="[
            { value: 'student', label: '学生' },
            { value: 'teacher', label: '教师' },
          ]"
          style="margin-bottom: 24px; width: 100%;"
          block
        />
        <a-form layout="vertical" @submit.prevent="onSubmit">
          <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
            <a-input v-model:value="form.username" placeholder="请输入用户名" size="large" />
          </a-form-item>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="form.password" placeholder="请输入密码" size="large" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="确认密码" name="confirm_password" :rules="[{ required: true, message: '请确认密码' }]">
                <a-input-password v-model:value="form.confirm_password" placeholder="确认密码" size="large" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="真实姓名" name="real_name" :rules="[{ required: true, message: '请输入真实姓名' }]">
            <a-input v-model:value="form.real_name" placeholder="请输入真实姓名" size="large" />
          </a-form-item>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="学号/工号" name="student_id">
                <a-input v-model:value="form.student_id" placeholder="选填" size="large" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="院系" name="department">
                <a-input v-model:value="form.department" placeholder="选填" size="large" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="电话" name="phone">
                <a-input v-model:value="form.phone" placeholder="选填" size="large" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="邮箱" name="email">
                <a-input v-model:value="form.email" placeholder="选填" size="large" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading" block size="large">
              注册
            </a-button>
          </a-form-item>
        </a-form>
        <div class="register-footer">
          已有账号？
          <router-link to="/login">返回登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-wrapper {
  display: flex;
  width: 100%;
  max-width: 900px;
  min-height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.register-banner {
  flex: 1;
  background: url('@/assets/hero.png') center/cover no-repeat;
  position: relative;
  min-height: 600px;
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

.register-panel {
  width: 520px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 40px;
}

.register-form-container {
  width: 100%;
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  color: var(--text-primary, #1f2937);
}

.register-footer {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
}

.register-footer a {
  color: var(--primary-color, #1890ff);
}

@media (max-width: 768px) {
  .register-wrapper {
    flex-direction: column;
    max-width: 100%;
  }
  .register-banner {
    display: none;
  }
  .register-panel {
    width: 100%;
    padding: 24px 16px;
  }
}
</style>
