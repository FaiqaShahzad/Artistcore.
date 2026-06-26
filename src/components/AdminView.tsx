import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Painting, BlogPost, FAQ, Testimonial } from '../types';
import { 
  Database, Plus, Edit, Trash2, Check, RefreshCw, Mail, 
  MessageSquare, FileText, Settings, Heart, HelpCircle, UserCheck 
} from 'lucide-react';

type AdminTab = 
  | 'products' 
  | 'paintings' 
  | 'messages' 
  | 'bookings' 
  | 'website-content' 
  | 'faq-blog' 
  | 'subscribers';

export const AdminView: React.FC = () => {
  const {
    products, setProducts,
    paintings, setPaintings,
    testimonials, setTestimonials,
    blogs, setBlogs,
    faqs, setFaqs,
    contactInfo, setContactInfo,
    homepageContent, setHomepageContent,
    contactMessages, updateContactMessageStatus, deleteContactMessage,
    customOrders, updateCustomOrderStatus, deleteCustomOrder,
    subscribers, deleteSubscriber,
    resetDatabase
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('products');

  // Admin Login States
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('is_admin_authenticated');
    const savedEmail = localStorage.getItem('admin_email');
    const loginTime = localStorage.getItem('admin_login_time');
    
    // Auto-login stays active for 30 days
    if (saved === 'true' && savedEmail === 'faiqashahzad269@gmail.com' && loginTime) {
      const parsedTime = Number(loginTime);
      const daysPassed = (Date.now() - parsedTime) / (1000 * 60 * 60 * 24);
      if (daysPassed < 30) {
        return true;
      }
    }
    return false;
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

  // Handle redirect login result on mount (crucial for mobile phones)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const { getRedirectResult } = await import('firebase/auth');
        const { auth } = await import('../lib/firebase');
        
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const user = result.user;
          if (user.email?.trim().toLowerCase() === 'faiqashahzad269@gmail.com') {
            setIsAuthenticated(true);
            localStorage.setItem('is_admin_authenticated', 'true');
            localStorage.setItem('admin_email', 'faiqashahzad269@gmail.com');
            localStorage.setItem('admin_login_time', Date.now().toString());
          } else {
            setLoginError('Access Denied. Only the registered creator can access this Admin Panel.');
            await auth.signOut();
          }
        }
      } catch (err: any) {
        console.error('Redirect result handle error:', err);
        if (err.code && err.code !== 'auth/api-key-not-valid' && err.code !== 'auth/no-current-user') {
          setLoginError('Google Sign-In failed: ' + (err.message || err.code));
        }
      }
    };

    handleRedirectResult();
  }, []);

  // Listen to Auth State changes to automatically authenticate admin if logged in (perfect for mobile/tab switches)
  useEffect(() => {
    let unsubscribe = () => {};
    const setupAuthListener = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('../lib/firebase');
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user && user.email?.trim().toLowerCase() === 'faiqashahzad269@gmail.com') {
            setIsAuthenticated(true);
            localStorage.setItem('is_admin_authenticated', 'true');
            localStorage.setItem('admin_email', 'faiqashahzad269@gmail.com');
            localStorage.setItem('admin_login_time', Date.now().toString());
          }
        });
      } catch (err) {
        console.error('Error setting up admin auth listener:', err);
      }
    };
    setupAuthListener();
    return () => unsubscribe();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsVerifying(true);

    try {
      const emailFormatted = loginEmail.trim().toLowerCase();
      if (emailFormatted !== 'faiqashahzad269@gmail.com') {
        setLoginError('Access Denied. Only the registered creator can access this Admin Panel.');
        setIsVerifying(false);
        return;
      }

      // Check password from Firestore settings/admin_credentials
      const { getDoc, doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const credDocRef = doc(db, 'settings', 'admin_credentials');
      const credSnap = await getDoc(credDocRef);

      let targetPassword = 'FaiqaArt2026!'; // default secure password
      if (credSnap.exists()) {
        targetPassword = credSnap.data().password;
      } else {
        // Initialize the password in Firestore
        await setDoc(credDocRef, { password: targetPassword });
      }

      if (loginPassword === targetPassword) {
        // Authenticate in Firebase Auth so that Firestore rules accept writes
        try {
          const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
          const { auth } = await import('../lib/firebase');
          try {
            await signInWithEmailAndPassword(auth, 'faiqashahzad269@gmail.com', loginPassword);
          } catch (authErr: any) {
            if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential' || authErr.code === 'auth/wrong-password') {
              try {
                // Register user in Firebase Auth with the configured password if not registered yet
                await createUserWithEmailAndPassword(auth, 'faiqashahzad269@gmail.com', loginPassword);
              } catch (createErr) {
                console.warn('Firebase Auth email/password registration failed. If password auth is disabled, please use Continue with Google instead:', createErr);
              }
            } else {
              console.warn('Firebase Auth email/password sign-in failed:', authErr);
            }
          }
        } catch (importErr) {
          console.error('Error importing firebase/auth:', importErr);
        }

        setIsAuthenticated(true);
        localStorage.setItem('is_admin_authenticated', 'true');
        localStorage.setItem('admin_email', 'faiqashahzad269@gmail.com');
        localStorage.setItem('admin_login_time', Date.now().toString());
      } else {
        setLoginError('Invalid Administrator Password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Connection failed. Please check your network and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    setIsVerifying(true);
    try {
      const { signInWithPopup, signInWithRedirect, GoogleAuthProvider } = await import('firebase/auth');
      const { auth } = await import('../lib/firebase');
      const provider = new GoogleAuthProvider();
      
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIframe = window.self !== window.top;

      if (isMobile || isIframe) {
        // Safe redirect login for mobile / iframe preview contexts where popups are blocked/unsupported
        await signInWithRedirect(auth, provider);
      } else {
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          if (user && user.email?.trim().toLowerCase() === 'faiqashahzad269@gmail.com') {
            setIsAuthenticated(true);
            localStorage.setItem('is_admin_authenticated', 'true');
            localStorage.setItem('admin_email', 'faiqashahzad269@gmail.com');
            localStorage.setItem('admin_login_time', Date.now().toString());
          } else {
            setLoginError('Access Denied. Only the registered creator can access this Admin Panel.');
            await auth.signOut();
          }
        } catch (popupErr: any) {
          console.warn('Google Sign-In popup failed or was blocked, trying redirect instead:', popupErr);
          if (popupErr.code === 'auth/popup-blocked' || popupErr.code === 'auth/cancelled-popup-request') {
            await signInWithRedirect(auth, provider);
          } else {
            throw popupErr;
          }
        }
      }
    } catch (err) {
      console.error(err);
      setLoginError('Google Authentication failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_admin_authenticated');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_login_time');
    try {
      const { auth } = await import('../lib/firebase');
      await auth.signOut();
    } catch (err) {
      console.error('Error signing out from auth provider: ', err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    setChangePasswordSuccess('');

    if (!newAdminPassword || newAdminPassword.length < 6) {
      setChangePasswordError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await setDoc(doc(db, 'settings', 'admin_credentials'), { password: newAdminPassword });
      setChangePasswordSuccess('Admin password updated successfully! Please use your new password next time.');
      setNewAdminPassword('');
    } catch (err) {
      console.error(err);
      setChangePasswordError('Failed to update password. Try again.');
    }
  };

  // Modal / Form States
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productCategory, setProductCategory] = useState('Baby Frocks');
  const [productImage, setProductImage] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMaterials, setProductMaterials] = useState('');
  const [productSizes, setProductSizes] = useState('');
  const [productFeatured, setProductFeatured] = useState(false);

  const [paintingFormOpen, setPaintingFormOpen] = useState(false);
  const [editingPaintingId, setEditingPaintingId] = useState<string | null>(null);
  const [paintingTitle, setPaintingTitle] = useState('');
  const [paintingPrice, setPaintingPrice] = useState(0);
  const [paintingCategory, setPaintingCategory] = useState('Portraits');
  const [paintingImage, setPaintingImage] = useState('');
  const [paintingDescription, setPaintingDescription] = useState('');
  const [paintingMedium, setPaintingMedium] = useState('');
  const [paintingSize, setPaintingSize] = useState('');
  const [paintingFeatured, setPaintingFeatured] = useState(false);

  // FAQ Form States
  const [faqFormOpen, setFaqFormOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState<'General' | 'Crochet' | 'Paintings' | 'Custom Orders' | 'Payment & Delivery'>('General');

  // Blog Form States
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('');

  // Homepage Edit States
  const [editHeroTitle, setEditHeroTitle] = useState(homepageContent.heroTitle);
  const [editHeroSubtitle, setEditHeroSubtitle] = useState(homepageContent.heroSubtitle);
  const [editStoryTitle, setEditStoryTitle] = useState(homepageContent.storyTitle);
  const [editStoryText, setEditStoryText] = useState(homepageContent.storyText);

  // Contact Info States
  const [editWhatsapp, setEditWhatsapp] = useState(contactInfo.whatsapp);
  const [editInstagram, setEditInstagram] = useState(contactInfo.instagram);
  const [editTiktok, setEditTiktok] = useState(contactInfo.tiktok);
  const [editLocation, setEditLocation] = useState(contactInfo.location);
  const [editAddress, setEditAddress] = useState(contactInfo.address);
  const [editEmail, setEditEmail] = useState(contactInfo.email);

  // Action: Save Homepage and Contact content
  const handleSaveWebsiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    setHomepageContent({
      heroTitle: editHeroTitle,
      heroSubtitle: editHeroSubtitle,
      storyTitle: editStoryTitle,
      storyText: editStoryText
    });
    setContactInfo({
      whatsapp: editWhatsapp,
      instagram: editInstagram,
      tiktok: editTiktok,
      location: editLocation,
      address: editAddress,
      email: editEmail
    });
    alert('Website CMS Content saved successfully and updated live on all pages!');
  };

  // Action: Add / Edit Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || productPrice <= 0) {
      alert('Please enter a valid product name and price.');
      return;
    }

    const sizesArray = productSizes.split(',').map(s => s.trim()).filter(Boolean);
    const materialsArray = productMaterials.split(',').map(m => m.trim()).filter(Boolean);
    const defaultImg = productImage || 'https://picsum.photos/seed/crochet/600/600';

    if (editingProductId) {
      // Edit
      setProducts(prev => prev.map(p => p.id === editingProductId ? {
        ...p,
        name: productName,
        price: Number(productPrice),
        category: productCategory,
        image: defaultImg,
        description: productDescription,
        materials: materialsArray.length ? materialsArray : ['Premium fibers'],
        sizes: sizesArray.length ? sizesArray : ['One size'],
        featured: productFeatured
      } : p));
      setEditingProductId(null);
    } else {
      // Create
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productName,
        price: Number(productPrice),
        category: productCategory,
        image: defaultImg,
        description: productDescription || 'Handcrafted meticulously in Lahore.',
        materials: materialsArray.length ? materialsArray : ['Premium fibers'],
        sizes: sizesArray.length ? sizesArray : ['One size'],
        featured: productFeatured
      };
      setProducts(prev => [newProduct, ...prev]);
    }

    // Reset Form
    setProductName('');
    setProductPrice(0);
    setProductImage('');
    setProductDescription('');
    setProductMaterials('');
    setProductSizes('');
    setProductFeatured(false);
    setProductFormOpen(false);
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setProductName(p.name);
    setProductPrice(p.price);
    setProductCategory(p.category);
    setProductImage(p.image);
    setProductDescription(p.description);
    setProductMaterials(p.materials.join(', '));
    setProductSizes(p.sizes.join(', '));
    setProductFeatured(p.featured);
    setProductFormOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Delete this crochet item from your boutique registry?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Action: Add / Edit Painting
  const handleSavePainting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paintingTitle || paintingPrice <= 0) {
      alert('Please enter a valid painting title and price.');
      return;
    }

    const defaultImg = paintingImage || 'https://picsum.photos/seed/painting/600/600';

    if (editingPaintingId) {
      // Edit
      setPaintings(prev => prev.map(p => p.id === editingPaintingId ? {
        ...p,
        title: paintingTitle,
        price: Number(paintingPrice),
        category: paintingCategory,
        image: defaultImg,
        description: paintingDescription,
        medium: paintingMedium || 'Oil on Canvas',
        size: paintingSize || '18x24 inches',
        featured: paintingFeatured
      } : p));
      setEditingPaintingId(null);
    } else {
      // Create
      const newPainting: Painting = {
        id: `paint-${Date.now()}`,
        title: paintingTitle,
        price: Number(paintingPrice),
        category: paintingCategory,
        image: defaultImg,
        description: paintingDescription || 'Masterfully hand-painted original oil study.',
        medium: paintingMedium || 'Oil on Canvas',
        size: paintingSize || '18x24 inches',
        featured: paintingFeatured
      };
      setPaintings(prev => [newPainting, ...prev]);
    }

    // Reset Form
    setPaintingTitle('');
    setPaintingPrice(0);
    setPaintingImage('');
    setPaintingDescription('');
    setPaintingMedium('');
    setPaintingSize('');
    setPaintingFeatured(false);
    setPaintingFormOpen(false);
  };

  const handleEditPaintingClick = (p: Painting) => {
    setEditingPaintingId(p.id);
    setPaintingTitle(p.title);
    setPaintingPrice(p.price);
    setPaintingCategory(p.category);
    setPaintingImage(p.image);
    setPaintingDescription(p.description);
    setPaintingMedium(p.medium);
    setPaintingSize(p.size);
    setPaintingFeatured(p.featured);
    setPaintingFormOpen(true);
  };

  const handleDeletePainting = (id: string) => {
    if (window.confirm('Remove this fine art masterpiece from your gallery registry?')) {
      setPaintings(prev => prev.filter(p => p.id !== id));
    }
  };

  // FAQ CRUD
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;

    if (editingFaqId) {
      setFaqs(prev => prev.map(f => f.id === editingFaqId ? {
        ...f,
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory
      } : f));
      setEditingFaqId(null);
    } else {
      const newFaq: FAQ = {
        id: `faq-${Date.now()}`,
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory
      };
      setFaqs(prev => [...prev, newFaq]);
    }

    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('General');
    setFaqFormOpen(false);
  };

  const handleEditFaqClick = (f: FAQ) => {
    setEditingFaqId(f.id);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqCategory(f.category);
    setFaqFormOpen(true);
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm('Delete this FAQ?')) {
      setFaqs(prev => prev.filter(f => f.id !== id));
    }
  };

  // Blog CRUD
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    const defaultImg = blogImage || 'https://picsum.photos/seed/journal/800/600';

    if (editingBlogId) {
      setBlogs(prev => prev.map(b => b.id === editingBlogId ? {
        ...b,
        title: blogTitle,
        summary: blogSummary || blogContent.slice(0, 150) + '...',
        content: blogContent,
        image: defaultImg
      } : b));
      setEditingBlogId(null);
    } else {
      const newBlog: BlogPost = {
        id: `blog-${Date.now()}`,
        title: blogTitle,
        summary: blogSummary || blogContent.slice(0, 150) + '...',
        content: blogContent,
        image: defaultImg,
        date: new Date().toISOString().split('T')[0],
        author: 'Faiqa S.',
        readTime: '4 min read'
      };
      setBlogs(prev => [newBlog, ...prev]);
    }

    setBlogTitle('');
    setBlogSummary('');
    setBlogContent('');
    setBlogImage('');
    setBlogFormOpen(false);
  };

  const handleEditBlogClick = (b: BlogPost) => {
    setEditingBlogId(b.id);
    setBlogTitle(b.title);
    setBlogSummary(b.summary);
    setBlogContent(b.content);
    setBlogImage(b.image);
    setBlogFormOpen(true);
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Delete this journal narrative?')) {
      setBlogs(prev => prev.filter(b => b.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-login-stage" className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-md w-full space-y-8 bg-brand-white border border-brand-cream p-8 sm:p-10 shadow-[0_20px_50px_rgba(201,168,106,0.1)]">
          <div className="text-center">
            <span className="text-[9px] tracking-[0.45em] text-brand-gold uppercase font-bold">🔒 Restricted Gateway</span>
            <h2 className="mt-4 font-serif text-3xl font-light tracking-wide text-brand-black font-light">Boutique Administrator</h2>
            <div className="mt-4 h-[1px] w-20 bg-brand-gold mx-auto" />
            <p className="mt-4 text-xs text-brand-gray max-w-xs mx-auto leading-relaxed">
              Please authenticate using your registered email and secure passkey. Only authorized administrators can access this panel.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            {loginError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[11px] p-3 text-center tracking-wide">
                {loginError}
              </div>
            )}
            <div className="space-y-4 font-sans">
              <div>
                <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">Creator Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="creator@example.com"
                  className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase font-bold text-brand-black block mb-2">Secret Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs text-brand-black focus:border-brand-gold focus:outline-none rounded-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-brand-black hover:bg-brand-gold text-brand-white hover:text-brand-black transition-all duration-300 font-sans text-xs tracking-widest uppercase font-bold py-3.5 px-4 rounded-none shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? 'Authenticating...' : 'Enter Admin Terminal'}
              </button>

              <div className="flex items-center justify-center gap-2 py-1">
                <div className="h-[1px] bg-brand-cream/60 flex-grow" />
                <span className="text-[10px] uppercase tracking-wider text-brand-gray">OR Secure Sign In</span>
                <div className="h-[1px] bg-brand-cream/60 flex-grow" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isVerifying}
                className="w-full bg-white hover:bg-[#FAF8F5] border border-brand-cream text-brand-black transition-all duration-300 font-sans text-xs tracking-widest uppercase font-bold py-3 px-4 rounded-none shadow-sm flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </form>
          <div className="text-center pt-2">
            <span className="text-[10px] text-brand-gray font-mono">ARTISTCORE LAHORE STUDIO</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="cms-dashboard-view" className="bg-[#FAF8F5] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Card */}
        <div className="bg-brand-black text-brand-white p-8 rounded-none mb-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-brand-gold/20">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-none bg-brand-gold/10 flex items-center justify-center border border-brand-gold/40 text-brand-gold">
              <Database size={24} />
            </div>
            <div>
              <h1 className="font-serif text-3xl tracking-wide text-brand-gold">Boutique CMS Panel</h1>
              <p className="font-sans text-xs text-brand-white/75 mt-0.5 tracking-wider">
                Manage products, artwork galleries, contact messages, custom briefs, and subscribers.
              </p>
            </div>
          </div>
          
          {/* Admin Dashboard Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetDatabase}
              className="flex items-center justify-center gap-1.5 border border-brand-cream/30 hover:border-brand-gold hover:bg-brand-gold/10 px-4 py-2.5 rounded-none text-xs tracking-widest uppercase font-bold text-brand-cream/90 transition-all duration-300 cursor-pointer"
              title="Restore original database seed"
            >
              <RefreshCw size={12} /> Reset Database
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 border border-red-500/40 hover:border-red-500 hover:bg-red-500/15 px-4 py-2.5 rounded-none text-xs tracking-widest uppercase font-bold text-red-200 transition-all duration-300 cursor-pointer"
              title="Sign out of Admin Session"
            >
              🔒 Sign Out
            </button>
          </div>
        </div>

        {/* Quick Analytics & Insights Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-brand-white border border-brand-cream p-5 rounded-none shadow-[0_4px_20px_rgba(201,168,106,0.03)] flex flex-col justify-between">
            <span className="text-brand-gray text-[10px] uppercase tracking-wider font-semibold block mb-2">Crochet Items</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif text-brand-black font-semibold">{products.length}</span>
              <span className="text-[10px] text-brand-gold font-mono font-bold">In Shop</span>
            </div>
          </div>
          <div className="bg-brand-white border border-brand-cream p-5 rounded-none shadow-[0_4px_20px_rgba(201,168,106,0.03)] flex flex-col justify-between">
            <span className="text-brand-gray text-[10px] uppercase tracking-wider font-semibold block mb-2">Master Paintings</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif text-brand-black font-semibold">{paintings.length}</span>
              <span className="text-[10px] text-brand-gold font-mono font-bold">In Gallery</span>
            </div>
          </div>
          <div className="bg-brand-white border border-brand-cream p-5 rounded-none shadow-[0_4px_20px_rgba(201,168,106,0.03)] flex flex-col justify-between">
            <span className="text-brand-gray text-[10px] uppercase tracking-wider font-semibold block mb-2">Letters Received</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif text-brand-black font-semibold">{contactMessages.length}</span>
              <span className={`text-[10px] font-mono font-bold uppercase ${contactMessages.filter(m => m.status === 'unread').length > 0 ? 'text-brand-gold' : 'text-brand-gray'}`}>
                {contactMessages.filter(m => m.status === 'unread').length} Unread
              </span>
            </div>
          </div>
          <div className="bg-brand-white border border-brand-cream p-5 rounded-none shadow-[0_4px_20px_rgba(201,168,106,0.03)] flex flex-col justify-between">
            <span className="text-brand-gray text-[10px] uppercase tracking-wider font-semibold block mb-2">Commission Briefs</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif text-brand-black font-semibold">{customOrders.length}</span>
              <span className={`text-[10px] font-mono font-bold uppercase ${customOrders.filter(o => o.status === 'pending').length > 0 ? 'text-brand-gold' : 'text-brand-gray'}`}>
                {customOrders.filter(o => o.status === 'pending').length} Pending
              </span>
            </div>
          </div>
          <div className="bg-brand-white border border-brand-cream p-5 rounded-none shadow-[0_4px_20px_rgba(201,168,106,0.03)] flex flex-col justify-between col-span-2 md:col-span-1">
            <span className="text-brand-gray text-[10px] uppercase tracking-wider font-semibold block mb-2">Patron Circle</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif text-brand-black font-semibold">{subscribers.length}</span>
              <span className="text-[10px] text-brand-gold font-mono font-bold">Subscribed</span>
            </div>
          </div>
        </div>

        {/* Outer Grid: Side navigation + main CMS fields */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Tabs - Touch Friendly and Stretched on Mobile */}
          <div className="lg:col-span-3 bg-brand-white border border-brand-cream p-4 rounded-none space-y-1 shadow-sm">
            <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-brand-gold px-3 mb-4">CMS Modules</h3>
            
            <button
              onClick={() => setActiveAdminTab('products')}
              className={`w-full text-left font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-none font-semibold transition-all flex items-center gap-2.5 ${
                activeAdminTab === 'products'
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-black/75 hover:bg-brand-cream/30'
              }`}
            >
              🧶 Crochet Products
            </button>
            <button
              onClick={() => setActiveAdminTab('paintings')}
              className={`w-full text-left font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-none font-semibold transition-all flex items-center gap-2.5 ${
                activeAdminTab === 'paintings'
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-black/75 hover:bg-brand-cream/30'
              }`}
            >
              🎨 Fine Paintings
            </button>
            <button
              onClick={() => setActiveAdminTab('messages')}
              className={`w-full text-left font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-none font-semibold transition-all flex items-center justify-between ${
                activeAdminTab === 'messages'
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-black/75 hover:bg-brand-cream/30'
              }`}
            >
              <span className="flex items-center gap-2.5">✉️ Letters Inbox</span>
              {contactMessages.filter(m => m.status === 'unread').length > 0 && (
                <span className="bg-brand-gold text-brand-black font-mono text-[9px] font-bold px-2 py-0.5 rounded-none">
                  {contactMessages.filter(m => m.status === 'unread').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveAdminTab('bookings')}
              className={`w-full text-left font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-none font-semibold transition-all flex items-center justify-between ${
                activeAdminTab === 'bookings'
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-black/75 hover:bg-brand-cream/30'
              }`}
            >
              <span className="flex items-center gap-2.5">💼 Custom Bookings</span>
              {customOrders.filter(o => o.status === 'pending').length > 0 && (
                <span className="bg-brand-black text-brand-white border border-brand-gold font-mono text-[9px] font-bold px-2 py-0.5 rounded-none">
                  {customOrders.filter(o => o.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveAdminTab('website-content')}
              className={`w-full text-left font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-none font-semibold transition-all flex items-center gap-2.5 ${
                activeAdminTab === 'website-content'
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-black/75 hover:bg-brand-cream/30'
              }`}
            >
              🏛️ Website Copy CMS
            </button>
            <button
              onClick={() => setActiveAdminTab('faq-blog')}
              className={`w-full text-left font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-none font-semibold transition-all flex items-center gap-2.5 ${
                activeAdminTab === 'faq-blog'
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-black/75 hover:bg-brand-cream/30'
              }`}
            >
              📚 FAQs & Journals
            </button>
            <button
              onClick={() => setActiveAdminTab('subscribers')}
              className={`w-full text-left font-sans text-xs tracking-wider uppercase py-3 px-4 rounded-none font-semibold transition-all flex items-center gap-2.5 ${
                activeAdminTab === 'subscribers'
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-black/75 hover:bg-brand-cream/30'
              }`}
            >
              👥 Registry Circle ({subscribers.length})
            </button>
          </div>
          
          {/* Right Main Management Workstation */}
          <div className="lg:col-span-9 bg-brand-white border border-brand-cream p-6 rounded-none shadow-sm min-h-[500px]">
            
            {/* 1. CROCHET PRODUCTS MODULE */}
            {activeAdminTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-cream pb-4">
                  <h2 className="font-serif text-2xl text-brand-black">🧶 Crochet Catalogue Registry</h2>
                  <button
                    onClick={() => {
                      setEditingProductId(null);
                      setProductName('');
                      setProductPrice(0);
                      setProductImage('');
                      setProductDescription('');
                      setProductMaterials('');
                      setProductSizes('');
                      setProductFeatured(false);
                      setProductFormOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-brand-black text-brand-white hover:bg-brand-gold hover:text-brand-black px-4 py-2 text-xs tracking-widest uppercase font-bold transition-all rounded-none shadow"
                  >
                    <Plus size={12} /> Add Product
                  </button>
                </div>

                {/* Product Form Overlay Inline */}
                {productFormOpen && (
                  <form onSubmit={handleSaveProduct} className="bg-brand-cream/20 border border-brand-cream p-5 rounded-none space-y-4">
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-gold">
                      {editingProductId ? 'Edit Crochet product details' : 'Publish new crochet product'}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Product Name *</label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="e.g. Classic Lace Booties"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Price (PKR) *</label>
                        <input
                          type="number"
                          value={productPrice || ''}
                          onChange={(e) => setProductPrice(Number(e.target.value))}
                          placeholder="e.g. 1500"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Category Category *</label>
                        <select
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        >
                          <option value="Baby Frocks">Baby Frocks</option>
                          <option value="Shoes">Shoes</option>
                          <option value="Caps">Caps</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Image URL Address</label>
                        <input
                          type="text"
                          value={productImage}
                          onChange={(e) => setProductImage(e.target.value)}
                          placeholder="Leave blank for random placeholder, or paste custom link"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Materials Used (comma-separated)</label>
                        <input
                          type="text"
                          value={productMaterials}
                          onChange={(e) => setProductMaterials(e.target.value)}
                          placeholder="e.g. 100% Cotton, Silk Ribbons, Pearl Buttons"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Available Sizing (comma-separated)</label>
                        <input
                          type="text"
                          value={productSizes}
                          onChange={(e) => setProductSizes(e.target.value)}
                          placeholder="e.g. 0-3M, 3-6M, 6-12M"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold block mb-1">Detailed Description *</label>
                      <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Detail the loop structure, packaging box, softness, etc..."
                        rows={3}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none resize-none"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="prod-featured"
                        checked={productFeatured}
                        onChange={(e) => setProductFeatured(e.target.checked)}
                        className="accent-brand-gold"
                      />
                      <label htmlFor="prod-featured" className="text-[10px] uppercase font-bold text-brand-black cursor-pointer">
                        Feature this creation on the home page showcase grid
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setProductFormOpen(false)}
                        className="border border-brand-cream px-4 py-2 text-xs uppercase font-bold rounded-none hover:bg-brand-cream/20"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-black text-brand-white hover:bg-brand-gold hover:text-brand-black px-5 py-2 text-xs uppercase font-bold rounded-none"
                      >
                        {editingProductId ? 'Save Product' : 'Add to Catalogue'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Products Table/List */}
                <div className="space-y-3">
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center justify-between border border-brand-cream/60 p-4 rounded-none bg-brand-white hover:shadow-sm">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="h-12 w-12 rounded-none object-cover border border-brand-cream"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-brand-black text-sm">{p.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-brand-gray font-sans">
                            <span className="bg-brand-cream/50 px-1.5 py-0.5 rounded-none text-brand-black font-bold uppercase">{p.category}</span>
                            <span>•</span>
                            <span className="font-mono font-bold text-brand-gold">PKR {p.price.toLocaleString()}</span>
                            {p.featured && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold">★ Featured</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditProductClick(p)}
                          className="p-2 text-brand-gray hover:text-brand-gold hover:bg-brand-cream/30 rounded-none"
                          title="Edit Crochet Item"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 text-brand-gray hover:text-rose-600 hover:bg-rose-50 rounded-none"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. FINE PAINTINGS MODULE */}
            {activeAdminTab === 'paintings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-brand-cream pb-4">
                  <h2 className="font-serif text-2xl text-brand-black">🎨 Fine Painting Catalogue Registry</h2>
                  <button
                    onClick={() => {
                      setEditingPaintingId(null);
                      setPaintingTitle('');
                      setPaintingPrice(0);
                      setPaintingImage('');
                      setPaintingDescription('');
                      setPaintingMedium('');
                      setPaintingSize('');
                      setPaintingFeatured(false);
                      setPaintingFormOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-brand-black text-brand-white hover:bg-brand-gold hover:text-brand-black px-4 py-2 text-xs tracking-widest uppercase font-bold transition-all rounded-none shadow"
                  >
                    <Plus size={12} /> Add Masterpiece
                  </button>
                </div>

                {/* Painting Form overlay Inline */}
                {paintingFormOpen && (
                  <form onSubmit={handleSavePainting} className="bg-brand-cream/20 border border-brand-cream p-5 rounded-none space-y-4">
                    <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-gold">
                      {editingPaintingId ? 'Edit Fine Painting details' : 'Record new fine painting masterpiece'}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Painting Title *</label>
                        <input
                          type="text"
                          value={paintingTitle}
                          onChange={(e) => setPaintingTitle(e.target.value)}
                          placeholder="e.g. Shalimar Courtyard Shadows"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Price (PKR) *</label>
                        <input
                          type="number"
                          value={paintingPrice || ''}
                          onChange={(e) => setPaintingPrice(Number(e.target.value))}
                          placeholder="e.g. 32000"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Gallery Category *</label>
                        <select
                          value={paintingCategory}
                          onChange={(e) => setPaintingCategory(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        >
                          <option value="Portraits">Portraits</option>
                          <option value="Canvas Art">Canvas Art</option>
                          <option value="Custom Paintings">Custom Paintings</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Image URL Address</label>
                        <input
                          type="text"
                          value={paintingImage}
                          onChange={(e) => setPaintingImage(e.target.value)}
                          placeholder="Paste direct JPG link"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Painting Medium</label>
                        <input
                          type="text"
                          value={paintingMedium}
                          onChange={(e) => setPaintingMedium(e.target.value)}
                          placeholder="e.g. Oil on Linen, Acrylic & Gold Leaf"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold block mb-1">Dimensions / Frame Study</label>
                        <input
                          type="text"
                          value={paintingSize}
                          onChange={(e) => setPaintingSize(e.target.value)}
                          placeholder="e.g. 24x36 inches (Unframed)"
                          className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold block mb-1">Aesthetic Description *</label>
                      <textarea
                        value={paintingDescription}
                        onChange={(e) => setPaintingDescription(e.target.value)}
                        placeholder="Detail the stroke techniques, pigment quality, inspiration background..."
                        rows={3}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none focus:border-brand-gold rounded-none resize-none"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="paint-featured"
                        checked={paintingFeatured}
                        onChange={(e) => setPaintingFeatured(e.target.checked)}
                        className="accent-brand-gold"
                      />
                      <label htmlFor="paint-featured" className="text-[10px] uppercase font-bold text-brand-black cursor-pointer">
                        Feature this artwork on the home page gallery showcase
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setPaintingFormOpen(false)}
                        className="border border-brand-cream px-4 py-2 text-xs uppercase font-bold rounded-none hover:bg-brand-cream/20"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-black text-brand-white hover:bg-brand-gold hover:text-brand-black px-5 py-2 text-xs uppercase font-bold rounded-none"
                      >
                        {editingPaintingId ? 'Save Masterpiece' : 'Add to Catalogue'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Paintings List */}
                <div className="space-y-3">
                  {paintings.map((p) => (
                    <div key={p.id} className="flex items-center justify-between border border-brand-cream/60 p-4 rounded-none bg-brand-white hover:shadow-sm">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="h-12 w-12 rounded-none object-cover border"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-brand-black text-sm">{p.title}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-brand-gray font-sans">
                            <span className="bg-brand-black/90 text-brand-white px-1.5 py-0.5 rounded-none text-[8px] font-bold uppercase">{p.category}</span>
                            <span>•</span>
                            <span className="font-mono font-bold text-brand-gold">PKR {p.price.toLocaleString()}</span>
                            <span>•</span>
                            <span>📐 {p.size}</span>
                            {p.featured && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold">★ Featured</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditPaintingClick(p)}
                          className="p-2 text-brand-gray hover:text-brand-gold hover:bg-brand-cream/30 rounded-none"
                          title="Edit Painting Details"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePainting(p.id)}
                          className="p-2 text-brand-gray hover:text-rose-600 hover:bg-rose-50 rounded-none"
                          title="Delete Painting"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. LETTERS INBOX MODULE */}
            {activeAdminTab === 'messages' && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-brand-black border-b border-brand-cream pb-4 flex items-center gap-2">
                  <Mail size={20} className="text-brand-gold" /> Correspondence Inbox
                </h2>

                {contactMessages.length === 0 ? (
                  <div className="text-center py-12 text-brand-gray border border-dashed rounded bg-brand-cream/5">
                    <p className="font-serif italic text-base">Your mailbox is completely empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`border p-5 rounded-none space-y-3 relative transition-all shadow-sm ${
                          msg.status === 'unread' 
                            ? 'border-brand-gold/60 bg-brand-gold/5' 
                            : 'border-brand-cream bg-brand-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-brand-black text-base">{msg.name}</h4>
                              <span className="text-[10px] text-brand-gray">({msg.email})</span>
                            </div>
                            <p className="font-serif text-xs font-bold text-brand-gold mt-1">Sub: {msg.subject}</p>
                          </div>
                          
                          <span className="font-mono text-[9px] text-brand-gray uppercase">
                            {new Date(msg.date).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="font-sans text-xs text-brand-gray leading-relaxed tracking-wide bg-[#FAF8F5]/80 p-3 rounded-none border">
                          {msg.message}
                        </p>

                        <div className="flex justify-end gap-2 border-t border-brand-cream/40 pt-3">
                          {msg.status === 'unread' ? (
                            <button
                              onClick={() => updateContactMessageStatus(msg.id, 'read')}
                              className="flex items-center gap-1 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black px-3 py-1.5 rounded-none text-[10px] tracking-widest uppercase font-bold transition-all"
                            >
                              <Check size={10} /> Mark Read
                            </button>
                          ) : (
                            <span className="text-[9px] font-mono tracking-widest text-emerald-600 font-bold uppercase flex items-center gap-1 py-1 px-2 bg-emerald-50 border border-emerald-200 rounded-none">
                              ✓ Reviewed
                            </span>
                          )}
                          <button
                            onClick={() => deleteContactMessage(msg.id)}
                            className="text-[10px] tracking-widest uppercase font-bold text-brand-gray hover:text-rose-600 border border-brand-cream px-3 py-1.5 rounded-none hover:bg-rose-50"
                          >
                            Delete Log
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. CUSTOM ORDERS / BOOKINGS TRACKER */}
            {activeAdminTab === 'bookings' && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-brand-black border-b border-brand-cream pb-4 flex items-center gap-2">
                  <UserCheck size={20} className="text-brand-gold" /> Custom Commission Ledgers
                </h2>

                {customOrders.length === 0 ? (
                  <div className="text-center py-12 text-brand-gray border border-dashed rounded bg-brand-cream/5">
                    <p className="font-serif italic text-base">No active custom commission orders logged.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customOrders.map((ord) => (
                      <div 
                        key={ord.id} 
                        className={`border p-5 rounded-none space-y-3 relative bg-brand-white border-brand-cream shadow-sm`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-brand-black text-base">{ord.name}</h4>
                              <span className="bg-brand-cream/50 border border-brand-cream font-mono text-[9px] px-2 py-0.5 rounded-none text-brand-black">
                                ID: {ord.id}
                              </span>
                            </div>
                            <p className="font-mono text-xs font-semibold text-brand-gold mt-1">WhatsApp Contact: {ord.whatsapp}</p>
                          </div>
                          
                          <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-none border ${
                            ord.status === 'pending'
                              ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                              : ord.status === 'approved'
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                              : 'border-brand-gray/30 bg-brand-cream text-brand-gray'
                          }`}>
                            {ord.status}
                          </span>
                        </div>

                        <p className="font-sans text-xs text-brand-gray leading-relaxed tracking-wide bg-brand-cream/20 p-3 rounded-none border border-brand-cream/40">
                          {ord.details}
                        </p>

                        <div className="flex justify-end gap-2 border-t border-brand-cream/30 pt-3">
                          {ord.status === 'pending' && (
                            <button
                              onClick={() => updateCustomOrderStatus(ord.id, 'approved')}
                              className="border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black px-3 py-1.5 rounded-none text-[10px] font-bold tracking-widest uppercase transition-all"
                            >
                              Approve Design Study
                            </button>
                          )}
                          {ord.status === 'approved' && (
                            <button
                              onClick={() => updateCustomOrderStatus(ord.id, 'completed')}
                              className="border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-brand-white px-3 py-1.5 rounded-none text-[10px] font-bold tracking-widest uppercase transition-all"
                            >
                              Mark Delivered & Settled
                            </button>
                          )}
                          <button
                            onClick={() => deleteCustomOrder(ord.id)}
                            className="text-[10px] tracking-widest uppercase font-bold text-brand-gray hover:text-rose-600 border border-brand-cream px-3 py-1.5 rounded-none hover:bg-rose-50"
                          >
                            Delete Booking
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. WEBSITE COPY CMS MODULE */}
            {activeAdminTab === 'website-content' && (
              <>
                <form onSubmit={handleSaveWebsiteContent} className="space-y-6">
                <div className="border-b border-brand-cream pb-4">
                  <h2 className="font-serif text-2xl text-brand-black">🏛️ Homepage Content & Contacts CMS</h2>
                  <p className="text-xs text-brand-gray mt-1">Alter headline typography and location coordinates globally</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-cream pb-1">
                    Home Page Hero Block
                  </h3>
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold block mb-1">Hero Section Title</label>
                    <input
                      type="text"
                      value={editHeroTitle}
                      onChange={(e) => setEditHeroTitle(e.target.value)}
                      className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold block mb-1">Hero Section Subtitle</label>
                    <textarea
                      value={editHeroSubtitle}
                      onChange={(e) => setEditHeroSubtitle(e.target.value)}
                      rows={2}
                      className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs focus:outline-none focus:border-brand-gold rounded-none resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-cream pb-1">
                    Our Heritage Story Block
                  </h3>

                  <div>
                    <label className="text-[10px] uppercase font-bold block mb-1">Story Header Title</label>
                    <input
                      type="text"
                      value={editStoryTitle}
                      onChange={(e) => setEditStoryTitle(e.target.value)}
                      className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs focus:outline-none focus:border-brand-gold rounded-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold block mb-1">Story Narrative Copy Text</label>
                    <textarea
                      value={editStoryText}
                      onChange={(e) => setEditStoryText(e.target.value)}
                      rows={5}
                      className="w-full bg-brand-white border border-brand-cream px-3 py-2.5 text-xs focus:outline-none focus:border-brand-gold rounded-none resize-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-cream pb-1">
                    Contact Coordinates & Social Channels
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold block mb-1">WhatsApp Hotline</label>
                      <input
                        type="text"
                        value={editWhatsapp}
                        onChange={(e) => setEditWhatsapp(e.target.value)}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold block mb-1">Instagram Handle</label>
                      <input
                        type="text"
                        value={editInstagram}
                        onChange={(e) => setEditInstagram(e.target.value)}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none rounded-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold block mb-1">TikTok Handle</label>
                      <input
                        type="text"
                        value={editTiktok}
                        onChange={(e) => setEditTiktok(e.target.value)}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none rounded-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold block mb-1">City Location Coordinates</label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold block mb-1">Complete Studio Address</label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none rounded-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-white transition-all duration-300 font-sans text-xs tracking-widest uppercase font-bold py-4 px-12 rounded-none shadow"
                  >
                    Save CMS Website Copy
                  </button>
                </div>

              </form>

              {/* Secondary Change Admin Password Form */}
              <form onSubmit={handleChangePassword} className="mt-12 bg-brand-white border border-brand-cream p-6 sm:p-8 space-y-4">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-brand-cream pb-1">
                  🔐 Security Credentials Lock
                </h3>
                <p className="font-sans text-[11px] text-brand-gray leading-relaxed max-w-xl">
                  Update the secure administrator passkey. You will use this new password to sign into the CMS Admin Panel from your mobile phone or computer.
                </p>

                {changePasswordError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[11px] p-2 text-center tracking-wide">
                    {changePasswordError}
                  </div>
                )}
                {changePasswordSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] p-2 text-center tracking-wide">
                    {changePasswordSuccess}
                  </div>
                )}

                <div className="max-w-md">
                  <label className="text-[10px] uppercase font-bold block mb-1">New Administrator Password</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-brand-white border border-brand-cream px-3 py-2 text-xs focus:outline-none rounded-none"
                    />
                    <button
                      type="submit"
                      className="bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-white text-[10px] uppercase font-bold px-4 rounded-none transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

            {/* 6. FAQS & BLOGS EDITOR MODULE */}
            {activeAdminTab === 'faq-blog' && (
              <div className="space-y-8">
                
                {/* 6a. FAQ Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-cream pb-3">
                    <h3 className="font-serif text-xl text-brand-black flex items-center gap-2">
                      <HelpCircle size={16} className="text-brand-gold" /> FAQ Registry Database
                    </h3>
                    <button
                      onClick={() => {
                        setEditingFaqId(null);
                        setFaqQuestion('');
                        setFaqAnswer('');
                        setFaqCategory('General');
                        setFaqFormOpen(true);
                      }}
                      className="text-[10px] tracking-widest font-bold uppercase text-brand-gold hover:text-brand-black"
                    >
                      + Add New FAQ
                    </button>
                  </div>

                  {faqFormOpen && (
                    <form onSubmit={handleSaveFaq} className="bg-brand-cream/15 p-4 rounded-none border border-brand-cream space-y-3">
                      <div>
                        <label className="text-[9px] uppercase font-bold block mb-1">Question Description *</label>
                        <input
                          type="text"
                          value={faqQuestion}
                          onChange={(e) => setFaqQuestion(e.target.value)}
                          className="w-full bg-brand-white border px-3 py-2 text-xs rounded-none focus:outline-none focus:border-brand-gold"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold block mb-1">Answer Description *</label>
                        <textarea
                          value={faqAnswer}
                          onChange={(e) => setFaqAnswer(e.target.value)}
                          rows={3}
                          className="w-full bg-brand-white border px-3 py-2 text-xs rounded-none focus:outline-none focus:border-brand-gold resize-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold block mb-1">Category Category *</label>
                        <select
                          value={faqCategory}
                          onChange={(e) => setFaqCategory(e.target.value as any)}
                          className="w-full bg-brand-white border px-3 py-2 text-xs rounded-none"
                        >
                          <option value="General">General</option>
                          <option value="Crochet">Crochet</option>
                          <option value="Paintings">Paintings</option>
                          <option value="Custom Orders">Custom Orders</option>
                          <option value="Payment & Delivery">Payment & Delivery</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setFaqFormOpen(false)} className="px-3 py-1.5 border text-[10px] uppercase font-bold">Cancel</button>
                        <button type="submit" className="bg-brand-black text-brand-white px-3 py-1.5 text-[10px] uppercase font-bold">{editingFaqId ? 'Save' : 'Publish'}</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {faqs.map(f => (
                      <div key={f.id} className="flex justify-between items-center p-3 border rounded-none text-xs">
                        <div>
                          <p className="font-bold text-brand-black">{f.question}</p>
                          <span className="text-[9px] uppercase tracking-wider text-brand-gold font-bold font-mono mt-0.5 block">{f.category}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button onClick={() => handleEditFaqClick(f)} className="p-1 text-brand-gray hover:text-brand-gold"><Edit size={12} /></button>
                          <button onClick={() => handleDeleteFaq(f.id)} className="p-1 text-brand-gray hover:text-rose-600"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6b. Journal Section */}
                <div className="space-y-4 pt-6 border-t border-brand-cream/60">
                  <div className="flex items-center justify-between border-b border-brand-cream pb-3">
                    <h3 className="font-serif text-xl text-brand-black flex items-center gap-2">
                      <FileText size={16} className="text-brand-gold" /> Journal Editorial Articles
                    </h3>
                    <button
                      onClick={() => {
                        setEditingBlogId(null);
                        setBlogTitle('');
                        setBlogSummary('');
                        setBlogContent('');
                        setBlogImage('');
                        setBlogFormOpen(true);
                      }}
                      className="text-[10px] tracking-widest font-bold uppercase text-brand-gold hover:text-brand-black"
                    >
                      + Write Article
                    </button>
                  </div>

                  {blogFormOpen && (
                    <form onSubmit={handleSaveBlog} className="bg-brand-cream/15 p-4 rounded-none border border-brand-cream space-y-3">
                      <div>
                        <label className="text-[9px] uppercase font-bold block mb-1">Article Title *</label>
                        <input
                          type="text"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className="w-full bg-brand-white border px-3 py-2 text-xs rounded-none focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold block mb-1">Summary *</label>
                        <input
                          type="text"
                          value={blogSummary}
                          onChange={(e) => setBlogSummary(e.target.value)}
                          placeholder="Quick summary shown in the grid list"
                          className="w-full bg-brand-white border px-3 py-2 text-xs rounded-none focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold block mb-1">Image URL</label>
                        <input
                          type="text"
                          value={blogImage}
                          onChange={(e) => setBlogImage(e.target.value)}
                          className="w-full bg-brand-white border px-3 py-2 text-xs rounded-none focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold block mb-1">Narrative Content *</label>
                        <textarea
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          rows={6}
                          placeholder="Write long paragraphs, use ### for editorial headers..."
                          className="w-full bg-brand-white border px-3 py-2 text-xs rounded-none focus:outline-none"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setBlogFormOpen(false)} className="px-3 py-1.5 border text-[10px] uppercase font-bold">Cancel</button>
                        <button type="submit" className="bg-brand-black text-brand-white px-3 py-1.5 text-[10px] uppercase font-bold">{editingBlogId ? 'Save' : 'Publish'}</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {blogs.map(b => (
                      <div key={b.id} className="flex justify-between items-center p-3 border rounded-none text-xs">
                        <div>
                          <p className="font-bold text-brand-black leading-tight">{b.title}</p>
                          <span className="text-[9px] text-brand-gray block mt-0.5">{b.date} • {b.readTime}</span>
                        </div>
                        <div className="flex space-x-1 shrink-0">
                          <button onClick={() => handleEditBlogClick(b)} className="p-1 text-brand-gray hover:text-brand-gold"><Edit size={12} /></button>
                          <button onClick={() => handleDeleteBlog(b.id)} className="p-1 text-brand-gray hover:text-rose-600"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            )}

            {/* 7. NEWSLETTER SUBSCRIBERS CIRCLE MODULE */}
            {activeAdminTab === 'subscribers' && (
              <div className="space-y-6">
                <div className="border-b border-brand-cream pb-4 flex justify-between items-center">
                  <h2 className="font-serif text-2xl text-brand-black">👥 Registered Patron Circle</h2>
                  
                  {/* CSV Export simulation */}
                  <button
                    onClick={() => {
                      const headers = 'ID,Email,SubscribedDate\n';
                      const csvRows = subscribers.map(s => `${s.id},${s.email},${s.date}`).join('\n');
                      const blob = new Blob([headers + csvRows], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'artistcore_newsletter_registry.csv';
                      link.click();
                    }}
                    className="text-[10px] tracking-widest font-bold uppercase border border-brand-black px-3 py-1.5 rounded-none text-brand-black hover:bg-brand-black hover:text-brand-white transition-colors cursor-pointer"
                  >
                    Export CSV Ledger
                  </button>
                </div>

                <p className="font-sans text-xs text-brand-gray leading-relaxed tracking-wide">
                  These patrons have voluntarily subscribed to the Artistcore newsletter registry and are eligible for advance notifications of capsule collections.
                </p>

                <div className="border border-brand-cream rounded-none divide-y divide-brand-cream bg-brand-white font-sans text-xs">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 hover:bg-brand-cream/10">
                      <div>
                        <p className="font-bold text-brand-black">{sub.email}</p>
                        <p className="text-[9px] text-brand-gray mt-0.5">ID: {sub.id} • Registered {new Date(sub.date).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${sub.email} from newsletter circle?`)) {
                            deleteSubscriber(sub.id);
                          }
                        }}
                        className="text-[10px] tracking-widest uppercase font-bold text-brand-gray hover:text-rose-600 border border-brand-cream/50 rounded-none py-1 px-3 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
