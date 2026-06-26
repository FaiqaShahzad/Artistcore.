import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Painting, 
  Testimonial, 
  BlogPost, 
  FAQ, 
  ContactInfo, 
  HomepageContent, 
  ContactMessage, 
  CustomOrderRequest, 
  NewsletterSubscriber 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_PAINTINGS, 
  INITIAL_TESTIMONIALS, 
  INITIAL_BLOGS, 
  INITIAL_FAQS, 
  DEFAULT_CONTACT_INFO, 
  DEFAULT_HOMEPAGE_CONTENT 
} from '../data/defaultData';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type ActiveTabType = 
  | 'home' 
  | 'about' 
  | 'crochet' 
  | 'paintings' 
  | 'custom-orders' 
  | 'testimonials' 
  | 'blog' 
  | 'faq' 
  | 'contact' 
  | 'privacy' 
  | 'terms' 
  | 'admin';

interface CartItem {
  id: string; // combination of item.id and size
  item: Product | Painting;
  type: 'crochet' | 'painting';
  quantity: number;
  selectedSize?: string;
}

interface AppContextType {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  
  paintings: Painting[];
  setPaintings: React.Dispatch<React.SetStateAction<Painting[]>>;
  
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
  
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  
  homepageContent: HomepageContent;
  setHomepageContent: (content: HomepageContent) => void;
  
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteContactMessage: (id: string) => void;
  
  customOrders: CustomOrderRequest[];
  addCustomOrder: (order: Omit<CustomOrderRequest, 'id' | 'date' | 'status'>) => void;
  updateCustomOrderStatus: (id: string, status: CustomOrderRequest['status']) => void;
  deleteCustomOrder: (id: string) => void;
  
  subscribers: NewsletterSubscriber[];
  addSubscriber: (email: string) => boolean; // returns true if added, false if already exists
  deleteSubscriber: (id: string) => void;
  
  cart: CartItem[];
  addToCart: (item: Product | Painting, type: 'crochet' | 'painting', quantity?: number, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  wishlist: (Product | Painting)[];
  toggleWishlist: (item: Product | Painting) => void;
  isInWishlist: (id: string) => boolean;

  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [dbLoading, setDbLoading] = useState(true);

  // CMS Content States
  const [products, setProductsState] = useState<Product[]>([]);
  const [paintings, setPaintingsState] = useState<Painting[]>([]);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>([]);
  const [blogs, setBlogsState] = useState<BlogPost[]>([]);
  const [faqs, setFaqsState] = useState<FAQ[]>([]);
  const [contactInfo, setContactInfoState] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [homepageContent, setHomepageContentState] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);

  // Client Interactions (Messages, Custom Orders, Newsletter)
  const [contactMessages, setContactMessagesState] = useState<ContactMessage[]>([]);
  const [customOrders, setCustomOrdersState] = useState<CustomOrderRequest[]>([]);
  const [subscribers, setSubscribersState] = useState<NewsletterSubscriber[]>([]);

