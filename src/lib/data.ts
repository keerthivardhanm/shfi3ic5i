import type { Kpi, SosAlert, Prediction } from './types'
import { Users, AlertTriangle, Siren, TrendingUp } from 'lucide-react'

export const kpiData: Kpi[] = [
  {
    title: 'Total Attendance',
    value: '12,482',
    change: '+12.5%',
    changeType: 'increase',
    icon: Users,
  },
  {
    title: 'Active SOS Alerts',
    value: '3',
    change: '+200%',
    changeType: 'increase',
    icon: Siren,
  },
  {
    title: 'High-Risk Zones',
    value: '2',
    change: '-33.3%',
    changeType: 'decrease',
    icon: AlertTriangle,
  },
  {
    title: 'Avg. Response Time',
    value: '3.2 min',
    change: '+5.2%',
    changeType: 'increase',
    icon: TrendingUp,
  },
]

export const sosAlertsData: SosAlert[] = [
  {
    id: '1',
    zone: 'Zone A-3',
    time: '2 minutes ago',
    risk: 'High',
  },
  {
    id: '2',
    zone: 'Zone C-1',
    time: '5 minutes ago',
    risk: 'Medium',
  },
  {
    id: '3',
    zone: 'Sector B-8',
    time: '12 minutes ago',
    risk: 'Low',
  },
]

export const aiPredictionsData: Prediction[] = [
    {
        id: '1',
        prediction: 'Overcrowding likely',
        time: '15',
        zone: 'B-2',
    },
    {
        id: '2',
        prediction: 'Potential bottleneck',
        time: '25',
        zone: 'Exit 4',
    },
]

export const densityChartData = [
  { time: '17:00', density: 2.1 },
  { time: '17:10', density: 2.5 },
  { time: '17:20', density: 2.8 },
  { time: '17:30', density: 3.5 },
  { time: '17:40', density: 3.2 },
  { time: '17:50', density: 3.8 },
  { time: '18:00', density: 4.1 },
]

export const sosChartData = [
  { zone: 'A', incidents: 5 },
  { zone: 'B', incidents: 8 },
  { zone: 'C', incidents: 12 },
  { zone: 'D', incidents: 3 },
  { zone: 'E', incidents: 7 },
]
