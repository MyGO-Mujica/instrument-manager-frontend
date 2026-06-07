import http from './http'
import type { Category, Instrument, InstrumentCreateRequest, InstrumentUpdateRequest } from '@/types'

export const instrumentApi = {
  getCategories() {
    return http.get<Category[]>('/categories')
  },

  getInstruments(params?: {
    category_id?: number
    status?: string
    keyword?: string
  }) {
    return http.get<Instrument[]>('/instruments', { params })
  },

  getInstrumentById(id: number) {
    return http.get<Instrument>(`/instruments/${id}`)
  },

  createInstrument(data: InstrumentCreateRequest) {
    return http.post<Instrument>('/instruments', data)
  },

  updateInstrument(id: number, data: InstrumentUpdateRequest) {
    return http.put<Instrument>(`/instruments/${id}`, data)
  },

  deleteInstrument(id: number) {
    return http.delete<{ message: string }>(`/instruments/${id}`)
  },
}
