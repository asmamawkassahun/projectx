import React from 'react';
import { motion } from 'framer-motion';

interface Product {
  title: string;
  link: string;
  thumbnail?: string;
  price?: string;
  rating?: number;
  reviews?: number;
  store?: string;
  freeShipping?: boolean;
}

interface ProductsProps {
  data: Product[];
}

const Products: React.FC<ProductsProps> = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-gray-800 text-sm font-medium mb-3 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"></path>
        </svg>
        Products <span className="text-xs text-gray-500">({data.length})</span>
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {data.map((product, index) => (
          <motion.a
            key={index}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow transition-all"
          >
            {/* Thumbnail */}
            <div className="aspect-square w-full relative bg-gray-100">
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
                    (e.target as HTMLImageElement).parentElement!.innerHTML += `
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <path d="M3 9h18"></path>
                        <path d="M9 21V9"></path>
                      </svg>
                    `;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <path d="M3 9h18"></path>
                    <path d="M9 21V9"></path>
                  </svg>
                </div>
              )}
              
              {product.freeShipping && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  Free Shipping
                </div>
              )}
            </div>
            
            {/* Product details */}
            <div className="p-3 flex-grow flex flex-col">
              <h4 className="text-gray-800 text-xs font-medium line-clamp-2 mb-1">
                {product.title}
              </h4>
              
              {product.price && (
                <div className="text-gray-900 text-sm font-semibold mb-1">
                  {product.price}
                </div>
              )}
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mt-auto">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill={i < Math.floor(product.rating!) ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className={i < Math.floor(product.rating!) ? "text-amber-500" : "text-gray-300"}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500 text-[10px]">
                    {product.rating.toFixed(1)}{product.reviews ? ` (${product.reviews})` : ''}
                  </span>
                </div>
              )}
              
              {product.store && !product.rating && (
                <div className="text-gray-500 text-[10px] mt-auto">
                  {product.store}
                </div>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default Products; 