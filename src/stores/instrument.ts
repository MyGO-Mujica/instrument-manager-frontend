import { defineStore } from 'pinia'
import { ref } from 'vue'
import { instrumentApi } from '@/api'
import type { Instrument, Category } from '@/types'

export const useInstrumentStore = defineStore('instrument', () => {
  const instruments = ref<Instrument[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)

  async function fetchInstruments(params?: { category_id?: number; status?: string; keyword?: string }) {
    loading.value = true
    try {
      const res = await instrumentApi.getInstruments(params)
      instruments.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories(): Promise<Category[]> {
    const res = await instrumentApi.getCategories()
    categories.value = res.data
    return res.data
  }

  async function fetchInstrumentById(id: number): Promise<Instrument> {
    const res = await instrumentApi.getInstrumentById(id)
    return res.data
  }

  return { instruments, categories, loading, fetchInstruments, fetchCategories, fetchInstrumentById }
})
