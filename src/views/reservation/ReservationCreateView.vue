<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInstrumentStore } from '@/stores/instrument'
import { useReservationStore } from '@/stores/reservation'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { TIME_SLOTS } from '@/types'
import type { Reservation } from '@/types'

const route = useRoute()
const router = useRouter()
const instrumentStore = useInstrumentStore()
const reservationStore = useReservationStore()

const instrumentId = Number(route.params.id)
const instrument = ref<any>(null)
const selectedDate = ref<string>(dayjs().format('YYYY-MM-DD'))
const selectedSlotId = ref<number | null>(null)
const loading = ref(true)
const submitting = ref(false)
const takenSlots = ref<Set<number>>(new Set())

onMounted(async () => {
  if (!instrumentId) {
    message.error('仪器ID无效')
    router.push('/instruments')
    return
  }
  try {
    instrument.value = await instrumentStore.fetchInstrumentById(instrumentId)
  } catch {
    message.error('获取仪器信息失败')
    router.push('/instruments')
    return
  } finally {
    loading.value = false
  }
  await loadTakenSlots()
})

async function loadTakenSlots() {
  try {
    const res = await reservationStore.fetchReservations({
      date_from: selectedDate.value,
      date_to: selectedDate.value,
    })
    // Filter reservations for this instrument that are approved or pending
    const taken = res.filter(
      (r: Reservation) =>
        r.instrument_id === instrumentId &&
        (r.status === 'approved' || r.status === 'pending'),
    )
    takenSlots.value = new Set(taken.map((r: Reservation) => r.slot_id))
  } catch {
    takenSlots.value = new Set()
  }
}

async function onDateChange(date: dayjs.Dayjs) {
  selectedDate.value = date.format('YYYY-MM-DD')
  selectedSlotId.value = null
  await loadTakenSlots()
}

async function handleSubmit() {
  if (!selectedDate.value || !selectedSlotId.value) {
    message.warning('请选择日期和时段')
    return
  }
  submitting.value = true
  try {
    await reservationStore.createReservation({
      instrument_id: instrumentId,
      date: selectedDate.value,
      slot_id: selectedSlotId.value,
    })
    message.success('预约提交成功，等待审批')
    router.push('/reservations')
  } catch (err: any) {
    const msg = err?.response?.data?.detail || '预约失败，请重试'
    message.error(msg)
  } finally {
    submitting.value = false
  }
}

const canSubmit = computed(() => selectedDate.value && selectedSlotId.value !== null)
</script>

<template>
  <div class="reserve-page">
    <a-button type="link" style="margin-bottom: 16px; padding-left: 0;" @click="router.push('/instruments')">
      ← 返回列表
    </a-button>

    <a-spin :spinning="loading">
      <a-row :gutter="24" v-if="instrument">
        <a-col :xs="24" :md="14">
          <a-card :bordered="false" class="reserve-card">
            <template #title>
              <span style="font-size: 18px; font-weight: 600;">预约：{{ instrument.name }}</span>
            </template>

            <div style="margin-bottom: 24px;">
              <div class="section-label">选择日期</div>
              <a-date-picker
                :value="dayjs(selectedDate)"
                @change="onDateChange"
                :disabled-date="(current: dayjs.Dayjs) => current.isBefore(dayjs(), 'day')"
                style="width: 100%"
                size="large"
              />
            </div>

            <div>
              <div class="section-label">选择时段</div>
              <div class="slot-grid">
                <div
                  v-for="slot in TIME_SLOTS"
                  :key="slot.slot_id"
                  class="slot-card"
                  :class="{
                    'slot-taken': takenSlots.has(slot.slot_id),
                    'slot-selected': selectedSlotId === slot.slot_id,
                    'slot-available': !takenSlots.has(slot.slot_id),
                  }"
                  @click="!takenSlots.has(slot.slot_id) && (selectedSlotId = slot.slot_id)"
                >
                  <div class="slot-label">{{ slot.label }}</div>
                  <div class="slot-time">{{ slot.time_range }}</div>
                  <div v-if="takenSlots.has(slot.slot_id)" class="slot-status">已预约</div>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :md="10">
          <a-card :bordered="false" class="summary-card">
            <template #title>
              <span style="font-size: 16px; font-weight: 600;">预约摘要</span>
            </template>
            <a-descriptions :column="1">
              <a-descriptions-item label="仪器">{{ instrument.name }}</a-descriptions-item>
              <a-descriptions-item label="日期">{{ selectedDate }}</a-descriptions-item>
              <a-descriptions-item label="时段">
                {{ selectedSlotId ? TIME_SLOTS.find(s => s.slot_id === selectedSlotId)?.label + ' ' + TIME_SLOTS.find(s => s.slot_id === selectedSlotId)?.time_range : '未选择' }}
              </a-descriptions-item>
            </a-descriptions>
            <a-button
              type="primary"
              block
              size="large"
              :disabled="!canSubmit"
              :loading="submitting"
              @click="handleSubmit"
              style="margin-top: 16px;"
            >
              提交预约
            </a-button>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<style scoped>
.reserve-page {
  max-width: 1000px;
  margin: 0 auto;
}

.reserve-card,
.summary-card {
  border-radius: 8px;
}

.section-label {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--text-primary, #1f2937);
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.slot-card {
  padding: 16px;
  border: 2px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  user-select: none;
}

.slot-available:hover {
  border-color: var(--primary-color, #1890ff);
  background: rgba(24, 144, 255, 0.04);
}

.slot-selected {
  border-color: var(--primary-color, #1890ff);
  background: rgba(24, 144, 255, 0.08);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.slot-taken {
  background: #f5f5f5;
  border-color: #d9d9d9;
  cursor: not-allowed;
  opacity: 0.6;
}

.slot-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #1f2937);
}

.slot-time {
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin-top: 4px;
  font-family: var(--mono, monospace);
}

.slot-status {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
</style>
