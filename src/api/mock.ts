/**
 * Mock API responses for development without a backend.
 * Toggle via localStorage:  localStorage.setItem('use_mock', 'true')
 * Or set VITE_USE_MOCK=true in .env
 */

import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// ========== Mock Data Store ==========

interface MockUser {
  user_id: number
  username: string
  role: 'student' | 'teacher' | 'admin'
  real_name: string
  student_id?: string
  department?: string
  phone?: string
  email?: string
  password: string
  created_at: string
}

// Seed users
const users: MockUser[] = [
  {
    user_id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    real_name: '系统管理员',
    department: '实验室管理处',
    phone: '13800000000',
    email: 'admin@guet.edu.cn',
    created_at: '2024-01-01T00:00:00',
  },
  {
    user_id: 2,
    username: 'zhangsan',
    password: '123456',
    role: 'student',
    real_name: '张三',
    student_id: '2024001',
    department: '计算机学院',
    phone: '13800138001',
    created_at: '2024-01-15T08:30:00',
  },
  {
    user_id: 3,
    username: 'lisi',
    password: '123456',
    role: 'teacher',
    real_name: '李四',
    student_id: 'T2024001',
    department: '电子工程学院',
    phone: '13800138002',
    created_at: '2024-01-16T09:00:00',
  },
]

const categories = [
  { category_id: 1, name: '电子测量仪器' },
  { category_id: 2, name: '光学仪器' },
  { category_id: 3, name: '机械加工设备' },
  { category_id: 4, name: '计算机与网络设备' },
  { category_id: 5, name: '化学分析仪器' },
]

let nextInstrumentId = 10
const instruments = [
  { instrument_id: 1, name: '数字示波器', model: 'DSO-X 3034T', asset_tag: 'E001-2024', category_id: 1, location: '实验楼A301', status: 'available', description: '4通道，350MHz带宽，适合数字电路分析' },
  { instrument_id: 2, name: '频谱分析仪', model: 'N9000B', asset_tag: 'E002-2024', category_id: 1, location: '实验楼A302', status: 'in_use', description: '频率范围 10Hz-26.5GHz' },
  { instrument_id: 3, name: '光学显微镜', model: 'CX43', asset_tag: 'O001-2024', category_id: 2, location: '实验楼B201', status: 'available', description: '三目显微镜，40-1000倍' },
  { instrument_id: 4, name: '激光共聚焦显微镜', model: 'LSM900', asset_tag: 'O002-2024', category_id: 2, location: '实验楼B203', status: 'maintenance', description: '含Airyscan 2超高分辨率模块' },
  { instrument_id: 5, name: '数控铣床', model: 'VMC850', asset_tag: 'M001-2024', category_id: 3, location: '实训中心101', status: 'available', description: '三轴联动，工作台 800×500mm' },
  { instrument_id: 6, name: '3D打印机', model: 'Creator 3', asset_tag: 'M002-2024', category_id: 3, location: '实训中心102', status: 'in_use', description: 'FDM双喷头，250×250×300mm' },
  { instrument_id: 7, name: 'GPU服务器', model: 'DGX A100', asset_tag: 'C001-2024', category_id: 4, location: '计算中心A101', status: 'available', description: '8×A100 80GB，用于深度学习训练' },
  { instrument_id: 8, name: '高性能工作站', model: 'Precision 7920', asset_tag: 'C002-2024', category_id: 4, location: '计算中心A102', status: 'available', description: 'Xeon W-2295, 128GB RAM, RTX 6000' },
  { instrument_id: 9, name: '紫外可见分光光度计', model: 'UV-2600i', asset_tag: 'CH001-2024', category_id: 5, location: '化学楼C301', status: 'available', description: '波长范围 185-900nm' },
]

