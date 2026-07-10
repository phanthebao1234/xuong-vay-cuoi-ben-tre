/**
 * API response types — verified against FOXIE backend source
 * (backend/apps/rentals/serializers.py) on 2026-07-09.
 * Do NOT invent fields. Re-verify against serializers before extending.
 * All list endpoints return the paginated shape, never a raw array.
 */

export interface ApiPaginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/** GET /rentals/categories/ — RentalCategorySerializer */
export interface ApiRentalCategory {
  id: string
  name: string
  slug: string
  description: string
  sort_order: number
  clothing_count: number
  created_at: string
}

export type ClothingStatus =
  | 'available'
  | 'reserved'
  | 'rented'
  | 'maintenance'
  | 'retired'

/** GET /rentals/clothing/ — ClothingListSerializer */
export interface ApiClothingListItem {
  id: string
  code: string
  name: string
  slug: string
  category: string | null // UUID string, NOT a nested object
  category_name: string | null
  category_slug: string | null
  colors: string[]
  sizes: string[]
  material: string
  rental_price: number
  sale_price: number | null
  status: ClothingStatus
  quantity: number
  is_featured: boolean
  cover_image_url: string
  created_at: string
  updated_at: string
}

/** Nested in ClothingDetailSerializer — ClothingImageSerializer */
export interface ApiClothingImage {
  id: string
  file_url: string
  thumbnail_url: string
  sort_order: number
  is_cover: boolean
  created_at: string
}

/** GET /rentals/clothing/{slug}/ — ClothingDetailSerializer (fields = '__all__') */
export interface ApiClothingDetail extends Omit<ApiClothingListItem, 'cover_image_url'> {
  description: string
  images: ApiClothingImage[]
}

/** GET /rentals/accessories/ — AccessoryListSerializer */
export interface ApiAccessoryListItem {
  id: string
  name: string
  slug: string
  category: string
  rental_price: number
  status: ClothingStatus
  quantity: number
  cover_image_url: string
  created_at: string
  updated_at: string
}

/**
 * POST /leads/submit/ — LeadPublicSerializer, verified against FOXIE source
 * (backend/apps/leads/{models,serializers,views}.py) on 2026-07-10.
 * Only `name` is required — `phone`/`email`/`message`/`service_interest` are
 * `blank=True` on the model; `source` has a model default ('website').
 */
export interface LeadSubmitPayload {
  name: string
  phone?: string
  email?: string
  message?: string
  service_interest?: string
  source?: 'website' | 'facebook' | 'zalo' | 'referral' | 'phone'
}

/** 201 response body from /leads/submit/ */
export interface LeadSubmitResponse {
  detail: string
}

/** DRF's standard validation-error shape on 400 — field name → list of messages */
export type ApiValidationError = Record<string, string[]>
