import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import appStoreBadgeEt from '@/images/appstore-badge-et.svg'
import appStoreBadgeEn from '@/images/appstore-badge-en.svg'
import googlePlayBadgeEt from '@/images/google-play-badge-et.svg'
import googlePlayBadgeEn from '@/images/google-play-badge-en.svg'

const AREAS = [
  { code: 'EE', key: 'ee' },
  { code: 'FI', key: 'fi' },
  { code: 'LV', key: 'lv' },
  { code: 'LT', key: 'lt' },
]

const AREA_NAMES = {
  et: { EE: 'Eesti', FI: 'Soome', LV: 'Läti', LT: 'Leedu' },
  en: { EE: 'Estonia', FI: 'Finland', LV: 'Latvia', LT: 'Lithuania' },
}

const TRANSLATIONS = {
  et: {
    interval15min: '15 min',
    interval1h: '1 tund',
    pageTitle: 'NordPrice – Nord Pooli elektrihinnad',
    pageDescription: 'NordPrice näitab reaalajas Nord Pooli elektrihindu Eestis, Soomes, Lätis ja Leedus.',
    appSubtitle: 'Nord Pooli elektrihinnad',
    currentPrice: (name) => `Praegune hind · ${name}`,
    vatIncluded: 'KM sees',
    liveFromElering: 'Andmed otse Eleringist',
    sampleFallback: 'Näidisandmed',
    updatedLabel: 'Uuendatud',
    now: 'Praegu',
    priceCurve: 'Hinnagraafik',
    today: 'Täna',
    tomorrow: 'Homme',
    notPublished: 'Hinnad pole veel avaldatud',
    tomorrowAvailable: 'Homne hinnainfo on saadaval alates 15:00',
    min: 'Min',
    average: 'Keskmine',
    max: 'Max',
    level: {
      veryCheap: 'Väga odav',
      cheap: 'Odav',
      normal: 'Keskmine',
      expensive: 'Kallis',
    },
    unitWords: {
      'c/kWh': ['senti', '/kWh'],
      '€/kWh': ['€', '/kWh'],
      '€/MWh': ['€', '/MWh'],
    },
    unitShort: {
      'c/kWh': 's/kWh',
      '€/kWh': '€/kWh',
      '€/MWh': '€/MWh',
    },
    settings: 'Seaded',
    region: 'Piirkond',
    unit: 'Ühik',
    graphInterval: 'Intervall',
    tax: 'Maks',
    downloadApp: 'Laadi rakendus alla',
    privacy: 'Privaatsus',
    dateLocale: 'et-EE',
  },
  en: {
    interval15min: '15 min',
    interval1h: '1 hour',
    pageTitle: 'NordPrice – Nord Pool electricity prices',
    pageDescription: 'NordPrice shows live Nord Pool electricity prices for Estonia, Finland, Latvia, and Lithuania.',
    appSubtitle: 'Nord Pool electricity prices',
    currentPrice: (name) => `Current price in ${name}`,
    vatIncluded: 'VAT included',
    liveFromElering: 'Data live from Elering',
    sampleFallback: 'Sample data',
    updatedLabel: 'Updated',
    now: 'Now',
    priceCurve: 'Price chart',
    today: 'Today',
    tomorrow: 'Tomorrow',
    notPublished: 'Prices are not published yet',
    tomorrowAvailable: 'Tomorrow\u2019s prices are available from 15:00',
    min: 'Min',
    average: 'Average',
    max: 'Max',
    level: {
      veryCheap: 'Very cheap',
      cheap: 'Cheap',
      normal: 'Average',
      expensive: 'Expensive',
    },
    unitWords: {
      'c/kWh': ['cents', '/kWh'],
      '€/kWh': ['€', '/kWh'],
      '€/MWh': ['€', '/MWh'],
    },
    unitShort: {
      'c/kWh': 'c/kWh',
      '€/kWh': '€/kWh',
      '€/MWh': '€/MWh',
    },
    settings: 'Settings',
    region: 'Region',
    unit: 'Unit',
    graphInterval: 'Interval',
    tax: 'Tax',
    downloadApp: 'Download the app',
    privacy: 'Privacy',
    dateLocale: 'en-GB',
  },
}

const TIME_ZONE = 'Europe/Tallinn'
const VAT_RATE = 1.24

const SAMPLE_PRICES = [
  54, 48, 43, 40, 46, 68, 112, 154, 139, 104, 82, 71, 64, 58, 55, 63,
  91, 148, 183, 144, 101, 78, 65, 57,
]

