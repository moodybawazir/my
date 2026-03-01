import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    type: 'service' | 'product' | 'project';
    quantity: number;
    image_url?: string;
    details?: any; // Additional info like selected package
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string, type: string) => void;
    updateQuantity: (id: string, type: string, delta: number) => void;
    clearCart: () => void;
    totalPrice: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('baseerah_cart');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('baseerah_cart', JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: CartItem) => {
        setItems((prev) => {
            const existing = prev.find(i => i.id === newItem.id && i.type === newItem.type);
            if (existing) {
                return prev.map(i =>
                    i.id === newItem.id && i.type === newItem.type
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }
            return [...prev, newItem];
        });
        setIsCartOpen(true);
    };

    const removeItem = (id: string, type: string) => {
        setItems(prev => prev.filter(i => !(i.id === id && i.type === type)));
    };

    const updateQuantity = (id: string, type: string, delta: number) => {
        setItems(prev => prev.map(i => {
            if (i.id === id && i.type === type) {
                const newQuantity = Math.max(1, i.quantity + delta);
                return { ...i, quantity: newQuantity };
            }
            return i;
        }));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items, addItem, removeItem, updateQuantity, clearCart,
            totalPrice, isCartOpen, setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
