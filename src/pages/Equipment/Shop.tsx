import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'motion/react';
import { ShoppingCart, Package, Info, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

interface Product {
  id: string;
  name: string;
  price: number;
  specifications: string;
  photoURL: string;
  category: string;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Olympic Barbell 20kg',
      price: 299,
      specifications: 'High-tensile steel, 1500lb capacity, hard chrome finish.',
      photoURL: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=300&auto=format&fit=crop',
      category: 'Weights'
    },
    {
      id: '2',
      name: 'Adjustable Dumbbells (Pair)',
      price: 450,
      specifications: '5lb to 52.5lb range, easy dial system, space-saving.',
      photoURL: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=300&auto=format&fit=crop',
      category: 'Weights'
    },
    {
      id: '3',
      name: 'Leather Weightlifting Belt',
      price: 85,
      specifications: 'Genuine cowhide, 10mm thickness, stainless steel buckle.',
      photoURL: 'https://images.unsplash.com/photo-1620188467120-cb005e839e55?q=80&w=300&auto=format&fit=crop',
      category: 'Accessories'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(docs.length > 0 ? docs : mockProducts);
      } catch (error) {
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-20 text-center text-zinc-500 uppercase tracking-widest font-black italic">Inventory Check...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2">The Armory</h2>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">Gym Equipment</h1>
        </div>
        <div className="flex space-x-2">
          {['All', 'Weights', 'Cardio', 'Accessories'].map(cat => (
            <button key={cat} className="px-4 py-2 border border-zinc-800 text-xs font-black uppercase tracking-widest hover:border-orange-600 hover:text-orange-600 transition-all">
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-2 mb-4 relative overflow-hidden">
              <div className="h-72 bg-zinc-950 overflow-hidden relative">
                <img
                  src={product.photoURL}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="absolute top-6 left-6 flex space-x-2">
                <span className="bg-orange-600 text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest skew-x-[-12deg]">
                  <span className="flex items-center space-x-1 skew-x-[12deg]">
                    <Tag size={10} />
                    <span>{settings.currency}{product.price}</span>
                  </span>
                </span>
              </div>

              <button 
                onClick={() => addToCart(product)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 flex items-center space-x-2 bg-white text-black px-6 py-3 font-black uppercase italic text-xs tracking-widest transition-all duration-300 shadow-2xl hover:bg-orange-600 hover:text-white"
              >
                <ShoppingCart size={14} />
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="px-4 py-2 text-center">
              <h3 className="text-xl font-black uppercase italic tracking-tight mb-2 group-hover:text-orange-600 transition-colors uppercase">{product.name}</h3>
              <p className="text-zinc-500 text-xs font-medium line-clamp-1 uppercase tracking-wider">{product.specifications}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
