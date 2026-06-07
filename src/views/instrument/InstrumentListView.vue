<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInstrumentStore } from '@/stores/instrument'
import type { Category } from '@/types'

const router = useRouter()
const store = useInstrumentStore()

const keyword = ref('')
const selectedCategory = ref<number | undefined>(undefined)
const selectedStatus = ref<string | undefined>(undefined)

const statusOptions = [
  { label: '全部', value: '' },
  { label: '🟢 空闲', value: 'available' },
  { label: '🔴 使用中', value: 'in_use' },
  { label: '🟠 维修中', value: 'maintenance' },
]

let categories: Category[] = []

onMounted(async () => {
  try {
    categories = (await store.fetchCategories()) ?? []
  } catch { /* ignore */ }
  await loadInstruments()
})

watch([selectedCategory, selectedStatus], () => {
  loadInstruments()
})

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(keyword, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadInstruments(), 300)
})

async function loadInstruments() {
  await store.fetchInstruments({
    category_id: selectedCategory.value,
    status: selectedStatus.value || undefined,
    keyword: keyword.value || undefined,
  })
}
</script>

<template>
  <div class="instrument-list-page">
    <!-- Search & Filter -->
    <a-card class="filter-card" :bordered="false">
      <a-row :gutter="16" align="middle">
        <a-col :xs="24" :sm="8" :md="6">
          <a-select
            v-model:value="selectedCategory"
            :options="categories.map(c => ({ value: c.category_id, label: c.name }))"
            placeholder="选择分类"
            allow-clear
            style="width: 100%"
          />
        </a-col>
        <a-col :xs="24" :sm="16" :md="12">
          <a-radio-group
            v-model:value="selectedStatus"
            :options="statusOptions"
            option-type="button"
            button-style="solid"
          />
        </a-col>
        <a-col :xs="24" :md="6">
          <a-input-search
            v-model:value="keyword"
            placeholder="搜索仪器名称"
            allow-clear
            @search="loadInstruments"
          />
        </a-col>
      </a-row>
    </a-card>

    <!-- Loading Skeleton -->
    <a-row v-if="store.loading" :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col v-for="i in 6" :key="i" :xs="24" :sm="12" :md="8" :lg="6">
        <a-card :bordered="false">
          <a-skeleton active :paragraph="{ rows: 3 }" />
        </a-card>
      </a-col>
    </a-row>

    <!-- Empty State -->
    <a-empty v-else-if="store.instruments.length === 0" description="暂无仪器数据" style="margin-top: 64px;" />

    <!-- Instrument Card Grid -->
    <a-row v-else :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col
        v-for="item in store.instruments"
        :key="item.instrument_id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <a-card :bordered="false" :hoverable="true" class="instrument-card">
          <template #extra>
            <a-tag
              :color="item.status === 'available' ? 'green' : item.status === 'in_use' ? 'red' : 'orange'"
            >
              {{ item.status === 'available' ? '空闲' : item.status === 'in_use' ? '使用中' : '维修中' }}
            </a-tag>
          </template>
          <a-card-meta>
            <template #title>
              <span style="font-size: 16px; font-weight: 600;">{{ item.name }}</span>
            </template>
            <template #description>
              <div class="card-desc">
                <div v-if="item.model">型号：{{ item.model }}</div>
                <div v-if="item.asset_tag" class="mono-text">资产编号：{{ item.asset_tag }}</div>
                <div v-if="item.location">
                  <span role="img" aria-label="location">📍</span> {{ item.location }}
                </div>
              </div>
            </template>
          </a-card-meta>
          <template #actions>
            <a-button type="link" @click="router.push(`/instruments/${item.instrument_id}`)">
              查看详情
            </a-button>
            <a-button
              type="primary"
              :disabled="item.status !== 'available'"
              @click="router.push(`/instruments/${item.instrument_id}/reserve`)"
            >
              立即预约
            </a-button>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.instrument-list-page {
  max-width: 1400px;
}

.filter-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.instrument-card {
  border-radius: 8px;
  transition: box-shadow 0.3s;
}

.instrument-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-desc {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary, #6b7280);
}

.mono-text {
  font-family: var(--mono, 'SFMono-Regular', Consolas, monospace);
  color: #9ca3af;
}
</style>
