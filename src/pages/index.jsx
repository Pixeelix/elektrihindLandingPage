import Head from 'next/head'
import Image from 'next/image'
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
    interval: 'Intervall',
    vatIncluded: 'KM sees',
    data: 'Andmed',
    liveFromElering: 'Otse Eleringist',
    sampleFallback: 'Näidisandmed',
    updated: (time) => `Uuendatud ${time}`,
    intervalsLoaded: (n) => `${n} intervalli laetud`,
    priceCurve: 'Hinnagraafik',
    today: 'Täna',
    tomorrow: 'Homme',
    cheapestUpcoming: 'Odavaimad eelseisvad',
    noUpcoming: 'Eelseisvaid intervalle pole.',
    notPublished: 'Hinnad pole veel avaldatud',
    lowest: 'Madalaim',
    average: 'Keskmine',
    highest: 'Kõrgeim',
    features: [
      ['Neli hinnaaset', 'Eesti, Soome, Läti ja Leedu ühes vaates.'],
      ['Täna ja homme', 'Vaheta tänaste ja avaldatud järgmise päeva hindade vahel.'],
      ['Ühiku valik', 'Võrdle turuhinda EUR/MWh või tarbijasõbralikus c/kWh.'],
    ],
    dateLocale: 'et-EE',
  },
  en: {
    interval15min: '15 min',
    interval1h: '1 hour',
    pageTitle: 'NordPrice – Nord Pool electricity prices',
    pageDescription: 'NordPrice shows live Nord Pool electricity prices for Estonia, Finland, Latvia, and Lithuania.',
    appSubtitle: 'Nord Pool electricity prices',
    currentPrice: (name) => `Current price in ${name}`,
    interval: 'Interval',
    vatIncluded: 'VAT included',
    data: 'Data',
    liveFromElering: 'Live from Elering',
    sampleFallback: 'Sample fallback',
    updated: (time) => `Updated ${time}`,
    intervalsLoaded: (n) => `${n} intervals loaded`,
    priceCurve: 'Price curve',
    today: 'Today',
    tomorrow: 'Tomorrow',
    cheapestUpcoming: 'Cheapest upcoming intervals',
    noUpcoming: 'No upcoming intervals available.',
    notPublished: 'Prices are not published yet',
    lowest: 'Lowest',
    average: 'Average',
    highest: 'Highest',
    features: [
      ['Four price areas', 'Estonia, Finland, Latvia, and Lithuania in one view.'],
      ['Today and tomorrow', 'Switch between today and published day-ahead prices.'],
      ['Unit control', 'Compare market price in EUR/MWh or consumer-friendly c/kWh.'],
    ],
    dateLocale: 'en-GB',
  },
}

const AREA_LOOKUP = Object.fromEntries(AREAS.map((area) => [area.code, area]))
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

function getStats(points, unit, includeTax, labels = ['Lowest', 'Average', 'Highest']) {
  if (!points.length) {
    return [
      { label: labels[0], value: '--', detail: '--' },
      { label: labels[1], value: '--', detail: '--' },
      { label: labels[2], value: '--', detail: '--' },
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
    },
    {
      label: labels[1],
      value: formatNumber(average, decimals),
      detail: unit,
    },
    {
      label: labels[2],
      value: formatNumber(high.value, decimals),
      detail: tallinnTime(new Date(high.timestamp * 1000)),
    },
  ]
}

function getBestUpcoming(points, unit, includeTax, now = Date.now()) {
  const decimals = unitDecimals(unit)

  return points
    .filter((point) => point.timestamp * 1000 >= now - 15 * 60 * 1000)
    .map((point) => ({
      ...point,
      value: displayValue(point.price, unit, includeTax),
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 5)
    .map((point) => ({
      time: tallinnTime(new Date(point.timestamp * 1000)),
      price: formatNumber(point.value, decimals),
    }))
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

function SegmentButton({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'h-9 rounded-md px-3 text-sm font-semibold transition',
        selected
          ? 'bg-gray-900 text-white shadow-sm'
          : 'text-gray-600 hover:bg-white hover:text-gray-900',
      )}
    >
      {children}
    </button>
  )
}

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-normal text-gray-900">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-500">{detail}</p>
    </div>
  )
}

