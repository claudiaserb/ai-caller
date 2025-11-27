import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ShopContext = createContext({});

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadShops = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setShops(data || []);

      // Set active shop or first shop as selected
      const activeShop = data?.find(shop => shop.is_active);
      setSelectedShop(activeShop || data?.[0] || null);
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const selectShop = async (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    if (shop) {
      setSelectedShop(shop);

      // Update is_active in database
      try {
        // Set all shops to inactive
        await supabase
          .from('shops')
          .update({ is_active: false })
          .eq('user_id', user.id);

        // Set selected shop to active
        await supabase
          .from('shops')
          .update({ is_active: true })
          .eq('id', shopId);

        // Update local state
        setShops(prev =>
          prev.map(s => ({ ...s, is_active: s.id === shopId }))
        );
      } catch (error) {
        console.error('Error updating active shop:', error);
      }
    }
  };

  const addShop = async (shopData) => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([{ ...shopData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setShops(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding shop:', error);
      throw error;
    }
  };

  const refreshShops = async () => {
    await loadShops();
  };

  const value = {
    shops,
    selectedShop,
    loading,
    selectShop,
    addShop,
    refreshShops,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};