let nextReservationId = 10
const reservations = [
  { reservation_id: 1, user_id: 2, instrument_id: 1, date: '2024-06-20', slot_id: 1, status: 'approved', apply_time: '2024-06-18T10:00:00', approve_time: '2024-06-19T08:00:00', admin_id: 1, remark: null },
  { reservation_id: 2, user_id: 2, instrument_id: 2, date: '2024-06-21', slot_id: 2, status: 'pending', apply_time: '2024-06-19T14:30:00', approve_time: null, admin_id: null, remark: null },
  { reservation_id: 3, user_id: 3, instrument_id: 5, date: '2024-06-22', slot_id: 3, status: 'approved', apply_time: '2024-06-18T09:00:00', approve_time: '2024-06-19T10:00:00', admin_id: 1, remark: '请按时使用' },
  { reservation_id: 4, user_id: 2, instrument_id: 7, date: '2024-06-15', slot_id: 1, status: 'completed', apply_time: '2024-06-10T11:00:00', approve_time: '2024-06-11T09:00:00', admin_id: 1, remark: null },
  { reservation_id: 5, user_id: 3, instrument_id: 3, date: '2024-06-18', slot_id: 2, status: 'rejected', apply_time: '2024-06-16T16:00:00', approve_time: '2024-06-17T08:00:00', admin_id: 1, remark: '该时段已另有安排' },
  { reservation_id: 6, user_id: 2, instrument_id: 9, date: '2024-06-20', slot_id: 3, status: 'cancelled', apply_time: '2024-06-17T10:00:00', approve_time: null, admin_id: null, remark: null },
  { reservation_id: 7, user_id: 3, instrument_id: 8, date: '2024-06-23', slot_id: 1, status: 'pending', apply_time: '2024-06-20T08:30:00', approve_time: null, admin_id: null, remark: null },
  { reservation_id: 8, user_id: 3, instrument_id: 5, date: '2024-06-23', slot_id: 2, status: 'pending', apply_time: '2024-06-20T09:00:00', approve_time: null, admin_id: null, remark: null },
  { reservation_id: 9, user_id: 2, instrument_id: 1, date: '2024-06-23', slot_id: 3, status: 'pending', apply_time: '2024-06-20T10:00:00', approve_time: null, admin_id: null, remark: null },
]
// Make all pending reservations for today/tomorrow so the UI shows them
const today = new Date()
reservations.forEach(r => {
  if (r.status === 'pending') {
    const d = new Date(today)
    d.setDate(d.getDate() + (r.reservation_id % 3)) // spread over next 3 days
    r.date = d.toISOString().slice(0, 10)
  }
})
// Set a few taken slots for today on instrument 1 (for the reservation create view)
const todayStr = today.toISOString().slice(0, 10)
reservations.push(
  { reservation_id: 100, user_id: 3, instrument_id: 1, date: todayStr, slot_id: 1, status: 'approved', apply_time: todayStr + 'T08:00:00', approve_time: todayStr + 'T09:00:00', admin_id: 1, remark: null },
  { reservation_id: 101, user_id: 3, instrument_id: 1, date: todayStr, slot_id: 4, status: 'pending', apply_time: todayStr + 'T09:00:00', approve_time: null, admin_id: null, remark: null },
)

// ========== Mock Response Builder ==========

function mockResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config: {} as InternalAxiosRequestConfig,
  }
}

function matchUrl(url: string, pattern: string): RegExpMatchArray | null {
  // Convert route pattern like /instruments/:id to regex
  const regexStr = pattern.replace(/:id/g, '(\\d+)')
  return url.match(new RegExp(`^${regexStr}$`))
}

// ========== Main Mock Handler ==========

export function handleMockRequest(config: InternalAxiosRequestConfig): AxiosResponse | null {
  // Only intercept if mock mode is on
  const useMock = localStorage.getItem('use_mock') !== 'false'
  if (!useMock) return null

  const method = (config.method || 'get').toLowerCase()
  // Extract path from URL (could be full URL or just path at different stages)
  const url = config.url || ''
  let path = url
  // If it's a full URL (http://...), extract just the pathname
  if (url.startsWith('http')) {
    try { path = new URL(url).pathname } catch { /* fall through */ }
  }
  // Remove /api prefix if present
  path = path.replace(/^\/api/, '')

  console.log('[Mock Debug] method:', method, 'path:', path, 'original url:', url)

  try {
    const result = routeMock(method, path, config)
    console.log('[Mock Debug] routeMock result:', result)
    return result
  } catch (e) {
    console.log('[Mock Debug] routeMock error:', e)
    return null
  }
}

// Helper to safely parse request body (could be string or already parsed object)
function parseBody(data: any): any {
  if (!data) return {}
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return {}
    }
  }
  return data
}

