<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { reservationApi } from '@/api'
import { message, Modal } from 'ant-design-vue'
import { TIME_SLOTS } from '@/types'
import type { Reservation } from '@/types'

const loading = ref(false)
const reservations = ref<Reservation[]>([])

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'orange', label: '待审批' },
  approved: { color: 'green', label: '已通过' },
  rejected: { color: 'red', label: '已拒绝' },
  cancelled: { color: 'default', label: '已取消' },
  completed: { color: 'blue', label: '已完成' },
}

const statusFilter = ref<string | undefined>(undefined)

const columns = [
  { title: 'ID', dataIndex: 'reservation_id', width: 60 },
  { title: '用户ID', dataIndex: 'user_id', width: 80 },
  { title: '仪器ID', dataIndex: 'instrument_id', width: 80 },
  { title: '日期', dataIndex: 'date', width: 120 },
  {
    title: '时段',
    key: 'slot',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
  },
  { title: '申请时间', dataIndex: 'apply_time', width: 160 },
  { title: '备注', dataIndex: 'remark', width: 150 },
  { title: '操作', key: 'action', width: 150 },
]

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await reservationApi.getReservations(
      statusFilter.value ? { status: statusFilter.value } : undefined,
    )
    reservations.value = res.data
  } catch {
    message.error('加载预约数据失败')
  } finally {
    loading.value = false
  }
}

function getSlotLabel(slotId: number): string {
  const s = TIME_SLOTS.find(s => s.slot_id === slotId)
  return s ? `${s.label} ${s.time_range}` : `时段#${slotId}`
}

function handleApprove(record: Reservation) {
  Modal.confirm({
    title: '审批确认',
    content: `确定要通过预约 #${record.reservation_id} 吗？`,
    okText: '通过',
    cancelText: '取消',
    onOk: async () => {
      try {
        await reservationApi.approveReservation(record.reservation_id, { action: 'approved' })
        message.success('已通过')
        await loadData()
      } catch (err: any) {
        message.error(err?.response?.data?.detail || '操作失败')
      }
    },
  })
}

function handleReject(record: Reservation) {
  let remark = ''
  Modal.confirm({
    title: '拒绝预约',
    content: h('div', [
      h('p', `确定要拒绝预约 #${record.reservation_id} 吗？`),
      h('a-input', {
        placeholder: '拒绝原因（可选）',
        onChange: (e: any) => { remark = e.target.value },
        style: { marginTop: '8px' },
      }),
    ]),
    okText: '拒绝',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await reservationApi.approveReservation(record.reservation_id, { action: 'rejected', remark: remark || undefined })
        message.success('已拒绝')
        await loadData()
      } catch (err: any) {
        message.error(err?.response?.data?.detail || '操作失败')
      }
    },
  })
}
</script>

<template>
  <div class="admin-reservation-page">
    <a-card :bordered="false">
      <template #title>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 18px; font-weight: 600;">预约审批</span>
          <a-select
            v-model:value="statusFilter"
            :options="[
              { value: undefined, label: '全部状态' },
              { value: 'pending', label: '待审批' },
              { value: 'approved', label: '已通过' },
              { value: 'rejected', label: '已拒绝' },
              { value: 'cancelled', label: '已取消' },
            ]"
            style="width: 140px"
            allow-clear
            @change="loadData"
          />
        </div>
      </template>

      <a-table
        :dataSource="reservations"
        :columns="columns"
        :loading="loading"
        rowKey="reservation_id"
        :pagination="{ pageSize: 15 }"
        :scroll="{ x: 900 }"
      >
        <template #bodyCell="{ column, record }: { column: any; record: Reservation }">
          <template v-if="column.key === 'slot'">
            {{ getSlotLabel(record.slot_id) }}
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusConfig[record.status]?.color || 'default'">
              {{ statusConfig[record.status]?.label || record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <template v-if="record.status === 'pending'">
              <a-button type="link" style="color: #52c41a;" @click="handleApprove(record)">通过</a-button>
              <a-button type="link" danger @click="handleReject(record)">拒绝</a-button>
            </template>
            <span v-else style="color: #999;">—</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
