import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/config/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FBF9F4',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: '1px solid #C0A062',
            opacity: 0.5,
            display: 'flex',
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: 16,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#9C8E80',
            marginBottom: 28,
          }}
        >
          Bến Tre
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 66,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            color: '#2A2523',
            textAlign: 'center',
            padding: '0 100px',
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#9C8E80',
            marginTop: 28,
            textAlign: 'center',
            padding: '0 140px',
          }}
        >
          Váy cưới · Vest cưới · Áo dài cưới cao cấp
        </div>
      </div>
    ),
    { ...size },
  )
}
