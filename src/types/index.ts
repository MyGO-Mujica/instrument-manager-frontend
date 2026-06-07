// ========== Auth ==========
export interface User {
  user_id: number
  username: string
  role: 'student' | 'teacher' | 'admin'
  real_name: string
  student_id?: string
  department?: string
  phone?: string
  email?: string
  created_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface RegisterRequest {
  username: string
  password: string
  role: 'student' | 'teacher'
  real_name: string
  student_id?: string
  department?: string
  phone?: string
  email?: string
}

// ========== Instrument ==========
export interface Category {
  category_id: number
  name: string
}

export interface Instrument {
  instrument_id: number
  name: string
  model?: string
  asset_tag?: string
  category_id: number
  location?: string
  status: 'available' | 'in_use' | 'maintenance'
  description?: string
}

export interface InstrumentCreateRequest {
  name: string
  model?: string
  asset_tag?: string
  category_id: number
  location?: string
  description?: string
}

export interface InstrumentUpdateRequest extends InstrumentCreateRequest {
  status?: 'available' | 'in_use' | 'maintenance'
}

// ========== Reservation ==========
export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'

export interface Reservation {
  reservation_id: number
  user_id: number
  instrument_id: number
  date: string
  slot_id: number
  status: ReservationStatus
  apply_time: string
  approve_time: string | null
  admin_id: number | null
  remark: string | null
}

export interface CreateReservationRequest {
  instrument_id: number
  date: string
  slot_id: number
}

export interface ApproveReservationRequest {
  action: 'approved' | 'rejected'
  remark?: string
}

// ========== Slots ==========
export interface TimeSlot {
  slot_id: number
  label: string
  time_range: string
}

export const TIME_SLOTS: TimeSlot[] = [
  { slot_id: 1, label: '第1节', time_range: '08:00 - 10:00' },
  { slot_id: 2, label: '第2节', time_range: '10:00 - 12:00' },
  { slot_id: 3, label: '第3节', time_range: '14:00 - 16:00' },
  { slot_id: 4, label: '第4节', time_range: '16:00 - 18:00' },
]

// ========== Common ==========
export interface ApiError {
  detail: string
}

export interface MessageResponse {
  message: string
}