const TOMORROW_SAMPLE_PRICES = [
  38, 32, 27, 24, 21, 33, 58, 84, 69, 36, 13, -9, -18, -24, -14, 6,
  45, 98, 129, 94, 59, 43, 35, 29,
]

const classNames = (...classes) => classes.filter(Boolean).join(' ')

function tallinnDayKey(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function tallinnTime(date, options = {}) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options,
  }).format(date)
}

function tallinnHour(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(date)
}

function tallinnDateLabel(date, locale = 'en-GB') {
  return new Intl.DateTimeFormat(locale, {
    timeZone: TIME_ZONE,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function getDayKeys(now = new Date()) {
  const today = tallinnDayKey(now)
  const [year, month, day] = today.split('-').map(Number)
  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1))

  return {
    today,
    tomorrow: tomorrow.toISOString().slice(0, 10),
  }
}

function formatNumber(value, fractionDigits = 1) {
  return new Intl.NumberFormat('et-EE', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

function unitDecimals(unit) {
  if (unit === 'c/kWh') return 2
  if (unit === '€/kWh') return 4
  return 1
}

function displayValue(value, unit, includeTax) {
  const adjusted = includeTax ? value * VAT_RATE : value
  if (unit === 'c/kWh') return adjusted / 10
  if (unit === '€/kWh') return adjusted / 1000
  return adjusted
}

function formatPrice(value, unit, includeTax) {
  if (value == null || Number.isNaN(value)) {
    return { value: '--', unit }
  }

  return {
    value: formatNumber(displayValue(value, unit, includeTax), unitDecimals(unit)),
    unit,
  }
}

// Price level is always judged in c/kWh incl. VAT so the label is independent
// of the user's unit / tax display settings.
function priceLevel(centsInclVat) {
  if (centsInclVat == null || Number.isNaN(centsInclVat)) return null
  if (centsInclVat < 5) return 'veryCheap'
  if (centsInclVat < 10) return 'cheap'
  if (centsInclVat < 20) return 'normal'
  return 'expensive'
}

const LEVEL_TONE = {
  veryCheap: 'text-emerald-600',
  cheap: 'text-brand-600',
  normal: 'text-ink/60',
  expensive: 'text-rose-600',
}

function getCurrentPoint(points, now = Date.now()) {
  if (!points.length) {
    return null
  }

  return (
    [...points]
      .sort((a, b) => a.timestamp - b.timestamp)
      .reverse()
      .find((point) => point.timestamp * 1000 <= now) ?? points[0]
  )
}

function getStats(points, unit, includeTax, labels = ['Min', 'Average', 'Max']) {
  if (!points.length) {
    return [
      { label: labels[0], value: '--', detail: '--', tone: 'min' },
      { label: labels[1], value: '--', detail: '--', tone: 'avg' },
      { label: labels[2], value: '--', detail: '--', tone: 'max' },
    ]
  }

  const values = points.map((point) => ({
    ...point,
    value: displayValue(point.price, unit, includeTax),
  }))
  const low = values.reduce((best, point) =>
    point.value < best.value ? point : best,
  )
  const high = values.reduce((best, point) =>
    point.value > best.value ? point : best,
  )
  const average =
    values.reduce((sum, point) => sum + point.value, 0) / values.length
  const decimals = unitDecimals(unit)

  return [
    {
      label: labels[0],
      value: formatNumber(low.value, decimals),
      detail: tallinnTime(new Date(low.timestamp * 1000)),
      tone: 'min',
    },
    {
      label: labels[1],
      value: formatNumber(average, decimals),
      detail: unit,
      tone: 'avg',
    },
    {
      label: labels[2],
      value: formatNumber(high.value, decimals),
      detail: tallinnTime(new Date(high.timestamp * 1000)),
      tone: 'max',
    },
  ]
}

function isDayPublished(points) {
  const hours = new Set(points.map((point) => Math.floor(point.timestamp / 3600)))
  return hours.size >= 20
}

function aggregateToHourly(points) {
  const byHour = new Map()
  for (const point of points) {
    const hourTs = Math.floor(point.timestamp / 3600) * 3600
    if (!byHour.has(hourTs)) byHour.set(hourTs, [])
    byHour.get(hourTs).push(point.price)
  }
  return Array.from(byHour.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([ts, prices]) => ({
      timestamp: ts,
      price: prices.reduce((s, p) => s + p, 0) / prices.length,
    }))
}

function makeSamplePoints(prices, dayOffset = 0, regionOffset = 0) {
  const now = new Date()
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0),
  )
  start.setUTCDate(start.getUTCDate() + dayOffset)

  return prices.map((price, index) => ({
    timestamp: Math.floor(start.getTime() / 1000) + index * 60 * 60,
    price: price + regionOffset,
  }))
}

function buildFallbackData() {
  const offsets = { ee: 0, fi: -4, lv: 3, lt: 5 }
  const dayKeys = getDayKeys()

  return Object.fromEntries(
    AREAS.map((area) => [
      area.code,
      {
        today: makeSamplePoints(SAMPLE_PRICES, 0, offsets[area.key]),
        tomorrow: makeSamplePoints(TOMORROW_SAMPLE_PRICES, 1, offsets[area.key]),
        todayKey: dayKeys.today,
        tomorrowKey: dayKeys.tomorrow,
      },
    ]),
  )
}

function normalizePriceData(payload, dayKeys) {
  return Object.fromEntries(
    AREAS.map((area) => {
      const rawPoints = payload?.data?.[area.key] ?? []
      const points = rawPoints
        .filter(
          (point) =>
            typeof point.timestamp === 'number' &&
            typeof point.price === 'number',
        )
        .sort((a, b) => a.timestamp - b.timestamp)

      return [
        area.code,
        {
          today: points.filter(
            (point) =>
              tallinnDayKey(new Date(point.timestamp * 1000)) ===
              dayKeys.today,
          ),
          tomorrow: points.filter(
            (point) =>
              tallinnDayKey(new Date(point.timestamp * 1000)) ===
              dayKeys.tomorrow,
          ),
          todayKey: dayKeys.today,
          tomorrowKey: dayKeys.tomorrow,
        },
      ]
    }),
  )
}

/* ------------------------------------------------------------------ */
/* UI primitives                                                       */
/* ------------------------------------------------------------------ */

function BrandMark({ size = 40, gradientId = 'np-grad', className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className={classNames('flex-none', className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="65%" cy="35%" r="85%">
          <stop offset="0%" stopColor="#7B8FFF" />
          <stop offset="50%" stopColor="#4A5AE8" />
          <stop offset="100%" stopColor="#3040D5" />
        </radialGradient>
      </defs>
      <rect width="50" height="50" rx="12" fill={`url(#${gradientId})`} />
      <g fill="#FFF" transform="translate(15.234 7.91)">
        <g>
          <path fillOpacity="0.80" d="M15.4296875 0L0 19.6289063 8.18260051 19.6289063z" />
          <path fillOpacity="0.40" d="M0 19.6289062L15.4296875 0 4.06593117 19.6289062z" />
        </g>
        <g transform="rotate(180 9.766 17.139)">
          <path fillOpacity="0.80" d="M15.4296875 0L0 19.6289063 8.18260051 19.6289063z" />
          <path fillOpacity="0.40" d="M0 19.6289062L15.4296875 0 4.06593117 19.6289062z" />
        </g>
      </g>
    </svg>
  )
}

function Card({ className, children, as: Tag = 'div' }) {
  return (
    <Tag
      className={classNames(
        'rounded-[20px] bg-white/80 shadow-[0_10px_40px_-22px_rgba(26,31,46,.25)] ring-1 ring-ink/[.06] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

function PillGroup({ className, children }) {
  return (
    <div
      className={classNames(
        'inline-flex items-center gap-0.5 rounded-full bg-ink/[.05] p-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

function SegmentButton({ children, selected, onClick, size = 'md' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'rounded-full font-semibold transition',
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-3.5 text-sm',
        selected ? 'bg-ink text-white shadow-sm' : 'text-ink/60 hover:bg-white/70 hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

const STAT_TONE = {
  min: 'text-emerald-600',
  avg: 'text-ink',
  max: 'text-rose-600',
}

function StatTile({ label, value, detail, tone = 'avg' }) {
  return (
    <div className="rounded-2xl bg-ink/[.035] px-4 py-3">
      <p className="text-label uppercase text-ink/45">{label}</p>
      <p
        className={classNames(
          'mt-1.5 text-xl font-bold tabular-nums tracking-tight sm:text-2xl',
          STAT_TONE[tone],
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium text-ink/45">{detail}</p>
    </div>
  )
}

const LEVEL_BADGE = {
  veryCheap: 'bg-emerald-400/20 text-emerald-200 ring-emerald-300/30',
  cheap: 'bg-brand-400/25 text-brand-100 ring-brand-300/30',
  normal: 'bg-amber-400/20 text-amber-200 ring-amber-300/30',
  expensive: 'bg-rose-400/20 text-rose-200 ring-rose-300/30',
}

/* ------------------------------------------------------------------ */
/* Price chart                                                         */
/* ------------------------------------------------------------------ */

const INK = '#1A1F2E'
const LEVEL_FILL = {
  veryCheap: '#34D399',
  cheap: '#7B8FFF',
  normal: '#FBBF24',
  expensive: '#FB7185',
}

function ChartChip({ anchorX, anchorY, text, fill, bounds, textColor = '#FFFFFF' }) {
  const chipH = 24
  const chipW = Math.round(text.length * 6.6 + 22)
  const x = Math.max(bounds.left, Math.min(bounds.right - chipW, anchorX - chipW / 2))
  const y = Math.max(4, anchorY - chipH - 14)
  const pointerX = Math.max(x + 10, Math.min(x + chipW - 10, anchorX))

  return (
    <g pointerEvents="none">
      <rect x={x} y={y} width={chipW} height={chipH} rx={12} fill={fill} />
      <path
        d={`M ${pointerX - 5} ${y + chipH - 0.5} L ${pointerX + 5} ${y + chipH - 0.5} L ${pointerX} ${y + chipH + 5} Z`}
        fill={fill}
      />
      <text
        x={x + chipW / 2}
        y={y + chipH / 2 + 4.5}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={textColor}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {text}
      </text>
    </g>
  )
}

function PriceGraph({
  points,
  currentPoint,
  unit,
  includeTax,
  emptyText = 'Prices are not published yet',
  nowLabel = 'Now',
  unitLabel = 'c/kWh',
}) {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(720)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined

    const update = () => {
      const next = Math.round(el.getBoundingClientRect().width)
      if (next > 0) setWidth(next)
    }
    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const height =
    width < 640 ? Math.round(width * 0.78) : Math.round(Math.min(width * 0.5, 360))

  const chart = useMemo(() => {
    const pad = { top: 40, right: 16, bottom: 54, left: width < 640 ? 36 : 48 }
    if (!points.length) {
      return { empty: true, pad }
    }

    const values = points.map((point) => displayValue(point.price, unit, includeTax))
    const rawMin = Math.min(0, ...values)
    const rawMax = Math.max(0.01, ...values)
    const span = rawMax - rawMin
    const min = rawMin < 0 ? rawMin - span * 0.1 : 0
    const max = rawMax + span * 0.14

    const innerW = width - pad.left - pad.right
    const innerH = height - pad.top - pad.bottom
    const yFor = (value) => pad.top + ((max - value) / (max - min)) * innerH
    const y0 = yFor(0)
    const right = pad.left + innerW

    const n = points.length
    const slot = innerW / n
    const now = Date.now()
    const intervalSec = n > 1 ? points[1].timestamp - points[0].timestamp : 3600

    const nodes = points.map((point, index) => {
      const value = values[index]
      const date = new Date(point.timestamp * 1000)
      return {
        index,
        timestamp: point.timestamp,
        value,
        x: pad.left + slot * (index + 0.5),
        y: yFor(value),
        date,
        hour: tallinnHour(date),
        isHourStart: date.getUTCMinutes() === 0,
        level: priceLevel(displayValue(point.price, 'c/kWh', true)),
        isPast: (point.timestamp + intervalSec) * 1000 <= now,
      }
    })

    let line = `M ${pad.left} ${nodes[0].y} L ${nodes[0].x} ${nodes[0].y}`
    for (let i = 1; i < n; i += 1) {
      const a = nodes[i - 1]
      const b = nodes[i]
      const cx = (a.x + b.x) / 2
      line += ` C ${cx} ${a.y} ${cx} ${b.y} ${b.x} ${b.y}`
    }
    line += ` L ${right} ${nodes[n - 1].y}`
    const area = `${line} L ${right} ${y0} L ${pad.left} ${y0} Z`

    const current = currentPoint
      ? nodes.find((node) => node.timestamp === currentPoint.timestamp) ?? null
      : null
    const splitX = current ? current.x : pad.left

    const tickCount = 4
    const ticks = Array.from({ length: tickCount }, (_, i) => {
      const value = (rawMax / (tickCount - 1)) * i
      return { value, y: yFor(value) }
    })
    if (rawMin < 0) ticks.unshift({ value: rawMin, y: yFor(rawMin) })

    const step = width < 480 ? 6 : width < 760 ? 3 : 2
    const hourLabels = nodes
      .filter((node) => node.isHourStart && Number(node.hour) % step === 0)
      .map((node) => ({
        x: node.x,
        label: node.hour,
        isCurrent: current ? node.hour === current.hour : false,
      }))

    const stripY = height - pad.bottom + 14
    const strip = nodes.map((node) => ({
      x: pad.left + slot * node.index + (n > 48 ? 0.5 : 1.5),
      w: Math.max(1, slot - (n > 48 ? 1 : 3)),
      fill: LEVEL_FILL[node.level] ?? INK,
      opacity: node.isPast && current ? 0.3 : 0.95,
      key: node.timestamp,
    }))

    return {
      empty: false,
      pad,
      nodes,
      slot,
      y0,
      right,
      line,
      area,
      current,
      splitX,
      ticks,
      hourLabels,
      strip,
      stripY,
      tickDecimals: unit === 'c/kWh' ? 0 : unitDecimals(unit),
    }
  }, [currentPoint, height, includeTax, points, unit, width])

  const hoveredNode = hoveredIndex == null ? null : chart.nodes?.[hoveredIndex] ?? null

  const handlePointer = (event) => {
    if (chart.empty) return
    const rect = event.currentTarget.getBoundingClientRect()
    const xPx = ((event.clientX - rect.left) / rect.width) * width
    const index = Math.max(
      0,
      Math.min(chart.nodes.length - 1, Math.floor((xPx - chart.pad.left) / chart.slot)),
    )
    setHoveredIndex(index)
  }

  const decimals = unitDecimals(unit)
  const bounds = { left: chart.pad.left, right: width - chart.pad.right }

  return (
    <div ref={containerRef} className="w-full">
      {chart.empty ? (
        <div
          style={{ height }}
          className="grid place-items-center rounded-2xl border border-dashed border-ink/15 bg-ink/[.03] text-sm font-semibold text-ink/50"
        >
          {emptyText}
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          className="block select-none"
          style={{ touchAction: 'pan-y' }}
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
          onPointerLeave={() => setHoveredIndex(null)}
          role="img"
        >
          <defs>
            <linearGradient id="np-area-future" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B8FFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7B8FFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="np-area-past" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={INK} stopOpacity="0.12" />
              <stop offset="100%" stopColor={INK} stopOpacity="0" />
            </linearGradient>
            <clipPath id="np-clip-past">
              <rect x="0" y="0" width={Math.max(0, chart.splitX)} height={height} />
            </clipPath>
            <clipPath id="np-clip-future">
              <rect x={chart.splitX} y="0" width={Math.max(0, width - chart.splitX)} height={height} />
            </clipPath>
          </defs>

          {/* grid */}
          {chart.ticks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={chart.pad.left}
                x2={chart.right}
                y1={tick.y}
                y2={tick.y}
                stroke={INK}
                strokeOpacity={tick.value === 0 ? 0.22 : 0.08}
                strokeWidth="1"
              />
              <text
                x={chart.pad.left - 8}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="11"
                fontWeight="600"
                fill={INK}
                fillOpacity="0.45"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatNumber(tick.value, chart.tickDecimals)}
              </text>
            </g>
          ))}
          <text
            x={2}
            y={chart.pad.top - 18}
            textAnchor="start"
            fontSize="11"
            fontWeight="700"
            fill={INK}
            fillOpacity="0.45"
          >
            {unitLabel}
          </text>

          {/* area + line, split into past / future */}
          <path d={chart.area} fill="url(#np-area-past)" clipPath="url(#np-clip-past)" />
          <path d={chart.area} fill="url(#np-area-future)" clipPath="url(#np-clip-future)" />
          <path
            d={chart.line}
            fill="none"
            stroke={INK}
            strokeOpacity="0.28"
            strokeWidth="2"
            strokeLinejoin="round"
            clipPath="url(#np-clip-past)"
          />
          <path
            d={chart.line}
            fill="none"
            stroke="#4A5AE8"
            strokeWidth="2.5"
            strokeLinejoin="round"
            clipPath="url(#np-clip-future)"
          />

          {/* now marker */}
          {chart.current ? (
            <g>
              <line
                x1={chart.current.x}
                x2={chart.current.x}
                y1={chart.pad.top}
                y2={chart.y0}
                stroke="#4A5AE8"
                strokeOpacity="0.35"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              <circle cx={chart.current.x} cy={chart.current.y} r="10" fill="#5C6EF5" fillOpacity="0.22" />
              <circle cx={chart.current.x} cy={chart.current.y} r="4.5" fill="#3040D5" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          ) : null}

          {/* price-level strip */}
          {chart.strip.map((seg) => (
            <rect
              key={seg.key}
              x={seg.x}
              y={chart.stripY}
              width={seg.w}
              height="6"
              rx="2"
              fill={seg.fill}
              fillOpacity={seg.opacity}
            />
          ))}

          {/* hour labels */}
          {chart.hourLabels.map((label) => (
            <text
              key={label.x}
              x={label.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight={label.isCurrent ? '800' : '600'}
              fill={INK}
              fillOpacity={label.isCurrent ? 1 : 0.45}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {label.label}
            </text>
          ))}

          {/* hover */}
          {hoveredNode ? (
            <g>
              <line
                x1={hoveredNode.x}
                x2={hoveredNode.x}
                y1={chart.pad.top}
                y2={chart.stripY + 6}
                stroke={INK}
                strokeOpacity="0.25"
                strokeWidth="1"
              />
              <circle cx={hoveredNode.x} cy={hoveredNode.y} r="4.5" fill={INK} stroke="#FFFFFF" strokeWidth="2" />
              <ChartChip
                anchorX={hoveredNode.x}
                anchorY={hoveredNode.y}
                text={`${tallinnTime(hoveredNode.date)} · ${formatNumber(hoveredNode.value, decimals)} ${unitLabel}`}
                fill={INK}
                bounds={bounds}
              />
            </g>
          ) : chart.current ? (
            <ChartChip
              anchorX={chart.current.x}
              anchorY={chart.current.y}
              text={`${nowLabel} · ${formatNumber(chart.current.value, decimals)} ${unitLabel}`}
              fill="#3040D5"
              bounds={bounds}
            />
          ) : null}
        </svg>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

const UNITS = ['c/kWh', '€/kWh', '€/MWh']
const SETTINGS_KEY = 'nordprice:settings:v1'

function SettingsPopover({ open, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])
  if (!open) return null
  return (
    <div
      ref={ref}
      className="fixed inset-x-4 top-[76px] z-50 rounded-2xl bg-white p-5 shadow-[0_20px_50px_-20px_rgba(26,31,46,.35)] ring-1 ring-ink/[.06] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-72"
    >
      {children}
    </div>
  )
}

function SettingsSection({ label, children }) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="mb-2.5 text-label uppercase text-ink/45">{label}</p>
      {children}
    </div>
  )
}

function GearIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home({ initialData, fetchedAt, dataSource }) {
  const [region, setRegion] = useState('EE')
  const [day, setDay] = useState('today')
  const [unit, setUnit] = useState('c/kWh')
  const [includeTax, setIncludeTax] = useState(true)
  const [lang, setLang] = useState('et')
  const [intervalView, setIntervalView] = useState('15min')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const t = TRANSLATIONS[lang]
  const areaNames = AREA_NAMES[lang]
  const unitLabel = t.unitShort[unit]
  const [unitWordMain, unitWordSub] = t.unitWords[unit]

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Persist display preferences on the device (localStorage only – nothing is
  // sent to the server, so no cookie consent is required).
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        if (AREAS.some((area) => area.code === saved.region)) setRegion(saved.region)
        if (UNITS.includes(saved.unit)) setUnit(saved.unit)
        if (typeof saved.includeTax === 'boolean') setIncludeTax(saved.includeTax)
        if (saved.intervalView === '1h' || saved.intervalView === '15min') setIntervalView(saved.intervalView)
        if (saved.lang === 'et' || saved.lang === 'en') setLang(saved.lang)
      }
    } catch (error) {
      // ignore corrupt or unavailable storage
    }
    setSettingsLoaded(true)
  }, [])

  useEffect(() => {
    if (!settingsLoaded) return
    try {
      window.localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ region, unit, includeTax, intervalView, lang }),
      )
    } catch (error) {
      // storage may be unavailable (private mode, quota) – fail silently
    }
  }, [settingsLoaded, region, unit, includeTax, intervalView, lang])

  const regionData = initialData[region] ?? initialData.EE
  const todayPoints = regionData.today ?? []
  const tomorrowPoints = regionData.tomorrow ?? []
  // Nord Pool's CET trading day spills into the first hour of the Tallinn day,
  // so a single 00:00 point does not mean tomorrow has been published.
  const tomorrowPublished = isDayPublished(tomorrowPoints)
  const rawActivePoints =
    day === 'today' ? todayPoints : tomorrowPublished ? tomorrowPoints : []
  const activePoints = intervalView === '1h' ? aggregateToHourly(rawActivePoints) : rawActivePoints
  const currentPoint = getCurrentPoint(todayPoints)
  // The chart may show hourly aggregates, so resolve "now" against the same series.
  const chartCurrentPoint = getCurrentPoint(
    intervalView === '1h' ? aggregateToHourly(todayPoints) : todayPoints,
  )
  const currentPrice = formatPrice(currentPoint?.price, unit, includeTax)
  const level = priceLevel(
    currentPoint ? displayValue(currentPoint.price, 'c/kWh', true) : null,
  )
  const stats = getStats(activePoints, unit, includeTax, [t.min, t.average, t.max]).map(
    (stat) => (stat.tone === 'avg' ? { ...stat, detail: unitLabel } : stat),
  )
  const activeDayLabel = activePoints[0]
    ? tallinnDateLabel(new Date(activePoints[0].timestamp * 1000), t.dateLocale)
    : day === 'today'
    ? t.today
    : t.tomorrow
  const currentTime = currentPoint
    ? tallinnTime(new Date(currentPoint.timestamp * 1000))
    : '--:--'
  const updatedAt = fetchedAt ? tallinnTime(new Date(fetchedAt)) : '--:--'

  const regionTabs = (
    <PillGroup>
      {AREAS.map((area) => (
        <SegmentButton
          key={area.code}
          selected={region === area.code}
          onClick={() => setRegion(area.code)}
        >
          {area.code}
        </SegmentButton>
      ))}
    </PillGroup>
  )

  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDescription} />
      </Head>

      <main className="relative min-h-screen text-ink">
        <div className="ambient" aria-hidden="true">
          <div className="aurora" />
          <div className="aurora aurora--2" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <BrandMark gradientId="np-grad-header" />
              <p className="text-xl font-bold tracking-tight">NordPrice</p>
            </div>

            <div className="hidden sm:block">{regionTabs}</div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSettingsOpen((o) => !o)}
                  className={classNames(
                    'flex h-10 w-10 items-center justify-center rounded-full transition',
                    settingsOpen
                      ? 'bg-ink text-white'
                      : 'bg-ink/[.05] text-ink/70 hover:bg-ink/10 hover:text-ink',
                  )}
                  aria-label={t.settings}
                  aria-expanded={settingsOpen}
                >
                  <GearIcon className="h-5 w-5" />
                </button>
                <SettingsPopover open={settingsOpen} onClose={() => setSettingsOpen(false)}>
                  <div className="sm:hidden">
                    <SettingsSection label={t.region}>
                      <PillGroup className="flex">
                        {AREAS.map((area) => (
                          <SegmentButton
                            key={area.code}
                            selected={region === area.code}
                            onClick={() => setRegion(area.code)}
                          >
                            {area.code}
                          </SegmentButton>
                        ))}
                      </PillGroup>
                    </SettingsSection>
                  </div>
                  <SettingsSection label={t.unit}>
                    <PillGroup className="flex">
                      {UNITS.map((u) => (
                        <SegmentButton key={u} selected={unit === u} onClick={() => setUnit(u)}>
                          {u}
                        </SegmentButton>
                      ))}
                    </PillGroup>
                  </SettingsSection>
                  <SettingsSection label={t.tax}>
                    <label className="inline-flex items-center gap-2.5 text-sm font-semibold text-ink/80">
                      <input
                        type="checkbox"
                        checked={includeTax}
                        onChange={(e) => setIncludeTax(e.target.checked)}
                        className="h-4 w-4 rounded border-ink/20 text-brand-600 focus:ring-brand-500"
                      />
                      {t.vatIncluded}
                    </label>
                  </SettingsSection>
                </SettingsPopover>
              </div>

              <PillGroup>
                <SegmentButton selected={lang === 'et'} onClick={() => setLang('et')}>
                  ET
                </SegmentButton>
                <SegmentButton selected={lang === 'en'} onClick={() => setLang('en')}>
                  EN
                </SegmentButton>
              </PillGroup>
            </div>
          </header>


          {/* Dashboard */}
          <section className="mt-5 grid gap-5 lg:grid-cols-12">
            {/* Now panel */}
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-ink via-[#232B52] to-brand-900 p-6 text-white shadow-[0_30px_60px_-30px_rgba(31,42,128,.6)] ring-1 ring-white/10 sm:p-8 lg:col-span-5">
              <div className="night-glow -right-16 -top-20 h-64 w-64 bg-brand-500/50" />
              <div className="night-glow -bottom-24 left-10 h-56 w-56 bg-brand-400/30" />

              <div className="relative">
                <p className="text-label uppercase text-white/55">
                  {t.currentPrice(areaNames[region])} · {currentTime}
                </p>

                <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[72px] font-extrabold leading-none tabular-nums tracking-tight sm:text-[88px]">
                    {currentPrice.value}
                  </span>
                  <span className="text-lg font-semibold text-white/60 sm:text-xl">
                    {unitWordMain}
                    {unitWordSub}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {level ? (
                    <span
                      className={classNames(
                        'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ring-1',
                        LEVEL_BADGE[level],
                      )}
                    >
                      {t.level[level]}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1.5 text-xs font-medium text-white/50">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    {t.updatedLabel} {updatedAt}
                  </span>
                </div>

              </div>
            </div>

            {/* Chart panel */}
            <Card as="section" className="p-5 sm:p-7 lg:col-span-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{t.priceCurve}</h2>
                  <p className="mt-0.5 text-sm font-medium text-ink/50">
                    {areaNames[region]} · {activeDayLabel}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <PillGroup>
                    <SegmentButton size="sm" selected={day === 'today'} onClick={() => setDay('today')}>
                      {t.today}
                    </SegmentButton>
                    <SegmentButton size="sm" selected={day === 'tomorrow'} onClick={() => setDay('tomorrow')}>
                      {t.tomorrow}
                    </SegmentButton>
                  </PillGroup>
                  <PillGroup>
                    <SegmentButton size="sm" selected={intervalView === '1h'} onClick={() => setIntervalView('1h')}>
                      {t.interval1h}
                    </SegmentButton>
                    <SegmentButton size="sm" selected={intervalView === '15min'} onClick={() => setIntervalView('15min')}>
                      {t.interval15min}
                    </SegmentButton>
                  </PillGroup>
                </div>
              </div>

              <div className="mt-5">
                <PriceGraph
                  points={activePoints}
                  currentPoint={day === 'today' ? chartCurrentPoint : null}
                  unit={unit}
                  includeTax={includeTax}
                  emptyText={day === 'tomorrow' ? t.tomorrowAvailable : t.notPublished}
                  nowLabel={t.now}
                  unitLabel={unitLabel}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <StatTile
                    key={stat.tone}
                    label={stat.label}
                    value={stat.value}
                    detail={stat.detail}
                    tone={stat.tone}
                  />
                ))}
              </div>
            </Card>
          </section>

          {/* Footer */}
          <footer className="mt-8 mb-4 flex flex-col items-center gap-5 border-t border-ink/10 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="text-sm text-ink/55">
              <p className="font-semibold text-ink/80">NordPrice · {t.appSubtitle}</p>
              <p className="mt-0.5 text-xs">
                {dataSource === 'live' ? t.liveFromElering : t.sampleFallback} ·{' '}
                <Link href="/privacy" className="font-semibold text-ink/70 hover:text-ink">
                  {t.privacy}
                </Link>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://apple.co/3w8DNWw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lang === 'et' ? appStoreBadgeEt.src : appStoreBadgeEn.src}
                  alt="Download on the App Store"
                  style={{ height: 36, width: 'auto', display: 'block' }}
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.saarsen.elektrihind"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lang === 'et' ? googlePlayBadgeEt.src : googlePlayBadgeEn.src}
                  alt="Get it on Google Play"
                  style={{ height: 36, width: 'auto', display: 'block' }}
                />
              </a>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const dayKeys = getDayKeys()
  const now = new Date()
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 18),
  )
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 2, 22),
  )
  const url = `https://dashboard.elering.ee/api/nps/price?start=${encodeURIComponent(
    start.toISOString(),
  )}&end=${encodeURIComponent(end.toISOString())}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Elering returned ${response.status}`)
    }

    const payload = await response.json()
    const data = normalizePriceData(payload, dayKeys)
    const hasLivePoints = Object.values(data).some(
      (area) => area.today.length || area.tomorrow.length,
    )

    return {
      props: {
        initialData: hasLivePoints ? data : buildFallbackData(),
        fetchedAt: new Date().toISOString(),
        dataSource: hasLivePoints ? 'live' : 'sample',
      },
    }
  } catch (error) {
    return {
      props: {
        initialData: buildFallbackData(),
        fetchedAt: new Date().toISOString(),
        dataSource: 'sample',
      },
    }
  }
}
