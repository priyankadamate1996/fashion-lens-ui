import { StatusBar } from 'expo-status-bar';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  createEmailAccount,
  sendPasswordReset,
  signInWithEmail,
  signOutUser,
  subscribeToAuth,
} from './auth';

type Offer = {
  store: string;
  price: number;
  url?: string | null;
};

type Product = {
  id: string;
  name: string;
  audience: string;
  category: string;
  image: string;
  match: number | null;
  details: string;
  offers: Offer[];
  offersToken?: string | null;
};

const sampleProducts: Product[] = [
  {
    id: 'cotton-kurta',
    name: 'Printed cotton straight kurta',
    audience: 'Women',
    category: 'Kurtas & Kurtis',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    match: 96,
    details: 'Cotton · 3/4 sleeves · Straight fit',
    offers: [
      { store: 'Myntra', price: 899 },
      { store: 'Amazon', price: 1049 },
      { store: 'Meesho', price: 649 },
    ],
  },
  {
    id: 'indigo-set',
    name: 'Indigo hand-block kurta set',
    audience: 'Women',
    category: 'Kurtas & Kurtis',
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
    match: 92,
    details: 'Rayon · Straight fit · 2-piece set',
    offers: [
      { store: 'Myntra', price: 1499 },
      { store: 'Amazon', price: 1299 },
      { store: 'Meesho', price: 999 },
    ],
  },
  {
    id: 'floral-kurta',
    name: 'Floral everyday A-line kurta',
    audience: 'Women',
    category: 'Kurtas & Kurtis',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
    match: 89,
    details: 'Viscose · A-line · Calf length',
    offers: [
      { store: 'Myntra', price: 1199 },
      { store: 'Amazon', price: 949 },
      { store: 'Meesho', price: 799 },
    ],
  },
  {
    id: 'festive-kurta',
    name: 'Embroidered festive kurta set',
    audience: 'Women',
    category: 'Kurtas & Kurtis',
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    match: 84,
    details: 'Chanderi blend · Embroidered · 3-piece set',
    offers: [
      { store: 'Myntra', price: 2299 },
      { store: 'Amazon', price: 1999 },
      { store: 'Meesho', price: 1749 },
    ],
  },
  {
    id: 'women-embroidered-ethnic-set',
    name: 'Embroidered festive ethnic set',
    audience: 'Women',
    category: 'Ethnic Sets',
    image:
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
    match: 90,
    details: 'Cotton blend · Kurta, trousers and dupatta',
    offers: [
      { store: 'Myntra', price: 1899 },
      { store: 'Amazon', price: 1699 },
      { store: 'Meesho', price: 1299 },
    ],
  },
  {
    id: 'printed-midi-dress',
    name: 'Printed everyday midi dress',
    audience: 'Women',
    category: 'Dresses',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
    match: 91,
    details: 'Cotton blend · Midi length · Relaxed fit',
    offers: [
      { store: 'Myntra', price: 1399 },
      { store: 'Amazon', price: 1249 },
      { store: 'Meesho', price: 899 },
    ],
  },
  {
    id: 'woven-saree',
    name: 'Woven occasion-ready saree',
    audience: 'Women',
    category: 'Sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    match: 88,
    details: 'Woven blend · Contrast border · Unstitched',
    offers: [
      { store: 'Myntra', price: 1899 },
      { store: 'Amazon', price: 1699 },
      { store: 'Meesho', price: 1299 },
    ],
  },
  {
    id: 'casual-coord',
    name: 'Easy-breezy printed co-ord set',
    audience: 'Women',
    category: 'Co-ord Sets',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
    match: 86,
    details: 'Viscose · Matching top and trousers',
    offers: [
      { store: 'Myntra', price: 1599 },
      { store: 'Amazon', price: 1399 },
      { store: 'Meesho', price: 1099 },
    ],
  },
  {
    id: 'women-cotton-top',
    name: 'Everyday striped cotton top',
    audience: 'Women',
    category: 'Tops & T-shirts',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85',
    match: 89,
    details: 'Cotton · Short sleeves · Relaxed fit',
    offers: [
      { store: 'Myntra', price: 699 },
      { store: 'Amazon', price: 799 },
      { store: 'Meesho', price: 449 },
    ],
  },
  {
    id: 'women-straight-jeans',
    name: 'High-rise straight-fit jeans',
    audience: 'Women',
    category: 'Jeans & Trousers',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85',
    match: 87,
    details: 'Stretch denim · High rise · Straight leg',
    offers: [
      { store: 'Myntra', price: 1299 },
      { store: 'Amazon', price: 1199 },
      { store: 'Meesho', price: 899 },
    ],
  },
  {
    id: 'women-pleated-skirt',
    name: 'Easy pleated midi skirt',
    audience: 'Women',
    category: 'Skirts',
    image:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=85',
    match: 85,
    details: 'Flowy fabric · Midi length · Elastic waist',
    offers: [
      { store: 'Myntra', price: 1099 },
      { store: 'Amazon', price: 949 },
      { store: 'Meesho', price: 699 },
    ],
  },
  {
    id: 'women-everyday-sandals',
    name: 'Everyday comfortable sandals',
    audience: 'Women',
    category: 'Footwear',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
    match: 88,
    details: 'Faux leather · Cushioned sole · Everyday wear',
    offers: [
      { store: 'Myntra', price: 999 },
      { store: 'Amazon', price: 849 },
      { store: 'Meesho', price: 599 },
    ],
  },
  {
    id: 'women-crossbody-bag',
    name: 'Everyday mini crossbody bag',
    audience: 'Women',
    category: 'Bags & Accessories',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    match: 86,
    details: 'Vegan leather · Adjustable strap · Zip closure',
    offers: [
      { store: 'Myntra', price: 1199 },
      { store: 'Amazon', price: 999 },
      { store: 'Meesho', price: 649 },
    ],
  },
  {
    id: 'mens-linen-shirt',
    name: 'Classic relaxed-fit linen shirt',
    audience: 'Men',
    category: 'Shirts',
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85',
    match: 94,
    details: 'Linen blend · Full sleeves · Relaxed fit',
    offers: [
      { store: 'Myntra', price: 999 },
      { store: 'Amazon', price: 1199 },
      { store: 'Meesho', price: 749 },
    ],
  },
  {
    id: 'mens-casual-jacket',
    name: 'Everyday casual zip-up jacket',
    audience: 'Men',
    category: 'Jackets',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
    match: 88,
    details: 'Cotton blend · Zip closure · Regular fit',
    offers: [
      { store: 'Myntra', price: 1799 },
      { store: 'Amazon', price: 1599 },
      { store: 'Meesho', price: 1249 },
    ],
  },
  {
    id: 'mens-cotton-tee',
    name: 'Classic cotton crew-neck T-shirt',
    audience: 'Men',
    category: 'T-shirts',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85',
    match: 92,
    details: 'Pure cotton · Crew neck · Regular fit',
    offers: [
      { store: 'Myntra', price: 599 },
      { store: 'Amazon', price: 499 },
      { store: 'Meesho', price: 349 },
    ],
  },
  {
    id: 'mens-slim-jeans',
    name: 'Classic slim-fit denim jeans',
    audience: 'Men',
    category: 'Jeans',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
    match: 90,
    details: 'Stretch denim · Mid rise · Slim fit',
    offers: [
      { store: 'Myntra', price: 1499 },
      { store: 'Amazon', price: 1299 },
      { store: 'Meesho', price: 999 },
    ],
  },
  {
    id: 'mens-chino-trousers',
    name: 'Everyday straight-fit chino trousers',
    audience: 'Men',
    category: 'Trousers',
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=85',
    match: 87,
    details: 'Cotton stretch · Mid rise · Straight fit',
    offers: [
      { store: 'Myntra', price: 1199 },
      { store: 'Amazon', price: 999 },
      { store: 'Meesho', price: 749 },
    ],
  },
  {
    id: 'mens-ethnic-kurta',
    name: 'Classic solid cotton festive kurta',
    audience: 'Men',
    category: 'Kurtas & Ethnic Wear',
    image:
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=85',
    match: 89,
    details: 'Cotton blend · Full sleeves · Straight fit',
    offers: [
      { store: 'Myntra', price: 1299 },
      { store: 'Amazon', price: 1099 },
      { store: 'Meesho', price: 799 },
    ],
  },
  {
    id: 'mens-sneakers',
    name: 'Versatile everyday low-top sneakers',
    audience: 'Men',
    category: 'Footwear',
    image:
      'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85',
    match: 88,
    details: 'Lightweight · Lace-up · Cushioned footbed',
    offers: [
      { store: 'Myntra', price: 1699 },
      { store: 'Amazon', price: 1499 },
      { store: 'Meesho', price: 1099 },
    ],
  },
  {
    id: 'mens-wallet',
    name: 'Everyday slim-fold wallet',
    audience: 'Men',
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
    match: 85,
    details: 'Vegan leather · Multiple card slots · Compact',
    offers: [
      { store: 'Myntra', price: 799 },
      { store: 'Amazon', price: 699 },
      { store: 'Meesho', price: 449 },
    ],
  },
  {
    id: 'kids-graphic-tee',
    name: 'Colourful kids graphic T-shirt',
    audience: 'Kids & Baby',
    category: 'Boys Clothing',
    image:
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85',
    match: 93,
    details: 'Soft cotton · Short sleeves · Ages 2–8',
    offers: [
      { store: 'Myntra', price: 499 },
      { store: 'Amazon', price: 599 },
      { store: 'Meesho', price: 349 },
    ],
  },
  {
    id: 'baby-cotton-romper',
    name: 'Soft cotton everyday romper',
    audience: 'Kids & Baby',
    category: 'Baby Clothing',
    image:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=85',
    match: 90,
    details: 'Gentle cotton · Easy snaps · Ages 0–24 months',
    offers: [
      { store: 'Myntra', price: 699 },
      { store: 'Amazon', price: 549 },
      { store: 'Meesho', price: 399 },
    ],
  },
  {
    id: 'kids-girls-dress',
    name: 'Colourful girls everyday dress',
    audience: 'Kids & Baby',
    category: 'Girls Clothing',
    image:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=85',
    match: 91,
    details: 'Soft cotton · Easy fit · Ages 2–8',
    offers: [
      { store: 'Myntra', price: 799 },
      { store: 'Amazon', price: 699 },
      { store: 'Meesho', price: 499 },
    ],
  },
  {
    id: 'kids-sneakers',
    name: 'Lightweight kids everyday sneakers',
    audience: 'Kids & Baby',
    category: 'Kids Footwear',
    image:
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=85',
    match: 88,
    details: 'Lightweight · Easy fastening · Growing feet fit',
    offers: [
      { store: 'Myntra', price: 999 },
      { store: 'Amazon', price: 849 },
      { store: 'Meesho', price: 599 },
    ],
  },
  {
    id: 'baby-soft-blanket',
    name: 'Soft cotton baby blanket',
    audience: 'Kids & Baby',
    category: 'Baby Accessories',
    image:
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=85',
    match: 86,
    details: 'Gentle cotton · Lightweight · Pram friendly',
    offers: [
      { store: 'Myntra', price: 899 },
      { store: 'Amazon', price: 749 },
      { store: 'Meesho', price: 549 },
    ],
  },
];