function PriceGraph({ points, currentPoint, unit, includeTax, emptyText = 'Prices are not published yet' }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const chart = useMemo(() => {
    const width = 920
    const height = 390
    const pad = { top: 34, right: 34, bottom: 54, left: 62 }

    if (!points.length) {
      return { width, height, empty: true }
    }

    const values = points.map((point) =>
      displayValue(point.price, unit, includeTax),
    )
    let min = Math.min(...values, 0)
    let max = Math.max(...values, 0.01)
    const padding = Math.max((max - min) * 0.15, max * 0.05, 0.0001)
    min -= padding
    max += padding

    const innerWidth = width - pad.left - pad.right
    const innerHeight = height - pad.top - pad.bottom
    const xFor = (index) =>
      pad.left +
      (points.length === 1 ? 0 : (index / (points.length - 1)) * innerWidth)
    const yFor = (value) => pad.top + ((max - value) / (max - min)) * innerHeight

    const decorated = points.map((point, index) => {
      const value = values[index]
      return {
        ...point,
        index,
        value,
        x: xFor(index),
        y: yFor(value),
      }
    })

    const stepPath = decorated.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`
      }

      return `${path} H ${point.x} V ${point.y}`
    }, '')
    const zeroY = Math.max(pad.top, Math.min(height - pad.bottom, yFor(0)))
    const current = currentPoint
      ? decorated.find((point) => point.timestamp === currentPoint.timestamp)
      : null
    const low = decorated.reduce((best, point) =>
      point.value < best.value ? point : best,
    )
    const high = decorated.reduce((best, point) =>
      point.value > best.value ? point : best,
    )
    const bestWindow = low
      ? {
          x: Math.max(pad.left, low.x - innerWidth / Math.max(points.length - 1, 1) / 2),
          width: Math.max(16, innerWidth / Math.max(points.length - 1, 1)),
        }
      : null
    const ticks = Array.from({ length: 4 }, (_, index) => {
      const value = min + ((max - min) / 3) * index
      return {
        value,
        label: formatNumber(value, unitDecimals(unit)),
        y: yFor(value),
      }
    }).reverse()
    const hourLabels = [0, 6, 12, 18, 24].map((hour) => ({
      label: hour === 24 ? '24' : `${String(hour).padStart(2, '0')}:00`,
      x: pad.left + (hour / 24) * innerWidth,
    }))

    return {
      width,
      height,
      pad,
      decorated,
      stepPath,
      zeroY,
      current,
      low,
      high,
      bestWindow,
      ticks,
      hourLabels,
      pointGap: innerWidth / Math.max(points.length - 1, 1),
    }
  }, [currentPoint, includeTax, points, unit])

  const hoveredPoint =
    hoveredIndex == null ? null : chart.decorated?.[hoveredIndex] ?? null

  const handlePointerMove = (event) => {
    if (!chart.decorated?.length) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * chart.width
    const nearest = chart.decorated.reduce((best, point) =>
      Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best,
    )
    setHoveredIndex(nearest.index)
  }

  const tooltip = hoveredPoint
    ? {
        point: hoveredPoint,
        price: formatNumber(hoveredPoint.value, unitDecimals(unit)),
        unit,
        time: tallinnTime(new Date(hoveredPoint.timestamp * 1000)),
        x: Math.min(
          chart.width - chart.pad.right - 138,
          Math.max(chart.pad.left + 6, hoveredPoint.x - 69),
        ),
        y:
          hoveredPoint.y > chart.height / 2
            ? Math.max(chart.pad.top + 8, hoveredPoint.y - 70)
            : Math.min(chart.height - chart.pad.bottom - 58, hoveredPoint.y + 18),
      }
    : null

  if (chart.empty) {
    return (
      <div className="grid h-80 place-items-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm font-semibold text-gray-500">
        {emptyText}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        role="img"
        aria-label={`Price chart for ${points.length} intervals`}
        className="block h-96 w-full cursor-crosshair"
        preserveAspectRatio="none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredIndex(null)}
      >
        <rect width={chart.width} height={chart.height} fill="#ffffff" />
        <defs>
          <filter id="label-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="5"
              floodColor="#0f172a"
              floodOpacity="0.14"
            />
          </filter>
        </defs>

        {chart.bestWindow ? (
          <rect
            x={chart.bestWindow.x}
            y={chart.pad.top}
            width={chart.bestWindow.width}
            height={chart.height - chart.pad.top - chart.pad.bottom}
            fill="#dcfce7"
            opacity="0.65"
          />
        ) : null}

        {chart.current ? (
          <rect
            x={Math.max(chart.pad.left, chart.current.x - chart.pointGap / 2)}
            y={chart.pad.top}
            width={Math.max(12, chart.pointGap)}
            height={chart.height - chart.pad.top - chart.pad.bottom}
            fill="#f3f4f6"
            opacity="0.9"
          />
        ) : null}

        {chart.ticks.map((tick) => (
          <g key={tick.label}>
            <line
              x1={chart.pad.left}
              x2={chart.width - chart.pad.right}
              y1={tick.y}
              y2={tick.y}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4 7"
            />
            <text
              x={chart.pad.left - 12}
              y={tick.y + 4}
              textAnchor="end"
              fontSize="12"
              fontWeight="600"
              fill="#6b7280"
            >
              {tick.label}
            </text>
          </g>
        ))}

        <line
          x1={chart.pad.left}
          x2={chart.width - chart.pad.right}
          y1={chart.zeroY}
          y2={chart.zeroY}
          stroke="#9ca3af"
          strokeDasharray="5 7"
          strokeWidth="1"
        />

        <path
          d={chart.stepPath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.2"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        />

        {chart.current ? (
          <g>
            <line
              x1={chart.current.x}
              x2={chart.current.x}
              y1={chart.pad.top}
              y2={chart.height - chart.pad.bottom}
              stroke="#94a3b8"
              strokeWidth="1.4"
              strokeDasharray="5 6"
            />
            <circle
              cx={chart.current.x}
              cy={chart.current.y}
              r="8"
              fill="#fb7185"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <rect
              x={Math.min(chart.width - 94, Math.max(chart.pad.left, chart.current.x - 32))}
              y={Math.max(chart.pad.top + 4, chart.current.y - 42)}
              width="64"
              height="28"
              rx="5"
              fill="#ffffff"
              stroke="#e5e7eb"
              filter="url(#label-shadow)"
            />
            <text
              x={Math.min(chart.width - 62, Math.max(chart.pad.left + 32, chart.current.x))}
              y={Math.max(chart.pad.top + 23, chart.current.y - 23)}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#111827"
            >
              {tallinnTime(new Date(chart.current.timestamp * 1000))}
            </text>
          </g>
        ) : null}

        {tooltip ? (
          <g>
            <line
              x1={tooltip.point.x}
              x2={tooltip.point.x}
              y1={chart.pad.top}
              y2={chart.height - chart.pad.bottom}
              stroke="#111827"
              strokeWidth="1.4"
              strokeDasharray="4 5"
              opacity="0.65"
            />
            <circle
              cx={tooltip.point.x}
              cy={tooltip.point.y}
              r="7"
              fill="#111827"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <rect
              x={tooltip.x}
              y={tooltip.y}
              width="138"
              height="54"
              rx="7"
              fill="#ffffff"
              stroke="#e5e7eb"
              filter="url(#label-shadow)"
            />
            <text
              x={tooltip.x + 12}
              y={tooltip.y + 21}
              fontSize="14"
              fontWeight="800"
              fill="#111827"
            >
              {tooltip.time}
            </text>
            <text
              x={tooltip.x + 12}
              y={tooltip.y + 40}
              fontSize="13"
              fontWeight="700"
              fill="#4f46e5"
            >
              {tooltip.price} {tooltip.unit}
            </text>
          </g>
        ) : null}

        {chart.high ? (
          <g>
            <line
              x1={chart.high.x}
              x2={chart.high.x}
              y1={chart.high.y - 22}
              y2={chart.high.y - 8}
              stroke="#111827"
              strokeWidth="1.2"
            />
            <text
              x={Math.min(chart.width - 42, Math.max(chart.pad.left + 42, chart.high.x))}
              y={Math.max(chart.pad.top + 12, chart.high.y - 28)}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#111827"
            >
              {formatNumber(chart.high.value, unitDecimals(unit))}
            </text>
          </g>
        ) : null}

        {chart.low ? (
          <g>
            <text
              x={Math.min(chart.width - 42, Math.max(chart.pad.left + 42, chart.low.x))}
              y={Math.min(chart.height - chart.pad.bottom - 10, chart.low.y + 28)}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#111827"
            >
              {formatNumber(chart.low.value, unitDecimals(unit))}
            </text>
          </g>
        ) : null}

        {chart.hourLabels.map((label) => (
          <text
            key={label.label}
            x={label.x}
            y={chart.height - 18}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#6b7280"
          >
            {label.label}
          </text>
        ))}
      </svg>
    </div>
  )
}

const UNITS = ['c/kWh', '€/kWh', '€/MWh']

function SettingsPopover({ open, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
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
      className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-5 shadow-xl"
    >
      {children}
    </div>
  )
}

function SettingsSection({ label, children }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      {children}
    </div>
  )
}

export default function Home({ initialData, fetchedAt, dataSource }) {
  const [region, setRegion] = useState('EE')
  const [day, setDay] = useState('today')
  const [unit, setUnit] = useState('c/kWh')
  const [includeTax, setIncludeTax] = useState(false)
  const [lang, setLang] = useState('et')
  const [intervalView, setIntervalView] = useState('15min')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const t = TRANSLATIONS[lang]
  const areaNames = AREA_NAMES[lang]

  const regionData = initialData[region] ?? initialData.EE
  const todayPoints = regionData.today ?? []
  const rawActivePoints = day === 'today' ? todayPoints : regionData.tomorrow ?? []
  const activePoints = intervalView === '1h' ? aggregateToHourly(rawActivePoints) : rawActivePoints
  const currentPoint = getCurrentPoint(todayPoints)
  const currentPrice = formatPrice(currentPoint?.price, unit, includeTax)
  const stats = getStats(activePoints, unit, includeTax, [t.lowest, t.average, t.highest])
  const bestUpcoming = getBestUpcoming(activePoints, unit, includeTax)
  const activeDayLabel =
    day === 'today'
      ? activePoints[0]
        ? tallinnDateLabel(new Date(activePoints[0].timestamp * 1000), t.dateLocale)
        : t.today
      : activePoints[0]
      ? tallinnDateLabel(new Date(activePoints[0].timestamp * 1000), t.dateLocale)
      : t.tomorrow
  const currentTime = currentPoint
    ? tallinnTime(new Date(currentPoint.timestamp * 1000))
    : '--:--'
  const updatedAt = fetchedAt
    ? tallinnTime(new Date(fetchedAt), { second: '2-digit' })
    : '--:--'

  return (
    <>
      <Head>
        <title>{t.pageTitle}</title>
        <meta name="description" content={t.pageDescription} />
      </Head>

      <main className="min-h-screen bg-[#f6f7f9] text-gray-900">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between border-b border-gray-200 pb-5">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 50 50" className="flex-none">
                <defs>
                  <radialGradient id="eh-grad" cx="65%" cy="35%" r="85%">
                    <stop offset="0%" stopColor="#7B8FFF"/>
                    <stop offset="50%" stopColor="#4A5AE8"/>
                    <stop offset="100%" stopColor="#3040D5"/>
                  </radialGradient>
                </defs>
                <rect width="50" height="50" rx="10" fill="url(#eh-grad)"/>
                <g fill="#FFF" transform="translate(15.234 7.91)">
                  <g>
                    <path fillOpacity="0.80" d="M15.4296875 0L0 19.6289063 8.18260051 19.6289063z"/>
                    <path fillOpacity="0.40" d="M0 19.6289062L15.4296875 0 4.06593117 19.6289062z"/>
                  </g>
                  <g transform="rotate(180 9.766 17.139)">
                    <path fillOpacity="0.80" d="M15.4296875 0L0 19.6289063 8.18260051 19.6289063z"/>
                    <path fillOpacity="0.40" d="M0 19.6289062L15.4296875 0 4.06593117 19.6289062z"/>
                  </g>
                </g>
              </svg>
              <div>
                <p className="text-2xl font-bold tracking-normal">NordPrice</p>
                <p className="text-sm font-medium text-gray-500">{t.appSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSettingsOpen((o) => !o)}
                  className={classNames(
                    'flex h-10 w-10 items-center justify-center rounded-lg transition',
                    settingsOpen
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                  )}
                  aria-label="Seaded"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </button>
                <SettingsPopover open={settingsOpen} onClose={() => setSettingsOpen(false)}>
                  <SettingsSection label={lang === 'et' ? 'Piirkond' : 'Region'}>
                    <div className="flex rounded-lg bg-gray-100 p-1">
                      {AREAS.map((area) => (
                        <SegmentButton
                          key={area.code}
                          selected={region === area.code}
                          onClick={() => setRegion(area.code)}
                        >
                          {area.code}
                        </SegmentButton>
                      ))}
                    </div>
                  </SettingsSection>
                  <SettingsSection label={lang === 'et' ? 'Ühik' : 'Unit'}>
                    <div className="flex rounded-lg bg-gray-100 p-1">
                      {UNITS.map((u) => (
                        <SegmentButton key={u} selected={unit === u} onClick={() => setUnit(u)}>
                          {u}
                        </SegmentButton>
                      ))}
                    </div>
                  </SettingsSection>
                  <SettingsSection label={lang === 'et' ? 'Graafiku intervall' : 'Graph interval'}>
                    <div className="flex rounded-lg bg-gray-100 p-1">
                      <SegmentButton selected={intervalView === '15min'} onClick={() => setIntervalView('15min')}>
                        {t.interval15min}
                      </SegmentButton>
                      <SegmentButton selected={intervalView === '1h'} onClick={() => setIntervalView('1h')}>
                        {t.interval1h}
                      </SegmentButton>
                    </div>
                  </SettingsSection>
                  <SettingsSection label={lang === 'et' ? 'Maks' : 'Tax'}>
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={includeTax}
                        onChange={(e) => setIncludeTax(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      {t.vatIncluded}
                    </label>
                  </SettingsSection>
                </SettingsPopover>
              </div>

              <div className="flex rounded-lg bg-gray-100 p-1 ring-1 ring-inset ring-gray-200">
                <SegmentButton selected={lang === 'et'} onClick={() => setLang('et')}>ET</SegmentButton>
                <SegmentButton selected={lang === 'en'} onClick={() => setLang('en')}>EN</SegmentButton>
              </div>
            </div>
          </header>

          <section className="grid gap-5 py-6 lg:grid-cols-12">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-4">
              <p className="text-sm font-semibold text-gray-500">
                {t.currentPrice(areaNames[region])}
              </p>
              <div className="mt-4 flex items-end gap-3">
                <h1 className="text-6xl font-bold tracking-normal text-gray-900">
                  {currentPrice.value}
                </h1>
                <p className="pb-2 text-base font-bold text-gray-500">
                  {currentPrice.unit}
                </p>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-400">{currentTime}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  detail={stat.detail}
                />
              ))}
            </div>

          </section>

          <section className="grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-9">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    {areaNames[region]} · {activeDayLabel}
                  </p>
                  <h2 className="text-3xl font-bold tracking-normal">
                    {t.priceCurve}
                  </h2>
                </div>
                <div className="flex w-fit rounded-lg bg-gray-100 p-1 ring-1 ring-inset ring-gray-200">
                  <SegmentButton
                    selected={day === 'today'}
                    onClick={() => setDay('today')}
                  >
                    {t.today}
                  </SegmentButton>
                  <SegmentButton
                    selected={day === 'tomorrow'}
                    onClick={() => setDay('tomorrow')}
                  >
                    {t.tomorrow}
                  </SegmentButton>
                </div>
              </div>
              <PriceGraph
                points={activePoints}
                currentPoint={day === 'today' ? currentPoint : null}
                unit={unit}
                includeTax={includeTax}
                emptyText={t.notPublished}
              />
            </div>

            <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:col-span-3">
              <p className="text-sm font-semibold text-gray-500">
                {t.cheapestUpcoming}
              </p>
              <div className="mt-4 divide-y divide-gray-100">
                {bestUpcoming.length ? (
                  bestUpcoming.map((item) => (
                    <div
                      key={`${item.time}-${item.price}`}
                      className="flex items-center justify-between py-3"
                    >
                      <span className="font-bold text-gray-900">{item.time}</span>
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-sm font-bold text-gray-700">
                        {item.price}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-3 text-sm font-medium text-gray-500">
                    {t.noUpcoming}
                  </p>
                )}
              </div>
            </aside>
          </section>

          <section className="mt-8 flex flex-col items-center gap-4 border-t border-gray-200 pt-8 pb-4">
            <p className="text-sm font-semibold text-gray-500">
              {lang === 'et' ? 'Laadi rakendus alla' : 'Download the app'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
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
                  style={{ height: 40, width: 'auto', display: 'block' }}
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
                  style={{ height: 40, width: 'auto', display: 'block' }}
                />
              </a>
            </div>
          </section>
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
