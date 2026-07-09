import { apiFetch } from './client'
import type {
  ApiPaginated,
  ApiRentalCategory,
  ApiClothingListItem,
  ApiClothingDetail,
} from '@/types'

/**
 * Read-only services over the shared FOXIE rentals API.
 * Endpoints verified public (AllowAny on list/retrieve) in
 * backend/apps/rentals/views.py — 2026-07-09.
 */

export interface ClothingListParams {
  category?: string // RentalCategory slug
  status?: string // e.g. 'available'
  is_featured?: boolean
  search?: string
  ordering?: 'name' | '-name' | 'rental_price' | '-rental_price' | 'created_at' | '-created_at'
  page?: number
}

export async function fetchRentalCategories(): Promise<ApiRentalCategory[]> {
  const data = await apiFetch<ApiPaginated<ApiRentalCategory>>('/rentals/categories/')
  return data.results ?? []
}

export async function fetchClothingList(
  params: ClothingListParams = {},
): Promise<ApiPaginated<ApiClothingListItem>> {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') qs.set(key, String(value))
  }
  const query = qs.toString()
  return apiFetch<ApiPaginated<ApiClothingListItem>>(
    `/rentals/clothing/${query ? `?${query}` : ''}`,
  )
}

export async function fetchClothingDetail(slug: string): Promise<ApiClothingDetail> {
  return apiFetch<ApiClothingDetail>(`/rentals/clothing/${slug}/`)
}