function marketplaceSearchUrl(store: string, productName: string) {
  const query = encodeURIComponent(productName);
  const searchUrls: Record<string, string> = {
    Amazon: `https://www.amazon.in/s?k=${query}`,
    Meesho: `https://www.meesho.com/search?q=${query}`,
    Myntra: `https://www.myntra.com/search?q=${query}`,
  };
  return searchUrls[store] ?? null;
}

const demoProducts: Product[] = sampleProducts.map((product) => ({
  ...product,
  offers: product.offers.map((offer) => ({
    ...offer,
    url: marketplaceSearchUrl(offer.store, product.name),
  })),
}));

const audiences = ['All', 'Women', 'Men', 'Kids & Baby'];
const subcategoriesByAudience: Record<string, string[]> = {
  Women: [
    'Kurtas & Kurtis',
    'Sarees',
    'Ethnic Sets',
    'Dresses',
    'Tops & T-shirts',
    'Jeans & Trousers',
    'Co-ord Sets',
    'Skirts',
    'Footwear',
    'Bags & Accessories',
  ],
  Men: [
    'Shirts',
    'T-shirts',
    'Jeans',
    'Trousers',
    'Kurtas & Ethnic Wear',
    'Jackets',
    'Footwear',
    'Accessories',
  ],
  'Kids & Baby': [
    'Boys Clothing',
    'Girls Clothing',
    'Baby Clothing',
    'Kids Footwear',
    'Baby Accessories',
  ],
};
const allSubcategories = [
  ...new Set(Object.values(subcategoriesByAudience).flat()),
];
const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;
const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080');

