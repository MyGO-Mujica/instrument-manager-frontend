import http from './http'
import type { Reservation, CreateReservationRequest, ApproveReservationRequest } from '@/types'

export const reservationApi = {
  getReservations(params?: {
    status?: string
    date_from?: string
    date_to?: string
  }) {
    return http.get<Reservation[]>('/reservations', { params })
  },

  createReservation(data: CreateReservationRequest) {
    return http.post<Reservation>('/reservations', data)
  },

  cancelReservation(id: number) {
    return http.put<{ message: string }>(`/reservations/${id}/cancel`)
  },

  approveReservation(id: number, data: ApproveReservationRequest) {
    return http.put<{ message: string }>(`/reservations/${id}/approve`, data)
  },
}