function routeMock(method: string, path: string, config: InternalAxiosRequestConfig): AxiosResponse | null {
  // === Auth ===

  if (method === 'post' && path === '/auth/login') {
    const body = parseBody(config.data)
    const user = users.find(u => u.username === body.username && u.password === body.password)
    if (!user) {
      return mockResponse({ detail: '用户名或密码错误' }, 400)
    }
    const { password: _, ...safeUser } = user
    return mockResponse({
      access_token: 'mock-jwt-token-' + user.user_id,
      token_type: 'bearer',
      user: safeUser,
    })
  }

  if (method === 'post' && path === '/auth/register') {
    const body = parseBody(config.data)
    const exists = users.find(u => u.username === body.username)
    if (exists) {
      return mockResponse({ detail: '用户名已存在' }, 400)
    }
    const newUser: MockUser = {
      user_id: users.length + 1,
      username: body.username,
      password: body.password,
      role: body.role,
      real_name: body.real_name,
      student_id: body.student_id,
      department: body.department,
      phone: body.phone,
      email: body.email,
      created_at: new Date().toISOString(),
    }
    users.push(newUser)
    const { password: _, ...safeUser } = newUser
    return mockResponse(safeUser)
  }

  if (method === 'post' && path === '/auth/logout') {
    return mockResponse({ message: '已登出' })
  }

  // === Categories ===

  if (method === 'get' && path === '/categories') {
    return mockResponse(categories)
  }

  // === Instruments ===

  if (method === 'get' && path === '/instruments') {
    let result = [...instruments]
    const params = config.params || {}
    if (params.category_id) {
      result = result.filter(i => i.category_id === Number(params.category_id))
    }
    if (params.status) {
      result = result.filter(i => i.status === params.status)
    }
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      result = result.filter(i => i.name.toLowerCase().includes(kw))
    }
    return mockResponse(result)
  }

  const instrMatch = matchUrl(path, '/instruments/:id')
  if (instrMatch) {
    const id = Number(instrMatch[1])
    if (method === 'get') {
      const item = instruments.find(i => i.instrument_id === id)
      if (!item) return mockResponse({ detail: '仪器不存在' }, 404)
      return mockResponse(item)
    }
    if (method === 'put') {
      const idx = instruments.findIndex(i => i.instrument_id === id)
      if (idx === -1) return mockResponse({ detail: '仪器不存在' }, 404)
      const body = JSON.parse(config.data || '{}')
      instruments[idx] = { ...instruments[idx], ...body }
      return mockResponse(instruments[idx])
    }
    if (method === 'delete') {
      const idx = instruments.findIndex(i => i.instrument_id === id)
      if (idx === -1) return mockResponse({ detail: '仪器不存在' }, 404)
      instruments.splice(idx, 1)
      return mockResponse({ message: '已删除' })
    }
  }

  if (method === 'post' && path === '/instruments') {
    const body = JSON.parse(config.data || '{}')
    const newInstrument = {
      instrument_id: nextInstrumentId++,
      name: body.name,
      model: body.model || '',
      asset_tag: body.asset_tag || '',
      category_id: body.category_id,
      location: body.location || '',
      status: 'available' as const,
      description: body.description || '',
    }
    instruments.push(newInstrument)
    return mockResponse(newInstrument)
  }

  // === Reservations ===

  if (method === 'get' && path === '/reservations') {
    const params = config.params || {}
    let result = [...reservations]
    if (params.status) {
      result = result.filter(r => r.status === params.status)
    }
    if (params.date_from) {
      result = result.filter(r => r.date >= params.date_from)
    }
    if (params.date_to) {
      result = result.filter(r => r.date <= params.date_to)
    }
    return mockResponse(result)
  }

  if (method === 'post' && path === '/reservations') {
    const body = JSON.parse(config.data || '{}')
    const instrument = instruments.find(i => i.instrument_id === body.instrument_id)
    if (!instrument) return mockResponse({ detail: '仪器不存在' }, 400)
    if (instrument.status !== 'available') return mockResponse({ detail: '仪器当前不可预约' }, 400)
    // Check for time conflict
    const conflict = reservations.find(
      r => r.instrument_id === body.instrument_id && r.date === body.date && r.slot_id === body.slot_id &&
        (r.status === 'pending' || r.status === 'approved')
    )
    if (conflict) return mockResponse({ detail: '该时段已被预约' }, 400)

    const newReservation = {
      reservation_id: nextReservationId++,
      user_id: 2, // current mock user
      instrument_id: body.instrument_id,
      date: body.date,
      slot_id: body.slot_id,
      status: 'pending' as const,
      apply_time: new Date().toISOString(),
      approve_time: null,
      admin_id: null,
      remark: null,
    }
    reservations.push(newReservation)
    return mockResponse(newReservation)
  }

  const cancelMatch = matchUrl(path, '/reservations/:id/cancel')
  if (cancelMatch) {
    const id = Number(cancelMatch[1])
    const res = reservations.find(r => r.reservation_id === id)
    if (!res) return mockResponse({ detail: '预约不存在' }, 404)
    if (res.status !== 'pending') return mockResponse({ detail: '只能取消待审批的预约' }, 400)
    res.status = 'cancelled'
    return mockResponse({ message: '已取消' })
  }

  const approveMatch = matchUrl(path, '/reservations/:id/approve')
  if (approveMatch) {
    const id = Number(approveMatch[1])
    const res = reservations.find(r => r.reservation_id === id)
    if (!res) return mockResponse({ detail: '预约不存在' }, 404)
    const body = JSON.parse(config.data || '{}')
    res.status = body.action
    res.approve_time = new Date().toISOString()
    res.admin_id = 1
    res.remark = body.remark || null
    return mockResponse({ message: '审批完成' })
  }

  // No mock matched
  return null
}
