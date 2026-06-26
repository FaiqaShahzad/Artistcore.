import { Product, Painting, Testimonial, BlogPost, FAQ, ContactInfo, HomepageContent } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: "The 'Rosette' Baby Frock",
    price: 4800,
    category: 'Baby Frocks',
    description: "An elegant, heirloom-quality baby frock intricately hand-crocheted using 100% organic Pakistani cotton yarn. Adorned with delicate vintage-style rosebuds and a soft satin lining, making it perfectly gentle for your little one's skin.",
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600',
    featured: true,
    materials: ['100% Organic Cotton', 'Silk Satin Lining', 'Soft Pearl Buttons'],
    sizes: ['0-3 Months', '3-6 Months', '6-12 Months']
  },
  {
    id: 'prod-2',
    name: 'Champagne Heirloom Booties',
    price: 1800,
    category: 'Shoes',
    description: "Luxuriously soft crochet booties hand-woven in Lahore using premium milk-cotton yarn. Accentuated with subtle champagne-gold thread details and an adjustable ribbon tie for a snug, elegant fit.",
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600',
    featured: true,
    materials: ['Premium Milk Cotton', 'Champagne Gold Thread', 'Satin Ribbon'],
    sizes: ['Newborn', '0-3 Months', '3-6 Months']
  },
  {
    id: 'prod-3',
    name: 'Walled City Blossom Bonnet',
    price: 1600,
    category: 'Caps',
    description: "A vintage-inspired baby cap hand-crocheted with fine, breathable cotton thread. Features an intricate lace border that frames the face beautifully, keeping your baby comfortable and stylish.",
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600',
    featured: false,
    materials: ['Soft Cotton Yarn', 'Elastic Satin Trim'],
    sizes: ['0-6 Months', '6-12 Months']
  },
  {
    id: 'prod-4',
    name: 'Ivory Cascade Crochet Clutch',
    price: 3200,
    category: 'Accessories',
    description: "A sophisticated handmade handbag designed for the modern connoisseur. Features a durable interlocking crochet weave, a premium interior lining, and an elegant brass chain strap.",
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600',
    featured: true,
    materials: ['Sturdy Cord Yarn', 'Satin Lining', 'Brass Hardware'],
    sizes: ['One Size']
  }
];

