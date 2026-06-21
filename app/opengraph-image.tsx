import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "Cercle d'Échecs Spicéen — Club d'échecs aux Epesses, Vendée"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1A1A1A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              lineHeight: 1,
            }}
          >
            ♟
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div
              style={{
                color: '#C9922A',
                fontSize: '52px',
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Cercle d&apos;Échecs Spicéen
            </div>
            <div
              style={{
                color: '#9CA3AF',
                fontSize: '20px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Convivial par nature, ambitieux par passion
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '16px',
          }}
        >
          {[
            '📍 Les Epesses, Vendée (85590)',
            '🗓 Lundi & Mercredi · 18h15',
            '🎁 1ère séance offerte',
          ].map((item) => (
            <div
              key={item}
              style={{
                background: '#2A2A2A',
                borderRadius: '12px',
                padding: '12px 20px',
                color: '#E5E7EB',
                fontSize: '18px',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
