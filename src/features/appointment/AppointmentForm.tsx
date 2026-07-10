'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/api/leads'
import { Button } from '@/components/ui/Button'
import type { ApiValidationError } from '@/types'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface AppointmentFormProps {
  /** Best-effort pre-fill only — the visitor can freely edit or clear it */
  defaultServiceInterest?: string
}

export function AppointmentForm({ defaultServiceInterest }: AppointmentFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [fieldErrors, setFieldErrors] = useState<ApiValidationError | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return // double-submit guard

    const form = e.currentTarget
    const data = new FormData(form)
    const trim = (key: string) => String(data.get(key) ?? '').trim()

    setStatus('submitting')
    setFieldErrors(null)
    setGeneralError(null)

    const result = await submitLead({
      name: trim('name'),
      phone: trim('phone') || undefined,
      email: trim('email') || undefined,
      service_interest: trim('service_interest') || undefined,
      message: trim('message') || undefined,
      source: 'website',
    })

    if (result.ok) {
      setStatus('success')
      setSuccessMessage(result.data.detail)
      form.reset()
      return
    }

    setStatus('error')
    if (result.kind === 'validation') {
      setFieldErrors(result.errors)
    } else if (result.kind === 'network') {
      setGeneralError('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.')
    } else {
      setGeneralError('Đã có lỗi xảy ra. Vui lòng thử lại sau ít phút, hoặc liên hệ trực tiếp qua hotline.')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="border border-line bg-cream px-8 py-14 text-center">
        <p className="font-display text-2xl font-light text-charcoal">Cảm ơn bạn!</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-taupe">{successMessage}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <p role="alert" className="border border-line bg-cream px-4 py-3 text-sm text-charcoal">
          {generalError}
        </p>
      )}

      <Field label="Họ và tên" name="name" required autoComplete="name" error={fieldErrors?.name} />
      <Field label="Số điện thoại" name="phone" type="tel" required autoComplete="tel" error={fieldErrors?.phone} />
      <Field label="Email (không bắt buộc)" name="email" type="email" autoComplete="email" error={fieldErrors?.email} />
      <Field
        label="Bạn quan tâm đến thiết kế nào"
        name="service_interest"
        defaultValue={defaultServiceInterest}
        placeholder="Váy cưới, vest cưới, áo dài cưới…"
        error={fieldErrors?.service_interest}
      />
      <TextAreaField
        label="Ghi chú thêm (không bắt buộc)"
        name="message"
        placeholder="Ngày mong muốn, số đo, khung giờ thuận tiện…"
        error={fieldErrors?.message}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === 'submitting'}
        className="w-full justify-center"
      >
        {status === 'submitting' ? 'Đang gửi…' : 'Gửi yêu cầu đặt lịch'}
      </Button>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  defaultValue,
  placeholder,
  error,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  defaultValue?: string
  placeholder?: string
  error?: string[]
}) {
  const id = `appointment-${name}`
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-taupe">
        {label}
        {required && (
          <span aria-hidden className="text-champagne">
            {' '}
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full border-b border-line bg-transparent py-2.5 text-sm text-charcoal placeholder:text-taupe/60 focus:border-champagne focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-champagne-deep">
          {error[0]}
        </p>
      )}
    </div>
  )
}

function TextAreaField({
  label,
  name,
  placeholder,
  error,
}: {
  label: string
  name: string
  placeholder?: string
  error?: string[]
}) {
  const id = `appointment-${name}`
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-taupe">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={3}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full resize-none border-b border-line bg-transparent py-2.5 text-sm text-charcoal placeholder:text-taupe/60 focus:border-champagne focus:outline-none"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-champagne-deep">
          {error[0]}
        </p>
      )}
    </div>
  )
}