export const INITIAL_PAINTINGS: Painting[] = [
  {
    id: 'paint-1',
    title: 'Noor of the Walled City',
    price: 28000,
    category: 'Portraits',
    description: "A beautiful, realistic portrait painting depicting a young Pakistani woman illuminated by the gentle twilight glow of Lahore's historic courtyards. Hand-painted using professional artist-grade oils on archival-quality stretched canvas.",
    image: 'https://images.unsplash.com/photo-1579783922514-0235116aa3a2?q=80&w=600',
    featured: true,
    medium: 'Oil on Stretched Canvas',
    size: '18x24 inches'
  },
  {
    id: 'paint-2',
    title: 'Shalimar Whispers',
    price: 35000,
    category: 'Canvas Art',
    description: "An elegant abstract expressionist canvas painting inspired by the shadows of historic flora and the rhythmic sound of water fountains at Lahore's Shalimar Gardens. Heavy-body acrylic layers create a rich tactile experience.",
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600',
    featured: true,
    medium: 'Acrylic and Gold Leaf on Stretched Canvas',
    size: '24x36 inches'
  },
  {
    id: 'paint-3',
    title: 'Chinar Leaf Studies in Gold',
    price: 18000,
    category: 'Custom Paintings',
    description: "A highly delicate mixed-media fine art piece highlighting the transition of the iconic Chinar leaf, finished with premium 24K gold leafing. Ideal for adding a warm, opulent touch to classical and modern interiors alike.",
    image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=600',
    featured: false,
    medium: 'Watercolor, Ink, and 24K Gold Leaf on Archival Paper',
    size: '12x16 inches (Framed)'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Amina Khan',
    role: 'Art Collector, Gulberg',
    review: "I commissioned a custom family portrait from ARTISTCORE, and the attention to detail is absolutely staggering. The artist captured the lighting and emotions beautifully. It is now the center of our living room in Lahore. Worth every single rupee!",
    rating: 5,
    date: '2026-05-12'
  },
  {
    id: 'test-2',
    name: 'Zahra Bilgrami',
    role: 'Mother & Designer, DHA Phase 6',
    review: "The 'Rosette' Baby Frock and Champagne Booties are of exceptional quality. The cotton is incredibly soft and looks so luxurious. It was the perfect outfit for my daughter's first Eid, and everyone couldn't stop asking where it was from.",
    rating: 5,
    date: '2026-06-02'
  },
  {
    id: 'test-3',
    name: 'Bilal Siddiqui',
    role: 'Creative Director, Lahore',
    review: "I requested a custom crochet wrap for a baby gift. The packaging was immaculate—so premium—and the craft itself is world-class. It’s rare to find such authentic, high-quality handmade art in Pakistan.",
    rating: 5,
    date: '2026-06-18'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: "The Art of Slow Fashion: Why Handmade Crochet Will Always Be Timeless",
    summary: "Discover the heritage of crochet, why organic materials matter for babies, and how slow fashion is making a silent luxury statement in Lahore's fashion circles.",
    content: `In an era dominated by fast fashion and synthetic mass production, slow fashion has emerged as the ultimate expression of modern luxury. Crochet, an ancient craft that cannot be replicated by any industrial machine, sits at the heart of this movement.

At ARTISTCORE, we believe that garments should carry a story, a soul, and a heartbeat. Every loop, twist, and knot in our baby frocks and booties is handmade with love in Lahore, Pakistan. Here is why choosing handmade crochet is a conscious, elegant choice for your family:

### 1. Zero Machine Replication
Unlike knitting, which can be easily mass-produced by industrial looms, crochet can only be made by human hands. When your baby wears an ARTISTCORE frock, they are wearing a literal piece of art that required hours of meticulous concentration and craftsmanship.

### 2. Premium Organic Comfort
For infants, fabric selection is paramount. We source 100% organic Pakistani cotton yarn which is ultra-soft, hypoallergenic, and highly breathable. Unlike polyester blends, organic cotton regulates the baby's body temperature and prevents skin irritation.

### 3. Heirloom Longevity
Our products are built as heirlooms. With proper care, these premium crochet booties, caps, and dresses will last for generations, preserving memories of your little one's early milestones.

We invite you to step away from the transient nature of mass-produced items and embrace the timeless, luxurious warmth of true handmade artistry.`,
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=600',
    date: '2026-06-10',
    author: 'Faiqa S.',
    readTime: '4 min read'
  },
  {
    id: 'blog-2',
    title: "From Sketch to Canvas: Commisioning Your First Custom Fine Art Painting",
    summary: "A comprehensive guide to commissioning custom portrait and landscape paintings in Pakistan. Understand our step-by-step collaborative art creation process.",
    content: `Commissioning a custom piece of art is one of the most rewarding cultural experiences a patron can embark upon. It allows you to freeze a cherished memory, a beloved face, or a deep emotion into a lasting physical object.

At ARTISTCORE, our fine art commissions range from realistic oil portraits to textured contemporary abstracts. If you have been contemplating ordering a personalized painting, here is what our premium creation process looks like:

### Step 1: The Creative Dialogue
Every commission begins with a conversation. We discuss your aesthetic preferences, color palette, dimensions, and where the painting will hang in your home. You can share reference photos or describe a mood.

### Step 2: Composition & Palette Sketching
Once we align on the vision, we provide a digital sketch or a small charcoal draft. Here, we outline the composition, lighting, and color harmony. Work only commences once you are 100% satisfied with this blueprint.

### Step 3: The Slow Layering of Oils or Acrylics
With the design approved, the paint meets the canvas. We apply successive layers of professional, artist-grade pigments. For oil portraits, this involves a multi-week drying process between glazes, ensuring unparalleled depth and classical luminosity.

### Step 4: The Reveal and Framing
We send high-definition photos of the completed piece for your approval. Once perfected, we deliver the painting directly to your doorstep in Lahore, complete with a signed certificate of authenticity.

Whether it is a family portrait or a custom abstract canvas for your new office, we look forward to turning your abstract vision into an everlasting masterpiece.`,
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600',
    date: '2026-06-20',
    author: 'Faiqa S.',
    readTime: '6 min read'
  }
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: "Do you take custom orders for baby frocks and paintings?",
    answer: "Yes, absolutely! Custom commissions are our primary focus. For baby frocks, you can specify colors, sizes, and design patterns. For paintings, we specialize in oil portraits, canvas abstracts, and stylized calligraphy. Contact us via WhatsApp to share your specific ideas.",
    category: 'Custom Orders'
  },
  {
    id: 'faq-2',
    question: "What is your payment policy for custom commissions?",
    answer: "Custom orders require a 50% advance payment via Bank Transfer, JazzCash, or Easypaisa before we begin sourcing premium materials and sketching. The remaining 50% is due immediately upon hand-delivery in Lahore.",
    category: 'Payment & Delivery'
  },
  {
    id: 'faq-3',
    question: "How long does it take to complete a crochet item vs. a painting?",
    answer: "Crochet items (frocks, booties, accessories) generally take 5 to 10 working days depending on the pattern's complexity. Fine art oil portrait paintings take between 3 to 5 weeks, as oil paints require significant drying time between layers to ensure longevity and rich color rendering.",
    category: 'General'
  },
  {
    id: 'faq-4',
    question: "Is delivery available outside of Lahore?",
    answer: "Currently, our standard white-glove hand-delivery and assembly are focused on Lahore. However, for smaller crochet accessories and select paintings, we can arrange secure courier shipping across major cities in Pakistan (such as Karachi and Islamabad) with specialized custom packaging. Please inquire via WhatsApp to discuss options.",
    category: 'Payment & Delivery'
  },
  {
    id: 'faq-5',
    question: "What materials do you use for baby crochet products?",
    answer: "We strictly utilize organic Egyptian cotton, ultra-soft premium milk-cotton, and bamboo-silk blends. All materials are tested to ensure they are 100% hypoallergenic, lightweight, breathable, and completely free from coarse fibers that could irritate infant skin.",
    category: 'Crochet'
  }
];

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  whatsapp: '0320-1195910',
  instagram: '@artistcore._',
  tiktok: '@artistcore07',
  location: 'Lahore, Pakistan',
  address: 'Gulberg III, Lahore, Punjab, Pakistan',
  email: 'artistcore.pk@gmail.com'
};

export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  heroTitle: 'Luxury Handmade Crochet & Art Creations',
  heroSubtitle: 'Crafted with passion, timeless creativity, and absolute attention to every detail.',
  storyTitle: 'Crafting Timeless Heirlooms in Lahore',
  storyText: 'ARTISTCORE was born from a deep adoration for tactile arts and classical fine craftsmanship. Rooted in the cultural heart of Lahore, Pakistan, we curate premium handmade baby crochet apparel, exquisite shoes, and masterfully rendered oil portraits on linen. Our philosophy is simple: reject the transient nature of mass-produced items in favor of slow, deliberate creation. Every thread is selected by hand, every paint pigment mixed with intent, ensuring that each ARTISTCORE piece is a treasured family heirloom for generations to come.'
};
