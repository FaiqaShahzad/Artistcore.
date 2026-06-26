export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Baby Frocks' | 'Shoes' | 'Caps' | 'Accessories' | string;
  description: string;
  image: string;
  featured: boolean;
  materials: string[];
  sizes: string[];
}

export interface Painting {
  id: string;
  title: string;
  price: number;
  category: 'Portraits' | 'Canvas Art' | 'Custom Paintings' | string;
  description: string;
  image: string;
  featured: boolean;
  medium: string;
  size: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Crochet' | 'Paintings' | 'Custom Orders' | 'Payment & Delivery';
}

export interface ContactInfo {
  whatsapp: string;
  instagram: string;
  tiktok: string;
  location: string;
  address: string;
  email: string;
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyText: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
}

export interface CustomOrderRequest {
  id: string;
  name: string;
  whatsapp: string;
  type: 'crochet' | 'painting';
  details: string;
  date: string;
  status: 'pending' | 'approved' | 'completed';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  date: string;
}
