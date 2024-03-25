'use client';
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/cart'; // Importing CartContext from the context file
import Cart from '@/components/cart'; // Importing the Cart component
import { ToastContainer, toast } from 'react-toastify'; // Importing ToastContainer and toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing CSS for react-toastify

interface Product {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  price: number;
}

const Products: React.FC = () => {
  // State variables
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext)!; // Accessing cart items and cart actions from CartContext

  // Toggle function to show/hide the cart modal
  const toggle = () => {
    setShowModal(!showModal);
  };

  // Function to fetch products from API
  async function getProducts() {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Fetch products on component mount
  useEffect(() => {
    getProducts();
  }, []);

  // Function to notify when a product is added to cart
  const notifyAddedToCart = (item: Product) => toast.success(`${item.title} added to cart!`, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
    style: {
      backgroundColor: '#fff',
      color: '#000',
    }
  });

  // Function to notify when a product is removed from cart
  const notifyRemovedFromCart = (item: Product) => toast.error(`${item.title} removed from cart!`, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
    style: {
      backgroundColor: '#000',
      color: '#fff',
    }
  });

  // Function to handle removal of a product from cart
  const handleRemoveFromCart = (product: Product) => {
    removeFromCart(product);
    notifyRemovedFromCart(product);
  };

  return (
    <div className='flex flex-col justify-center bg-gray-100'>
      <ToastContainer /> {/* Container for displaying toasts */}
      <div className='flex justify-between items-center px-20 py-5'>
        <h1 className='text-2xl text-gray-950 uppercase font-bold mt-10 text-center mb-10'>Shop</h1>
        {/* Button to toggle cart modal visibility */}
        {!showModal && <button className='px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700'
          onClick={toggle}
        >Cart ({cartItems.length})</button>}
      </div>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-10'>
        {/* Displaying products */}
        {products.map(product => (
          <div key={product.id} className='bg-white shadow-md rounded-lg px-10 py-10'>
            <img src={product.thumbnail} alt={product.title} className='rounded-md h-48' />
            <div className='mt-4'>
              <h1 className='text-lg uppercase font-bold'>{product.title}</h1>
              <p className='mt-2 text-gray-600 text-sm'>{product.description.slice(0, 40)}...</p>
              <p className='mt-2 text-gray-600'>${product.price}</p>
            </div>
            <div className='mt-6 flex justify-between items-center'>
              {/* Render add to cart button or quantity controls based on whether the product is already in cart */}
              {!cartItems.find(item => item.id === product.id) ? (
                <button className='px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700'
                  onClick={() => {
                    addToCart(product);
                    notifyAddedToCart(product);
                  }}
                >
                  Add to cart
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                    onClick={() => {
                      addToCart(product);
                    }}
                  >
                    +
                  </button>
                  <p className='text-gray-600'>{cartItems.find(item => item.id === product.id)?.quantity}</p>
                  <button
                    className="px-4 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                    onClick={() => {
                      const cartItem = cartItems.find(item => item.id === product.id);
                      if (cartItem && cartItem.quantity === 1) {
                        handleRemoveFromCart(product);
                      } else {
                        removeFromCart(product);
                      }
                    }}
                  >
                    -
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Cart showModal={showModal} toggle={toggle} /> {/* Render the Cart component */}
    </div>
  );
};

export default Products;
