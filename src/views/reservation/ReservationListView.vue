<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservation'
import { useInstrumentStore } from '@/stores/instrument'
import { message, Modal } from 'ant-design-vue'
import { TIME_SLOTS } from '@/types'
import type { ReservationStatus } from '@/types'

const reservationStore = useReservationStore()
const instrumentStore = useInstrumentStore()

const activeTab = ref<string>('all')
const nameMap = ref<Record<number, string>>({})

const statusFilterMap: Record<string, ReservationStatus | undefined> = {
  all: undefined,
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  cancelled: 'cancelled',
}

const tabOptions = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审批' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已拒绝' },
  { key: 'cancelled', label: '已取消' },
]

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: '待审批' },
  approved: { color: 'green', label: '已通过' },
  rejected: { color: 'red', label: '已拒绝' },
  cancelled: { color: 'default', label: '已取消' },
  completed: { color: 'blue', label: '已完成' },
}

onMounted(async () => {
  try {
    await instrumentStore.fetchCategories()
  } catch { /* ignore */ }
  await loadReservations()
})

async function loadReservations() {
  const status = statusFilterMap[activeTab.value]
  const data = await reservationStore.fetchReservations(
    status ? { status } : undefined,
  )
  // Build name map
  for (const r of data) {
    if (!nameMap.value[r.instrument_id]) {
      try {
        const inst = await instrumentStore.fetchInstrumentById(r.instrument_id)
        nameMap.value[r.instrument_id] = inst.name
      } catch {
        nameMap.value[r.instrument_id] = `仪器#${r.instrument_id}`
      }
    }
  }
}

async function onTabChange(key: string) {
  activeTab.value = key
  await loadReservations()
}

function getSlotLabel(slotId: number): string {
  const slot = TIME_SLOTS.find(s => s.slot_id === slotId)
  return slot ? `${slot.label} ${slot.time_range}` : `时段#${slotId}`
}

async function handleCancel(reservationId: number) {
  Modal.confirm({
    title: '确认取消',
    content: '确定要取消此预约吗？',
    okText: '确认取消',
    cancelText: '返回',
    okType: 'danger',
    onOk: async () => {
      try {
        await reservationStore.cancelReservation(reservationId)
        message.success('预约已取消')
        await loadReservations()
      } catch (err: any) {
        message.error(err?.response?.data?.detail || '取消失败')
      }
    },
  })
}
</script>

<template>
  <div class="reservation-list-page">
    <a-card :bordered="false">
      <template #title>
        <span style="font-size: 18px; font-weight: 600;">我的预约</span>
      </template>

      <a-tabs :activeKey="activeTab" @change="onTabChange">
        <a-tab-pane v-for="tab in tabOptions" :key="tab.key" :tab="tab.label">
          <a-spin :spinning="reservationStore.loading">
            <a-empty v-if="reservationStore.reservations.length === 0" description="暂无预约记录" />

            <a-list v-else :dataSource="reservationStore.reservations" :pagination="{ pageSize: 10 }">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #title>
                      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-weight: 600;">{{ nameMap[item.instrument_id] || `仪器#${item.instrument_id}` }}</span>
                        <a-tag :color="statusConfig[item.status]?.color || 'default'">
                          {{ statusConfig[item.status]?.label || item.status }}
                        </a-tag>
                      </div>
                    </template>
                    <template #description>
                      <div>
                        <strong>{{ item.date }}</strong> · {{ getSlotLabel(item.slot_id) }}
                      </div>
                      <div style="font-size: 12px; color: #999; margin-top: 4px;">
                        申请时间：{{ item.apply_time }}
                      </div>
                      <div v-if="item.remark" style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">
                        备注：{{ item.remark }}
                      </div>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-button
                      v-if="item.status === 'pending'"
                      type="link"
                      danger
                      @click="handleCancel(item.reservation_id)"
                    >
                      取消预约
                    </a-button>
                  </template>
                </a-list-item>
              </template>
            </a-list>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<style scoped>
.reservation-list-page {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
