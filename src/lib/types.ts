import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export type Kpi = {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};

export type Alert = {
  id: string;
  zone: string;
  time: string;
  risk: 'High' | 'Medium' | 'Low';
};

export type SosAlert = Alert;

export type Prediction = {
    id: string;
    prediction: string;
    time: string;
    zone: string;
}

export type User = {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'volunteer' | 'audience';
  assignedZones: string[];
  eventId: string;
  location: {
    lat: number;
    lng: number;
  };
  avatar: string;
  status: string;
};
