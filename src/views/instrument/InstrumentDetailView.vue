<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInstrumentStore } from '@/stores/instrument'
import { message } from 'ant-design-vue'
import type { Instrument } from '@/types'

const route = useRoute()
const router = useRouter()
const store = useInstrumentStore()

const instrument = ref<Instrument | null>(null)
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) {
    message.error('仪器ID无效')
    router.push('/instruments')
    return
  }
  try {
    instrument.value = await store.fetchInstrumentById(id)
  } catch {
    message.error('获取仪器详情失败')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="detail-page">
    <a-button type="link" style="margin-bottom: 16px; padding-left: 0;" @click="router.push('/instruments')">
      ← 返回列表
    </a-button>

    <a-spin :spinning="loading">
      <a-card v-if="instrument" :bordered="false" class="detail-card">
        <template #title>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px; font-weight: 600;">{{ instrument.name }}</span>
            <a-tag
              :color="instrument.status === 'available' ? 'green' : instrument.status === 'in_use' ? 'red' : 'orange'"
              style="font-size: 14px; padding: 2px 12px;"
            >
              {{ instrument.status === 'available' ? '空闲' : instrument.status === 'in_use' ? '使用中' : '维修中' }}
            </a-tag>
          </div>
        </template>

        <a-descriptions :column="{ xs: 1, sm: 2, md: 2 }" bordered style="margin-top: 16px;">
          <a-descriptions-item label="型号" :span="2">{{ instrument.model || '-' }}</a-descriptions-item>
          <a-descriptions-item label="资产编号">
            <span class="mono-text">{{ instrument.asset_tag || '-' }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="分类">{{ instrument.category_id }}</a-descriptions-item>
          <a-descriptions-item label="存放地点" :span="2">
            <span role="img" aria-label="location">📍</span> {{ instrument.location || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="描述" :span="2">{{ instrument.description || '暂无描述' }}</a-descriptions-item>
        </a-descriptions>

        <div style="margin-top: 24px; text-align: center;">
          <a-button
            type="primary"
            size="large"
            :disabled="instrument.status !== 'available'"
            @click="router.push(`/instruments/${instrument.instrument_id}/reserve`)"
          >
            {{ instrument.status === 'available' ? '预约此仪器' : '当前不可预约' }}
          </a-button>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 800px;
  margin: 0 auto;
}

.detail-card {
  border-radius: 8px;
}

.mono-text {
  font-family: var(--mono, 'SFMono-Regular', Consolas, monospace);
}
</style>
