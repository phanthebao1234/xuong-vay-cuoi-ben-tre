/** Format a VND integer as "3.500.000₫". Rental prices are integers (VND). */
export function formatPrice(vnd: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(vnd)}₫`
}