  // Shopping Cart State (Local to device)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('art_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State (Local to device)
  const [wishlist, setWishlist] = useState<(Product | Painting)[]>(() => {
    const saved = localStorage.getItem('art_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminAuth, setIsAdminAuth] = useState(false);

  // Monitor Firebase Auth State to safely start admin snapshot listeners
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.trim().toLowerCase() === 'faiqashahzad269@gmail.com') {
        setIsAdminAuth(true);
      } else {
        setIsAdminAuth(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // Setup PUBLIC Firestore seeding and real-time synchronization
  useEffect(() => {
    let active = true;

    const seedAndListenPublic = async () => {
      try {
        // Seed Products if empty
        try {
          const productsCol = collection(db, 'products');
          const productsSnapshot = await getDocs(productsCol);
          if (active && productsSnapshot.empty) {
            for (const item of INITIAL_PRODUCTS) {
              await setDoc(doc(db, 'products', item.id), item);
            }
          }
        } catch (e) {
          // Ignore seeding/check permission issues during public loads
        }

        // Seed Paintings if empty
        try {
          const paintingsCol = collection(db, 'paintings');
          const paintingsSnapshot = await getDocs(paintingsCol);
          if (active && paintingsSnapshot.empty) {
            for (const item of INITIAL_PAINTINGS) {
              await setDoc(doc(db, 'paintings', item.id), item);
            }
          }
        } catch (e) {
          // Ignore
        }

        // Seed Testimonials if empty
        try {
          const testimonialsCol = collection(db, 'testimonials');
          const testimonialsSnapshot = await getDocs(testimonialsCol);
          if (active && testimonialsSnapshot.empty) {
            for (const item of INITIAL_TESTIMONIALS) {
              await setDoc(doc(db, 'testimonials', item.id), item);
            }
          }
        } catch (e) {
          // Ignore
        }

        // Seed Blogs if empty
        try {
          const blogsCol = collection(db, 'blogs');
          const blogsSnapshot = await getDocs(blogsCol);
          if (active && blogsSnapshot.empty) {
            for (const item of INITIAL_BLOGS) {
              await setDoc(doc(db, 'blogs', item.id), item);
            }
          }
        } catch (e) {
          // Ignore
        }

        // Seed FAQs if empty
        try {
          const faqsCol = collection(db, 'faqs');
          const faqsSnapshot = await getDocs(faqsCol);
          if (active && faqsSnapshot.empty) {
            for (const item of INITIAL_FAQS) {
              await setDoc(doc(db, 'faqs', item.id), item);
            }
          }
        } catch (e) {
          // Ignore
        }

        // Seed Settings if empty
        try {
          const settingsCol = collection(db, 'settings');
          const settingsSnapshot = await getDocs(settingsCol);
          if (active && settingsSnapshot.empty) {
            await setDoc(doc(db, 'settings', 'contact_info'), DEFAULT_CONTACT_INFO);
            await setDoc(doc(db, 'settings', 'homepage_content'), DEFAULT_HOMEPAGE_CONTENT);
          }
        } catch (e) {
          // Ignore
        }
      } catch (err) {
        console.error("Public seeding check error: ", err);
      }

      if (active) {
        setDbLoading(false);
      }
    };

    seedAndListenPublic();

    // Start Public Snapshot Listeners
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach(docSnap => items.push(docSnap.data() as Product));
      setProductsState(items);
    });

    const unsubPaintings = onSnapshot(collection(db, 'paintings'), (snapshot) => {
      const items: Painting[] = [];
      snapshot.forEach(docSnap => items.push(docSnap.data() as Painting));
      setPaintingsState(items);
    });

    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const items: Testimonial[] = [];
      snapshot.forEach(docSnap => items.push(docSnap.data() as Testimonial));
      setTestimonialsState(items);
    });

    const unsubBlogs = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      const items: BlogPost[] = [];
      snapshot.forEach(docSnap => items.push(docSnap.data() as BlogPost));
      setBlogsState(items);
    });

    const unsubFaqs = onSnapshot(collection(db, 'faqs'), (snapshot) => {
      const items: FAQ[] = [];
      snapshot.forEach(docSnap => items.push(docSnap.data() as FAQ));
      setFaqsState(items);
    });

    const unsubContactInfo = onSnapshot(doc(db, 'settings', 'contact_info'), (docSnap) => {
      if (docSnap.exists()) {
        setContactInfoState(docSnap.data() as ContactInfo);
      }
    });

    const unsubHomepageContent = onSnapshot(doc(db, 'settings', 'homepage_content'), (docSnap) => {
      if (docSnap.exists()) {
        setHomepageContentState(docSnap.data() as HomepageContent);
      }
    });

