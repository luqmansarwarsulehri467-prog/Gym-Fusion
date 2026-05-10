import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit, X, Save, ShoppingBasket, Tag, Package, Upload } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  price: number;
  specifications: string;
  photoURL: string;
  stock: number;
  category: string;
}

const EquipmentManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (editingProduct.id) {
        const { id, ...rest } = editingProduct;
        await updateDoc(doc(db, 'products', id), rest);
      } else {
        await addDoc(collection(db, 'products'), editingProduct);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('IRREVERSIBLE ACTION: Purge asset data?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert('File size too large. Please upload an image smaller than 800KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingProduct) {
          setEditingProduct({ ...editingProduct, photoURL: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Armory Inventory</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Asset Control & Logistics</p>
        </div>
        <button 
          onClick={() => { setEditingProduct({ name: '', price: 0, specifications: '', photoURL: '', stock: 0, category: 'Supplements' }); setIsModalOpen(true); }}
          className="bg-orange-600 hover:bg-orange-500 px-6 py-3 font-black uppercase italic tracking-widest text-xs transition-all flex items-center space-x-2 skew-x-[-12deg]"
        >
          <Plus className="skew-x-[12deg]" size={16} />
          <span className="skew-x-[12deg]">Register Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 flex flex-col group overflow-hidden">
             <div className="h-40 bg-zinc-950 relative overflow-hidden">
                <img src={p.photoURL} alt="" className="w-full h-full object-cover grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100" referrerPolicy="no-referrer" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600 border border-zinc-800">
                  ${p.price}
                </div>
             </div>
             <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-black uppercase italic text-sm text-white truncate mr-4">{p.name}</h4>
                  <div className="flex space-x-1 shrink-0">
                    <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-2 text-zinc-600 hover:text-white transition-colors"><Edit size={14} /></button>
                    <button onClick={() => deleteProduct(p.id!)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                   <div className="flex items-center space-x-1">
                      <Package size={12} className="text-orange-600" />
                      <span>{p.stock} Units</span>
                   </div>
                   <span>{p.category}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-xl relative z-10 overflow-hidden"
            >
              <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-black uppercase italic tracking-tighter flex items-center space-x-2">
                   <ShoppingBasket className="text-orange-600" size={18} />
                   <span>Asset Registry Interface</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Product Designation</label>
                   <input required className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600 font-sans" value={editingProduct?.name} onChange={e => setEditingProduct({...editingProduct!, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Price / Cost ($)</label>
                      <input required type="number" className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingProduct?.price} onChange={e => setEditingProduct({...editingProduct!, price: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Current Stock</label>
                      <input required type="number" className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingProduct?.stock} onChange={e => setEditingProduct({...editingProduct!, stock: Number(e.target.value)})} />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Category</label>
                      <select className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white uppercase font-bold text-sm outline-none focus:border-orange-600" value={editingProduct?.category} onChange={e => setEditingProduct({...editingProduct!, category: e.target.value})}>
                         <option value="Supplements">Supplements</option>
                         <option value="Cardio">Cardio</option>
                         <option value="Accessories">Accessories</option>
                         <option value="Apparel">Apparel</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Asset Image</label>
                      <div className="flex space-x-2">
                        <input className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-white text-sm outline-none focus:border-orange-600" placeholder="Image URL..." value={editingProduct?.photoURL} onChange={e => setEditingProduct({...editingProduct!, photoURL: e.target.value})} />
                        <label className="cursor-pointer bg-zinc-800 border border-zinc-700 px-4 flex items-center justify-center hover:bg-zinc-700 transition-colors">
                          <Upload size={16} className="text-orange-600" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Technical Specifications</label>
                   <textarea required rows={2} className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white text-sm outline-none focus:border-orange-600 resize-none font-sans" value={editingProduct?.specifications} onChange={e => setEditingProduct({...editingProduct!, specifications: e.target.value})} />
                </div>

                <button type="submit" className="w-full bg-orange-600 py-4 font-black uppercase italic tracking-widest text-sm mt-4 hover:bg-orange-500 transition-all flex items-center justify-center space-x-2">
                   <Save size={16} />
                   <span>COMMIT INVENTORY DATA</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EquipmentManager;
