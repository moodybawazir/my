
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'disabled';
  registrationDate: string;
  balance: number;
  usedFreeService: boolean;
  subscriptionCompleted: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  planName: string;
  status: 'active' | 'trial' | 'expired';
  price: number;
  daysLeft: number;
  startDate: string;
  endDate: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
}

export interface Invoice {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  category: string;
  desc: string;
  image: string;
  icon: string;
}

export interface ServiceModule {
  id: string;
  title: string;
  desc: string;
  icon: string;
  price: string;
  category: string;
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl?: string;
}