    return () => {
      active = false;
      unsubProducts();
      unsubPaintings();
      unsubTestimonials();
      unsubBlogs();
      unsubFaqs();
      unsubContactInfo();
      unsubHomepageContent();
    };
  }, []);

  // Setup ADMIN Firestore seeding and real-time synchronization
  useEffect(() => {
    if (!isAdminAuth) {
      setContactMessagesState([]);
      setCustomOrdersState([]);
      setSubscribersState([]);
      return;
    }

    let active = true;

    const seedAndListenAdmin = async () => {
      try {
        // Seed Contact Messages if empty
        const messagesCol = collection(db, 'contact_messages');
        const messagesSnapshot = await getDocs(messagesCol);
        if (active && messagesSnapshot.empty) {
          const initialMessages = [
            {
              id: 'msg-1',
              name: 'Fatima Shah',
              email: 'fatima.shah@gmail.com',
              subject: 'Inquiry regarding custom crochet dress size',
              message: 'Hello, I loved the Rosette baby frock! My baby is 9 months old but quite tall, should I order the 6-12 months size or can you customize the length to 18 inches? Please let me know, thank you!',
              date: '2026-06-23T14:20:00Z',
              status: 'unread'
            },
            {
              id: 'msg-2',
              name: 'Zayn Malik',
              email: 'zayn.malik@outlook.com',
              subject: 'Portrait commission price quote',
              message: 'Hi Artistcore! I want to commission an oil portrait of my grandparents for their golden anniversary. It would be a 24x30 inch stretched canvas from a vintage photograph. Could you provide a estimated timeline and shipping cost to Islamabad?',
              date: '2026-06-24T09:15:00Z',
              status: 'read'
            }
          ];
          for (const m of initialMessages) {
            await setDoc(doc(db, 'contact_messages', m.id), m);
          }
        }

        // Seed Custom Orders if empty
        const ordersCol = collection(db, 'custom_orders');
        const ordersSnapshot = await getDocs(ordersCol);
        if (active && ordersSnapshot.empty) {
          const initialOrders = [
            {
              id: 'order-1',
              name: 'Hina Javed',
              whatsapp: '0300-1234567',
              type: 'crochet',
              details: 'Custom Baby Frock in Pastel Mint Green with matching booties and cap. Size: 3-6 Months.',
              date: '2026-06-22T11:00:00Z',
              status: 'approved'
            },
            {
              id: 'order-2',
              name: 'Imran Alvi',
              whatsapp: '0321-9876543',
              type: 'painting',
              details: 'Custom 16x20 abstract canvas painting using gold leaf, teal, and beige acrylic colors.',
              date: '2026-06-25T08:30:00Z',
              status: 'pending'
            }
          ];
          for (const o of initialOrders) {
            await setDoc(doc(db, 'custom_orders', o.id), o);
          }
        }

        // Seed Subscribers if empty
        const subsCol = collection(db, 'subscribers');
        const subsSnapshot = await getDocs(subsCol);
        if (active && subsSnapshot.empty) {
          const initialSubs = [
            { id: 'sub-1', email: 'aisha.design@yahoo.com', date: '2026-06-15T18:00:00Z' },
            { id: 'sub-2', email: 'sarmad_art@outlook.com', date: '2026-06-19T10:30:00Z' }
          ];
          for (const s of initialSubs) {
            await setDoc(doc(db, 'subscribers', s.id), s);
          }
        }
      } catch (err) {
        console.error("Admin seeding check error: ", err);
      }
    };

    seedAndListenAdmin();

    const unsubMessages = onSnapshot(collection(db, 'contact_messages'), (snapshot) => {
      const items: ContactMessage[] = [];
      snapshot.forEach(docSnap => items.push(docSnap.data() as ContactMessage));
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setContactMessagesState(items);
    });

    const unsubOrders = onSnapshot(collection(db, 'custom_orders'), (snapshot) => {
      const items: CustomOrderRequest[] = [];
      snapshot.forEach(docSnap => items.push(docSnap.data() as CustomOrderRequest));
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCustomOrdersState(items);
    });

    const unsubSubscribers = onSnapshot(collection(db, 'subscribers'), (snapshot) => {
      const items: NewsletterSubscriber[] = [];
      snapshot.forEach(docSnap => items.push(docSnap.data() as NewsletterSubscriber));
      setSubscribersState(items);
    });

    return () => {
      active = false;
      unsubMessages();
      unsubOrders();
      unsubSubscribers();
    };
  }, [isAdminAuth]);

  // Sync cart & wishlist locally
  useEffect(() => {
    localStorage.setItem('art_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('art_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Firestore-backed state setter replacements
  const setProducts: React.Dispatch<React.SetStateAction<Product[]>> = async (value) => {
    const newProducts = typeof value === 'function' ? (value as Function)(products) : value;
    const newIds = new Set(newProducts.map((p: any) => p.id));
    const toDelete = products.filter(p => !newIds.has(p.id));
    for (const item of toDelete) {
      await deleteDoc(doc(db, 'products', item.id));
    }
    for (const item of newProducts) {
      await setDoc(doc(db, 'products', item.id), item);
    }
  };

  const setPaintings: React.Dispatch<React.SetStateAction<Painting[]>> = async (value) => {
    const newPaintings = typeof value === 'function' ? (value as Function)(paintings) : value;
    const newIds = new Set(newPaintings.map((p: any) => p.id));
    const toDelete = paintings.filter(p => !newIds.has(p.id));
    for (const item of toDelete) {
      await deleteDoc(doc(db, 'paintings', item.id));
    }
    for (const item of newPaintings) {
      await setDoc(doc(db, 'paintings', item.id), item);
    }
  };

  const setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>> = async (value) => {
    const newTestimonials = typeof value === 'function' ? (value as Function)(testimonials) : value;
    const newIds = new Set(newTestimonials.map((t: any) => t.id));
    const toDelete = testimonials.filter(t => !newIds.has(t.id));
    for (const item of toDelete) {
      await deleteDoc(doc(db, 'testimonials', item.id));
    }
    for (const item of newTestimonials) {
      await setDoc(doc(db, 'testimonials', item.id), item);
    }
  };

  const setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>> = async (value) => {
    const newBlogs = typeof value === 'function' ? (value as Function)(blogs) : value;
    const newIds = new Set(newBlogs.map((b: any) => b.id));
    const toDelete = blogs.filter(b => !newIds.has(b.id));
    for (const item of toDelete) {
      await deleteDoc(doc(db, 'blogs', item.id));
    }
    for (const item of newBlogs) {
      await setDoc(doc(db, 'blogs', item.id), item);
    }
  };

  const setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>> = async (value) => {
    const newFaqs = typeof value === 'function' ? (value as Function)(faqs) : value;
    const newIds = new Set(newFaqs.map((f: any) => f.id));
    const toDelete = faqs.filter(f => !newIds.has(f.id));
    for (const item of toDelete) {
      await deleteDoc(doc(db, 'faqs', item.id));
    }
    for (const item of newFaqs) {
      await setDoc(doc(db, 'faqs', item.id), item);
    }
  };

  const setContactInfo = async (info: ContactInfo) => {
    await setDoc(doc(db, 'settings', 'contact_info'), info);
  };

  const setHomepageContent = async (content: HomepageContent) => {
    await setDoc(doc(db, 'settings', 'homepage_content'), content);
  };

  // Client messaging and interactive elements
  const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newId = `msg-${Date.now()}`;
    const newMessage: ContactMessage = {
      ...msg,
      id: newId,
      date: new Date().toISOString(),
      status: 'unread'
    };
    await setDoc(doc(db, 'contact_messages', newId), newMessage);
  };

  const updateContactMessageStatus = async (id: string, status: ContactMessage['status']) => {
    await updateDoc(doc(db, 'contact_messages', id), { status });
  };

  const deleteContactMessage = async (id: string) => {
    await deleteDoc(doc(db, 'contact_messages', id));
  };

  const addCustomOrder = async (order: Omit<CustomOrderRequest, 'id' | 'date' | 'status'>) => {
    const newId = `order-${Date.now()}`;
    const newOrder: CustomOrderRequest = {
      ...order,
      id: newId,
      date: new Date().toISOString(),
      status: 'pending'
    };
    await setDoc(doc(db, 'custom_orders', newId), newOrder);
  };

  const updateCustomOrderStatus = async (id: string, status: CustomOrderRequest['status']) => {
    await updateDoc(doc(db, 'custom_orders', id), { status });
  };

  const deleteCustomOrder = async (id: string) => {
    await deleteDoc(doc(db, 'custom_orders', id));
  };

  const addSubscriber = (email: string): boolean => {
    const formattedEmail = email.trim().toLowerCase();
    const exists = subscribers.some(s => s.email.toLowerCase() === formattedEmail);
    if (exists) return false;

    const newId = `sub-${Date.now()}`;
    const newSub: NewsletterSubscriber = {
      id: newId,
      email: formattedEmail,
      date: new Date().toISOString()
    };
    setDoc(doc(db, 'subscribers', newId), newSub);
    return true;
  };

  const deleteSubscriber = async (id: string) => {
    await deleteDoc(doc(db, 'subscribers', id));
  };

  // Cart actions
  const addToCart = (item: Product | Painting, type: 'crochet' | 'painting', quantity: number = 1, size?: string) => {
    const cartItemId = size ? `${item.id}-${size}` : item.id;
    setCart(prev => {
      const existing = prev.find(i => i.id === cartItemId);
      if (existing) {
        return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { id: cartItemId, item, type, quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === cartItemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, current) => acc + (current.item.price * current.quantity), 0);
  const cartCount = cart.reduce((acc, current) => acc + current.quantity, 0);

  // Wishlist actions
  const toggleWishlist = (item: Product | Painting) => {
    setWishlist(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const isInWishlist = (id: string) => wishlist.some(i => i.id === id);

  // Reset database back to default initial values in Firestore
  const resetDatabase = async () => {
    if (window.confirm('Are you sure you want to restore the entire website and CMS to its initial default state? All remote updates will be reset.')) {
      setDbLoading(true);
      try {
        const prodDocs = await getDocs(collection(db, 'products'));
        for (const d of prodDocs.docs) {
          await deleteDoc(doc(db, 'products', d.id));
        }
        for (const item of INITIAL_PRODUCTS) {
          await setDoc(doc(db, 'products', item.id), item);
        }

        const paintDocs = await getDocs(collection(db, 'paintings'));
        for (const d of paintDocs.docs) {
          await deleteDoc(doc(db, 'paintings', d.id));
        }
        for (const item of INITIAL_PAINTINGS) {
          await setDoc(doc(db, 'paintings', item.id), item);
        }

        const blogDocs = await getDocs(collection(db, 'blogs'));
        for (const d of blogDocs.docs) {
          await deleteDoc(doc(db, 'blogs', d.id));
        }
        for (const item of INITIAL_BLOGS) {
          await setDoc(doc(db, 'blogs', item.id), item);
        }

        const faqDocs = await getDocs(collection(db, 'faqs'));
        for (const d of faqDocs.docs) {
          await deleteDoc(doc(db, 'faqs', d.id));
        }
        for (const item of INITIAL_FAQS) {
          await setDoc(doc(db, 'faqs', item.id), item);
        }

        await setDoc(doc(db, 'settings', 'contact_info'), DEFAULT_CONTACT_INFO);
        await setDoc(doc(db, 'settings', 'homepage_content'), DEFAULT_HOMEPAGE_CONTENT);

        setCart([]);
        setWishlist([]);
        setActiveTab('home');
        alert('Database successfully restored in cloud!');
      } catch (err) {
        console.error(err);
        alert('Reset failed.');
      } finally {
        setDbLoading(false);
      }
    }
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      products,
      setProducts,
      paintings,
      setPaintings,
      testimonials,
      setTestimonials,
      blogs,
      setBlogs,
      faqs,
      setFaqs,
      contactInfo,
      setContactInfo,
      homepageContent,
      setHomepageContent,
      contactMessages,
      addContactMessage,
      updateContactMessageStatus,
      deleteContactMessage,
      customOrders,
      addCustomOrder,
      updateCustomOrderStatus,
      deleteCustomOrder,
      subscribers,
      addSubscriber,
      deleteSubscriber,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      resetDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