function parseOffers(value: unknown): Offer[] {
  if (!Array.isArray(value)) {
    throw new Error('The product search service returned invalid seller offers.');
  }
  const responseOffers: unknown[] = value;
  return responseOffers.map((offer) => {
    if (
      typeof offer !== 'object' ||
      offer === null ||
      !('store' in offer) ||
      typeof offer.store !== 'string' ||
      !('price' in offer) ||
      typeof offer.price !== 'number' ||
      !Number.isFinite(offer.price) ||
      offer.price <= 0
    ) {
      throw new Error('The product search service returned an invalid seller offer.');
    }
    let url: string | null = null;
    if ('url' in offer && typeof offer.url === 'string') {
      try {
        const parsedUrl = new URL(offer.url);
        if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
          url = offer.url;
        }
      } catch {
        url = null;
      }
    }
    return {
      store: offer.store,
      price: offer.price,
      url,
    };
  });
}

function parseProducts(value: unknown): Product[] {
  if (!Array.isArray(value)) {
    throw new Error('The product search service returned an unexpected response.');
  }
  const responseProducts: unknown[] = value;
  return responseProducts.map((item) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      !('id' in item) ||
      typeof item.id !== 'string' ||
      !('name' in item) ||
      typeof item.name !== 'string' ||
      !('audience' in item) ||
      typeof item.audience !== 'string' ||
      !('category' in item) ||
      typeof item.category !== 'string' ||
      !('image' in item) ||
      typeof item.image !== 'string' ||
      !('details' in item) ||
      typeof item.details !== 'string' ||
      !('offers' in item) ||
      !Array.isArray(item.offers) ||
      item.offers.length === 0
    ) {
      throw new Error('The product search service returned an invalid product.');
    }
    const offers = parseOffers(item.offers);
    return {
      id: item.id,
      name: item.name,
      audience: item.audience,
      category: item.category,
      image: item.image,
      match:
        'match' in item && typeof item.match === 'number' ? item.match : null,
      details: item.details,
      offers,
      offersToken:
        'offersToken' in item && typeof item.offersToken === 'string'
          ? item.offersToken
          : null,
    };
  });
}

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const [activeAudience, setActiveAudience] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All styles');
  const [query, setQuery] = useState('');
  const [sortByPrice, setSortByPrice] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [demoData, setDemoData] = useState(true);
  const [resultMessage, setResultMessage] = useState(
    'Sample listings are shown. Search stores to check live results.',
  );
  const [isSearching, setIsSearching] = useState(false);
  const [additionalOffers, setAdditionalOffers] = useState<Record<string, Offer[]>>({});
  const [expandedOffersId, setExpandedOffersId] = useState<string | null>(null);
  const [loadingOffersId, setLoadingOffersId] = useState<string | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authMode, setAuthMode] = useState<'sign-in' | 'create-account'>('sign-in');
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToAuth(
      (user) => {
        setSignedInEmail(user?.email ?? null);
        setAuthChecking(false);
        setAuthError(null);
      },
      (error) => {
        setAuthChecking(false);
        setAuthError(error.message);
      },
    );
  }, []);

  const availableCategories = useMemo(
    () => [
      'All styles',
      ...(activeAudience === 'All'
        ? allSubcategories
        : subcategoriesByAudience[activeAudience]),
    ],
    [activeAudience],
  );

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (searchResults ?? demoProducts)
      .filter((product) => {
        const matchesAudience =
          activeAudience === 'All' || product.audience === activeAudience;
        const matchesCategory = activeCategory === 'All styles' ||
          product.category === activeCategory;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          `${product.name} ${product.details}`.toLowerCase().includes(normalizedQuery);
        const matchesSaved = !showSavedOnly || savedIds.includes(product.id);
        return matchesAudience && matchesCategory && matchesQuery && matchesSaved;
      })
      .sort((first, second) => {
        if (sortByPrice) {
          return (
            Math.min(...first.offers.map((offer) => offer.price)) -
            Math.min(...second.offers.map((offer) => offer.price))
          );
        }
        return (second.match ?? 0) - (first.match ?? 0);
      });
  }, [
    activeAudience,
    activeCategory,
    query,
    savedIds,
    searchResults,
    showSavedOnly,
    sortByPrice,
  ]);

  const searchStores = async () => {
    setIsSearching(true);
    setUploadError(null);
    try {
      const parameters = new URLSearchParams({
        query,
        audience:
          activeAudience === 'All'
            ? 'all'
            : activeAudience === 'Kids & Baby'
              ? 'kids'
              : activeAudience.toLowerCase(),
        category: activeCategory === 'All styles' ? '' : activeCategory,
        sort: sortByPrice ? 'price' : 'match',
      });
      const response = await fetch(`${apiBaseUrl}/api/products?${parameters.toString()}`);
      const body: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof body === 'object' && body !== null && 'error' in body
            ? String(body.error)
            : `Product search failed (${response.status}).`;
        throw new Error(message);
      }
      if (typeof body !== 'object' || body === null || !('products' in body)) {
        throw new Error('The product search service returned an unexpected response.');
      }
      setSearchResults(parseProducts(body.products));
      setAdditionalOffers({});
      setExpandedOffersId(null);
      setDemoData('demoData' in body ? Boolean(body.demoData) : false);
      setResultMessage('message' in body ? String(body.message) : 'Search results loaded.');
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Could not reach the Fashion Lens API. Check that the backend is running.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  const searchByPhoto = async () => {
    if (!uploadedImage || isSearching) return;
    setIsSearching(true);
    setUploadError(null);
    try {
      let compressed = await ImageManipulator.ImageManipulator
        .manipulate(uploadedImage, { maxWidth: 900, maxHeight: 900 })
        .renderAsync()
        .then((image) =>
          image.saveAsync({
            compress: 0.55,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }),
        );
      if ((compressed.base64?.length ?? 0) * 0.75 > 500 * 1024) {
        compressed = await ImageManipulator.ImageManipulator
          .manipulate(uploadedImage, { maxWidth: 650, maxHeight: 650 })
          .renderAsync()
          .then((image) =>
            image.saveAsync({
              compress: 0.35,
              format: ImageManipulator.SaveFormat.JPEG,
              base64: true,
            }),
          );
      }
      if (!compressed.base64 || compressed.base64.length * 0.75 > 500 * 1024) {
        throw new Error('Could not reduce this image below 500 KB. Try a smaller photo.');
      }

      const formData = new FormData();
      if (Platform.OS === 'web') {
        const imageBlob = await fetch(compressed.uri).then((response) => response.blob());
        formData.append('image', imageBlob, 'fashion-image.jpg');
      } else {
        formData.append(
          'image',
          {
            uri: compressed.uri,
            name: 'fashion-image.jpg',
            type: 'image/jpeg',
          } as unknown as Blob,
        );
      }
      formData.append(
        'audience',
        activeAudience === 'All'
          ? 'all'
          : activeAudience === 'Kids & Baby'
            ? 'kids'
            : activeAudience.toLowerCase(),
      );
      const response = await fetch(`${apiBaseUrl}/api/search/image`, {
        method: 'POST',
        body: formData,
      });
      const body: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof body === 'object' && body !== null && 'error' in body
            ? String(body.error)
            : `Image search failed (${response.status}).`;
        throw new Error(message);
      }
      if (typeof body !== 'object' || body === null || !('matches' in body)) {
        throw new Error('The image search service returned an unexpected response.');
      }
      setSearchResults(parseProducts(body.matches));
      setAdditionalOffers({});
      setExpandedOffersId(null);
      setDemoData('demoData' in body ? Boolean(body.demoData) : false);
      setResultMessage('message' in body ? String(body.message) : 'Image matches loaded.');
      setActiveCategory('All styles');
      setQuery('');
      setShowSavedOnly(false);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Could not search this photo. Check the API connection and try again.',
      );
    } finally {
      setIsSearching(false);
    }
  };

  const openOffer = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      setUploadError('Could not open the seller link. Please try again.');
    }
  };

  const submitEmailAuth = async () => {
    const email = emailInput.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthError('Enter a valid email address.');
      return;
    }
    if (passwordInput.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthBusy(true);
    setAuthError(null);
    setAuthNotice(null);
    try {
      if (authMode === 'create-account') {
        await createEmailAccount(email, passwordInput);
      } else {
        await signInWithEmail(email, passwordInput);
      }
    } catch (error) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? error.code
          : null;
      const message =
        typeof code === 'string'
          ? ({
              'auth/email-already-in-use': 'An account already exists for this email. Sign in instead.',
              'auth/invalid-credential': 'Email or password is incorrect.',
              'auth/invalid-email': 'Enter a valid email address.',
              'auth/operation-not-allowed':
                'Email/password sign-in is disabled. Enable it in Firebase Authentication settings.',
              'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
              'auth/user-disabled': 'This account has been disabled.',
              'auth/user-not-found': 'No account found for this email. Create an account first.',
              'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
              'auth/wrong-password': 'Email or password is incorrect.',
              'auth/network-request-failed': 'Could not connect. Check your internet and try again.',
            } as Record<string, string>)[code]
          : null;
      setAuthError(
        message ??
          (error instanceof Error ? error.message : 'Could not authenticate. Please try again.'),
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const requestPasswordReset = async () => {
    const email = emailInput.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthError('Enter your email address first.');
      return;
    }

    setAuthBusy(true);
    setAuthError(null);
    setAuthNotice(null);
    try {
      await sendPasswordReset(email);
      setAuthNotice(`Password reset instructions were sent to ${email}.`);
    } catch (error) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? error.code
          : null;
      const message =
        code === 'auth/user-not-found'
          ? 'No account found for this email.'
          : code === 'auth/invalid-email'
            ? 'Enter a valid email address.'
            : code === 'auth/operation-not-allowed'
              ? 'Email/password sign-in is disabled in Firebase Authentication settings.'
              : error instanceof Error
                ? error.message
                : 'Could not send password reset email.';
      setAuthError(message);
    } finally {
      setAuthBusy(false);
    }
  };

  const signOutCurrentUser = async () => {
    setAuthError(null);
    try {
      await signOutUser();
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Could not sign out. Please try again.',
      );
    }
  };

  const loadOtherOffers = async (product: Product) => {
    if (!product.offersToken || loadingOffersId) return;
    setComparisonError(null);
    if (additionalOffers[product.id]) {
      setExpandedOffersId((current) => current === product.id ? null : product.id);
      return;
    }

    setLoadingOffersId(product.id);
    try {
      const parameters = new URLSearchParams({ pageToken: product.offersToken });
      const response = await fetch(`${apiBaseUrl}/api/products/offers?${parameters.toString()}`);
      const body: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof body === 'object' && body !== null && 'error' in body
            ? String(body.error)
            : `Seller comparison failed (${response.status}).`;
        throw new Error(message);
      }
      if (typeof body !== 'object' || body === null || !('offers' in body)) {
        throw new Error('The seller comparison service returned an unexpected response.');
      }
      const offers = parseOffers(body.offers);
      if (offers.length === 0) {
        setComparisonError(`No additional seller offers were found for “${product.name}”.`);
        return;
      }
      setAdditionalOffers((current) => ({ ...current, [product.id]: offers }));
      setExpandedOffersId(product.id);
    } catch (error) {
      setComparisonError(
        error instanceof Error ? error.message : 'Could not load other seller offers.',
      );
    } finally {
      setLoadingOffersId(null);
    }
  };

  const choosePhoto = async () => {
    setUploadError(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled) {
        setUploadedImage(result.assets[0].uri);
        setSearchResults(null);
        setDemoData(true);
        setResultMessage('Sample listings are shown until you search stores.');
      }
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? `We couldn't open your photos: ${error.message}`
          : "We couldn't open your photos. Please try again.",
      );
    }
  };

  const toggleSaved = (id: string) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );
  };

  if (!signedInEmail) {
    return (
      <View style={styles.app}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.loginPage}>
          <View style={styles.loginCard}>
            <View style={styles.loginBrand}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>f</Text>
              </View>
              <Text style={styles.brandName}>fashion lens</Text>
            </View>
            <View style={styles.loginIllustration}>
              <Image
                accessibilityLabel="Fashion inspiration"
                source={{
                  uri: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
                }}
                style={styles.loginImage}
              />
              <View style={styles.loginImageShade} />
              <Text style={styles.loginImageCaption}>YOUR STYLE, FOUND</Text>
            </View>
            <Text style={styles.loginEyebrow}>WELCOME TO FASHION LENS</Text>
            <Text style={styles.loginTitle}>
              {authMode === 'create-account' ? 'Join Fashion Lens.' : 'Find the look.'}
              {'\n'}
              <Text style={styles.loginTitleAccent}>
                {authMode === 'create-account' ? 'Your style starts here.' : 'Compare your price.'}
              </Text>
            </Text>
            <Text style={styles.loginDescription}>
              {authMode === 'create-account'
                ? 'Create an account to discover styles and compare sellers.'
                : 'Sign in to discover styles and compare sellers.'}
            </Text>

            <TextInput
              accessibilityLabel="Email address"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={(value) => {
                setEmailInput(value);
                setAuthError(null);
                setAuthNotice(null);
              }}
              placeholder="Email address"
              placeholderTextColor={colors.muted}
              style={styles.authInput}
              value={emailInput}
            />
            <TextInput
              accessibilityLabel="Password"
              autoCapitalize="none"
              autoComplete={authMode === 'create-account' ? 'new-password' : 'current-password'}
              onChangeText={(value) => {
                setPasswordInput(value);
                setAuthError(null);
              }}
              placeholder={authMode === 'create-account' ? 'Create password (6+ characters)' : 'Password'}
              placeholderTextColor={colors.muted}
              secureTextEntry
              style={[styles.authInput, styles.authPasswordInput]}
              value={passwordInput}
            />

            {authError && <Text style={styles.authError}>{authError}</Text>}
            {authNotice && <Text style={styles.authNotice}>{authNotice}</Text>}

            <Pressable
              accessibilityRole="button"
              disabled={authBusy || authChecking}
              onPress={submitEmailAuth}
              style={[
                styles.loginButton,
                (authBusy || authChecking) && styles.disabledButton,
              ]}
            >
              <Text style={styles.loginButtonText}>
                {authChecking
                  ? 'Checking sign-in…'
                  : authBusy
                    ? authMode === 'create-account' ? 'Creating account…' : 'Signing in…'
                    : authMode === 'create-account' ? 'Create account' : 'Sign in'}
              </Text>
            </Pressable>

            {authMode === 'sign-in' && (
              <Pressable
                accessibilityRole="button"
                disabled={authBusy}
                onPress={requestPasswordReset}
                style={styles.authSecondaryAction}
              >
                <Text style={styles.otpActionText}>Forgot password?</Text>
              </Pressable>
            )}
            <View style={styles.authModeSwitch}>
              <Text style={styles.authModePrompt}>
                {authMode === 'create-account' ? 'Already have an account?' : 'New to Fashion Lens?'}
              </Text>
              <Pressable
                accessibilityRole="button"
                disabled={authBusy}
                onPress={() => {
                  setAuthMode(authMode === 'create-account' ? 'sign-in' : 'create-account');
                  setAuthError(null);
                  setAuthNotice(null);
                }}
              >
                <Text style={styles.otpActionText}>
                  {authMode === 'create-account' ? 'Sign in' : 'Create account'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.authFinePrint}>
              Email and password sign-in is enabled for this app. You can reset your password by email.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fashion Lens home"
            onPress={() => {
              setShowSavedOnly(false);
              setActiveAudience('All');
              setActiveCategory('All styles');
              setQuery('');
            }}
            style={styles.brand}
          >
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>f</Text>
            </View>
            <Text style={styles.brandName}>fashion lens</Text>
          </Pressable>
          <View style={styles.headerLinks}>
            {width >= 620 && (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setShowSavedOnly(false);
                    setActiveAudience('All');
                    setActiveCategory('All styles');
                    setQuery('');
                  }}
                  style={styles.headerLink}
                >
                  <Text style={styles.headerLinkText}>Discover</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setShowSavedOnly((current) => !current)}
                  style={styles.headerLink}
                >
                  <Text style={styles.headerLinkText}>
                    Saved{savedIds.length > 0 ? ` (${savedIds.length})` : ''}
                  </Text>
                </Pressable>
              </>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={signOutCurrentUser}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>Sign out</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.hero, isWide && styles.heroWide]}>
          <View style={[styles.heroCopy, isWide && styles.heroCopyWide]}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowText}>YOUR NEW WAY TO SHOP</Text>
            </View>
            <Text style={[styles.heroTitle, !isWide && styles.heroTitleCompact]}>
              Love the look.{'\n'}
              <Text style={styles.heroTitleAccent}>Find your price.</Text>
            </Text>
            <Text style={styles.heroDescription}>
              Spot an outfit you love? Upload a photo and compare similar finds across your
              favourite stores.
            </Text>
            <View style={styles.heroNote}>
              <Text style={styles.heroNoteIcon}>✳</Text>
              <Text style={styles.heroNoteText}>
                One picture. More ways to make it yours.
              </Text>
            </View>
          </View>

          <View style={[styles.uploadCard, isWide && styles.uploadCardWide]}>
            <View style={styles.uploadImageWrap}>
              <Image
                accessibilityLabel={
                  uploadedImage ? 'Your selected fashion photo' : 'Sample kurta photo'
                }
                source={{
                  uri:
                    uploadedImage ??
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
                }}
                style={styles.uploadImage}
              />
              <View style={styles.imageBadge}>
                <Text style={styles.imageBadgeText}>
                  {uploadedImage ? 'YOUR PHOTO' : 'A LITTLE STYLE INSPIRATION'}
                </Text>
              </View>
            </View>
            <View style={styles.uploadContent}>
              <View style={styles.uploadCopy}>
                <Text style={styles.uploadTitle}>
                  {uploadedImage ? 'Photo is ready' : 'Start with a photo'}
                </Text>
                <Text style={styles.uploadDescription}>
                  {uploadedImage
                    ? 'Your photo is previewed on this device.'
                    : 'Choose a look from your device to get started.'}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={choosePhoto}
                style={styles.uploadButton}
              >
                <Text style={styles.uploadButtonText}>
                  {uploadedImage ? 'Choose another photo' : '↑  Upload a photo'}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.uploadFootnote}>JPG or PNG · Photo preview stays on this device</Text>
            {uploadedImage && (
              <Pressable
                accessibilityRole="button"
                disabled={isSearching}
                onPress={searchByPhoto}
                style={[styles.photoSearchButton, isSearching && styles.disabledButton]}
              >
                <Text style={styles.photoSearchButtonText}>
                  {isSearching ? 'Searching…' : 'Search this photo'}
                </Text>
              </Pressable>
            )}
            {uploadedImage && (
              <Text style={styles.privacyNote}>
                Tapping Search sends your photo to the backend. If live search is enabled, it is
                forwarded to SerpApi and Google Lens.
              </Text>
            )}
            {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}
          </View>
        </View>

        <View style={styles.content}>
          {authError && <Text style={styles.errorText}>{authError}</Text>}
          <View style={styles.sectionIntro}>
            <View>
              <Text style={styles.sectionEyebrow}>A GOOD PLACE TO START</Text>
              <Text style={styles.sectionTitle}>
                {showSavedOnly
                  ? 'Your saved styles'
                  : activeAudience === 'All'
                    ? 'Looks you might love'
                    : `Looks for ${activeAudience.toLowerCase()}`}
              </Text>
              <Text style={styles.sectionSubtitle}>
                Browse fashion by who you are shopping for.
              </Text>
            </View>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>
                {demoData ? 'SAMPLE LISTINGS' : 'LIVE SEARCH RESULTS'}
              </Text>
            </View>
          </View>
          <Text style={styles.resultMessage}>{resultMessage}</Text>
          {demoData && (
            <Text style={styles.sampleDisclaimer}>
              Sample prices are examples. Search a store to see its current matching listings.
            </Text>
          )}
          {comparisonError && <Text style={styles.errorText}>{comparisonError}</Text>}

          <View style={styles.controls}>
            <View style={styles.audienceSection}>
              <Text style={styles.audienceLabel}>SHOP FOR</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.audienceList}
              >
                {audiences.map((audience) => {
                  const selected = activeAudience === audience;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      key={audience}
                      onPress={() => {
                        setActiveAudience(audience);
                        setActiveCategory('All styles');
                        setShowSavedOnly(false);
                      }}
                      style={[
                        styles.audienceChip,
                        selected && styles.audienceChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.audienceChipText,
                          selected && styles.audienceChipTextSelected,
                        ]}
                      >
                        {audience}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {availableCategories.map((category) => {
                const selected = activeCategory === category;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={category}
                    onPress={() => setActiveCategory(category)}
                    style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={styles.searchAndSort}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>⌕</Text>
                <TextInput
                  accessibilityLabel="Search fashion styles"
                  onChangeText={(text) => {
                    setQuery(text);
                    setShowSavedOnly(false);
                  }}
                  placeholder="Search styles"
                  placeholderTextColor={colors.muted}
                  style={styles.searchInput}
                  value={query}
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: sortByPrice }}
                onPress={() => setSortByPrice((current) => !current)}
                style={styles.sortButton}
              >
                <Text style={styles.sortButtonText}>
                  {sortByPrice ? 'Lowest price ↑' : 'Best match ↓'}
                </Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={isSearching}
              onPress={searchStores}
              style={[styles.storeSearchButton, isSearching && styles.disabledButton]}
            >
              <Text style={styles.storeSearchButtonText}>
                {isSearching ? 'Searching stores…' : 'Search stores'}
              </Text>
            </Pressable>
          </View>

          {visibleProducts.length > 0 ? (
            <View style={styles.productGrid}>
              {visibleProducts.map((product) => {
                const productOffers =
                  expandedOffersId === product.id && additionalOffers[product.id]
                    ? additionalOffers[product.id]
                    : product.offers;
                const sortedOffers = [...productOffers].sort(
                  (first, second) => first.price - second.price,
                );
                const lowestPrice = sortedOffers[0].price;
                const highestPrice = Math.max(...productOffers.map((offer) => offer.price));
                const saved = savedIds.includes(product.id);

                return (
                  <View
                    key={product.id}
                    style={[
                      styles.productCard,
                      {
                        width:
                          width >= 1120 ? '31.8%' : width >= 650 ? '48.5%' : '100%',
                      },
                    ]}
                  >
                    <View style={styles.productImageWrap}>
                      <Image
                        accessibilityLabel={product.name}
                        source={{ uri: product.image }}
                        style={styles.productImage}
                      />
                      {product.match !== null && (
                        <View style={styles.matchBadge}>
                          <Text style={styles.matchBadgeText}>{product.match}% match</Text>
                        </View>
                      )}
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          saved ? `Remove ${product.name} from saved` : `Save ${product.name}`
                        }
                        accessibilityState={{ selected: saved }}
                        onPress={() => toggleSaved(product.id)}
                        style={styles.saveButton}
                      >
                        <Text style={[styles.saveIcon, saved && styles.saveIconActive]}>
                          {saved ? '♥' : '♡'}
                        </Text>
                      </Pressable>
                    </View>
                    <View style={styles.productInfo}>
                      <View style={styles.productNameRow}>
                        <Text numberOfLines={2} style={styles.productName}>
                          {product.name}
                        </Text>
                        <Text style={styles.bestPrice}>{formatPrice(lowestPrice)}</Text>
                      </View>
                      <Text style={styles.productDetails}>{product.details}</Text>
                      <View style={styles.priceSummary}>
                        <Text style={styles.priceSummaryText}>
                          {productOffers.length}{' '}
                          {productOffers.length === 1 ? 'seller' : 'sellers'}
                        </Text>
                        {productOffers.length > 1 && (
                          <>
                            <Text style={styles.priceSummaryDot}>·</Text>
                            <Text style={styles.priceSaving}>
                              Save up to {formatPrice(highestPrice - lowestPrice)}
                            </Text>
                          </>
                        )}
                      </View>
                      {product.offersToken && (
                        <Pressable
                          accessibilityRole="button"
                          disabled={loadingOffersId !== null}
                          onPress={() => void loadOtherOffers(product)}
                          style={[
                            styles.compareSellersButton,
                            loadingOffersId !== null && styles.disabledButton,
                          ]}
                        >
                          <Text style={styles.compareSellersButtonText}>
                            {loadingOffersId === product.id
                              ? 'Loading seller offers…'
                              : expandedOffersId === product.id
                                ? 'Hide seller offers'
                                : additionalOffers[product.id]
                                  ? 'Show seller links'
                                  : 'Load seller prices & product links · 1 search'}
                          </Text>
                        </Pressable>
                      )}
                      <View style={styles.offerList}>
                        {sortedOffers.map((offer, index) => (
                          <View key={offer.store} style={styles.offerRow}>
                            <Text style={styles.storeName}>{offer.store}</Text>
                            <View style={styles.offerPriceGroup}>
                              {index === 0 && (
                                <Text style={styles.lowestLabel}>LOWEST</Text>
                              )}
                              <Text style={styles.offerPrice}>{formatPrice(offer.price)}</Text>
                            </View>
                            {offer.url && (
                              <Pressable
                                accessibilityRole="link"
                                accessibilityLabel={`Open this product on ${offer.store}`}
                                onPress={() => {
                                  if (offer.url) void openOffer(offer.url);
                                }}
                                style={styles.retailerLinkButton}
                              >
                                <Text style={styles.retailerLinkText}>
                                  {demoData
                                    ? `Search ${offer.store} ↗`
                                    : `Shop on ${offer.store} ↗`}
                                </Text>
                              </Pressable>
                            )}
                            {!offer.url && (
                              <Text style={styles.retailerUnavailableText}>
                                No direct link
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateMark}>⌕</Text>
              <Text style={styles.emptyStateTitle}>No styles found just yet</Text>
              <Text style={styles.emptyStateText}>
                Try another search or explore all styles.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setActiveCategory('All styles');
                  setQuery('');
                  setShowSavedOnly(false);
                }}
                style={styles.emptyStateButton}
              >
                <Text style={styles.emptyStateButtonText}>Explore all styles</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.howItWorks}>
            <View style={styles.howItWorksHeading}>
              <Text style={styles.sectionEyebrow}>SHOP WITH A LITTLE MORE CLARITY</Text>
              <Text style={styles.sectionTitle}>Your next favourite, in three steps</Text>
            </View>
            <View style={[styles.steps, isWide && styles.stepsWide]}>
              {[
                ['01', 'Pick a photo', 'Choose an outfit photo from your device.'],
                ['02', 'Explore similar looks', 'See example styles and store prices together.'],
                ['03', 'Choose what feels right', 'Compare the details before you decide.'],
              ].map(([number, title, description]) => (
                <View key={number} style={[styles.step, isWide && styles.stepWide]}>
                  <Text style={styles.stepNumber}>{number}</Text>
                  <Text style={styles.stepTitle}>{title}</Text>
                  <Text style={styles.stepDescription}>{description}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBrand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>f</Text>
            </View>
            <Text style={styles.brandName}>fashion lens</Text>
          </View>
          <Text style={styles.footerText}>
            A little inspiration for the way you like to shop.
          </Text>
          <Text style={styles.footerNote}>
            Live prices come from search results; sample listings are for demonstration only.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const colors = {
  ink: '#252821',
  muted: '#77796F',
  green: '#254D3D',
  greenDark: '#173B2D',
  canvas: '#F8F7F3',
  white: '#FFFFFF',
  line: '#E9E7E0',
  coral: '#C87556',
  paleGreen: '#E8EEE7',
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  loginPage: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginCard: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 24,
  },
  loginBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 20,
  },
  loginIllustration: {
    height: 170,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 13,
    backgroundColor: colors.paleGreen,
    marginBottom: 24,
  },
  loginImage: {
    width: '100%',
    height: '100%',
  },
  loginImageShade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(23,59,45,0.24)',
  },
  loginImageCaption: {
    position: 'absolute',
    left: 15,
    bottom: 14,
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  loginEyebrow: {
    color: colors.coral,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 9,
  },
  loginTitle: {
    color: colors.ink,
    fontFamily: 'Georgia',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 37,
    letterSpacing: -0.6,
  },
  loginTitleAccent: {
    color: colors.green,
  },
  loginDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  authInput: {
    height: 50,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    color: colors.ink,
    fontSize: 13,
    paddingHorizontal: 14,
  },
  authPasswordInput: {
    marginTop: 10,
  },
  authError: {
    color: '#A13E33',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  authNotice: {
    color: colors.green,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 10,
    marginTop: 16,
    paddingVertical: 14,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  authSecondaryAction: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  authModeSwitch: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    marginTop: 14,
  },
  authModePrompt: {
    color: colors.muted,
    fontSize: 11,
  },
  otpActionText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 5,
  },
  authFinePrint: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 17,
  },
  page: {
    minHeight: '100%',
  },
  header: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    minHeight: 78,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 26,
    fontFamily: 'Georgia',
    fontWeight: '700',
  },
  brandName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  headerLink: {
    paddingVertical: 10,
  },
  headerLinkText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  headerButton: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  headerButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  hero: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingTop: 38,
    paddingBottom: 42,
    gap: 32,
  },
  heroWide: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 58,
    gap: 56,
  },
  heroCopy: {
    gap: 0,
  },
  heroCopyWide: {
    flex: 1,
    paddingRight: 16,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.coral,
  },
  eyebrowText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  heroTitle: {
    maxWidth: 560,
    color: colors.ink,
    fontFamily: 'Georgia',
    fontSize: 50,
    fontWeight: '700',
    letterSpacing: -1.8,
    lineHeight: 57,
  },
  heroTitleCompact: {
    fontSize: 40,
    lineHeight: 47,
  },
  heroTitleAccent: {
    color: colors.green,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  heroDescription: {
    maxWidth: 460,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 18,
  },
  heroNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 24,
  },
  heroNoteIcon: {
    color: colors.coral,
    fontSize: 18,
  },
  heroNoteText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '600',
  },
  uploadCard: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#3E443A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 3,
  },
  uploadCardWide: {
    flex: 1,
    maxWidth: 500,
  },
  uploadImageWrap: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.paleGreen,
  },
  uploadImage: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  imageBadgeText: {
    color: colors.green,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 7,
    paddingTop: 17,
  },
  uploadCopy: {
    flex: 1,
  },
  uploadTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  uploadDescription: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  uploadButton: {
    backgroundColor: colors.green,
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  uploadFootnote: {
    color: colors.muted,
    fontSize: 10,
    paddingHorizontal: 7,
    paddingTop: 12,
    paddingBottom: 3,
  },
  photoSearchButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 9,
    marginHorizontal: 7,
    marginTop: 10,
    paddingVertical: 12,
  },
  photoSearchButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  privacyNote: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    paddingHorizontal: 7,
    paddingTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: '#A13E33',
    fontSize: 12,
    paddingHorizontal: 7,
    paddingTop: 8,
  },
  content: {
    width: '100%',
    maxWidth: 1224,
    alignSelf: 'center',
    paddingHorizontal: 28,
  },
  sectionIntro: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 14,
    marginBottom: 22,
  },
  sectionEyebrow: {
    color: colors.coral,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  demoBadge: {
    backgroundColor: '#F1E9E2',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: 3,
  },
  demoBadgeText: {
    color: '#95634D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  resultMessage: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
    marginTop: -14,
  },
  sampleDisclaimer: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 16,
    marginTop: -10,
  },
  compareSellersButton: {
    alignItems: 'center',
    borderColor: colors.green,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 9,
  },
  compareSellersButtonText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '700',
  },
  controls: {
    gap: 15,
    marginBottom: 20,
  },
  audienceSection: {
    gap: 9,
  },
  audienceLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  audienceList: {
    gap: 9,
    paddingRight: 16,
  },
  audienceChip: {
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  audienceChipSelected: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  audienceChipText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  audienceChipTextSelected: {
    color: colors.white,
  },
  categoryList: {
    gap: 9,
    paddingRight: 16,
  },
  categoryChip: {
    borderColor: colors.line,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  categoryChipSelected: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  categoryChipText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: colors.white,
  },
  searchAndSort: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    minWidth: 0,
    flex: 1,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 9,
    backgroundColor: colors.white,
    paddingHorizontal: 11,
  },
  searchIcon: {
    color: colors.muted,
    fontSize: 23,
    lineHeight: 25,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 12,
  },
  sortButton: {
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 9,
    backgroundColor: colors.white,
    paddingHorizontal: 13,
  },
  sortButtonText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  storeSearchButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 9,
    paddingVertical: 12,
  },
  storeSearchButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  productCard: {
    overflow: 'hidden',
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  productImageWrap: {
    width: '100%',
    height: 220,
    overflow: 'hidden',
    backgroundColor: colors.paleGreen,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  matchBadge: {
    position: 'absolute',
    left: 11,
    top: 11,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  matchBadgeText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '800',
  },
  saveButton: {
    position: 'absolute',
    right: 10,
    top: 9,
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  saveIcon: {
    color: colors.ink,
    fontSize: 21,
    lineHeight: 24,
  },
  saveIconActive: {
    color: colors.coral,
  },
  productInfo: {
    padding: 14,
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  productName: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  bestPrice: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '800',
  },
  productDetails: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 6,
  },
  priceSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 9,
  },
  priceSummaryText: {
    color: colors.muted,
    fontSize: 10,
  },
  priceSummaryDot: {
    color: colors.muted,
    fontSize: 12,
  },
  priceSaving: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '700',
  },
  offerList: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
  },
  offerRow: {
    minHeight: 42,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 8,
    rowGap: 4,
    paddingVertical: 7,
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
  },
  storeName: {
    flex: 1,
    color: colors.ink,
    fontSize: 11,
    fontWeight: '600',
  },
  offerPriceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  lowestLabel: {
    color: colors.green,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  offerPrice: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '700',
  },
  retailerUnavailableText: {
    color: colors.muted,
    fontSize: 10,
  },
  retailerLinkButton: {
    width: '100%',
    paddingTop: 3,
  },
  retailerLinkText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyStateMark: {
    color: colors.coral,
    fontSize: 34,
    marginBottom: 10,
  },
  emptyStateTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyStateText: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyStateButton: {
    marginTop: 17,
    borderRadius: 9,
    backgroundColor: colors.green,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  howItWorks: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    marginTop: 54,
    paddingTop: 36,
    paddingBottom: 48,
  },
  howItWorksHeading: {
    marginBottom: 21,
  },
  steps: {
    gap: 14,
  },
  stepsWide: {
    flexDirection: 'row',
  },
  step: {
    minHeight: 135,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 13,
    backgroundColor: colors.white,
    padding: 17,
  },
  stepWide: {
    flex: 1,
  },
  stepNumber: {
    color: colors.coral,
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '700',
  },
  stepTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 12,
  },
  stepDescription: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#F0EFE9',
    paddingHorizontal: 24,
    paddingVertical: 25,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  footerText: {
    color: colors.ink,
    fontSize: 11,
    marginTop: 12,
  },
  footerNote: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 8,
  },
});
