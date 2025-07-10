import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from './utils';

interface PriceInsight {
  current?: {
    price: number;
    description: string;
  };
  graph_data?: {
    prices: number[];
    dates: string[];
  };
  typical_price?: {
    value: number;
    text: string;
  };
  price_history?: {
    text: string;
  };
  price_forecast?: {
    text: string;
  };
}

interface PriceInsightsProps {
  price_insights: PriceInsight;
  currency: string;
  search_parameters: {
    departure_id: string;
    arrival_id: string;
  };
}

const PriceInsights: React.FC<PriceInsightsProps> = ({ 
  price_insights, 
  currency, 
  search_parameters 
}) => {
  if (!price_insights) {
    return null;
  }

  // Find the min and max price for the graph scaling
  const graphData = price_insights.graph_data?.prices || [];
  
  // Initialize with valid values or defaults
  const prices = [];
  
  // Only add current price if it exists
  if (price_insights.current?.price !== undefined) {
    prices.push(price_insights.current.price);
  }
  
  // Only add typical price if it exists
  if (price_insights.typical_price?.value !== undefined) {
    prices.push(price_insights.typical_price.value);
  }
  
  // Add graph data prices if they exist
  if (graphData.length > 0) {
    prices.push(...graphData);
  }
  
  // If we have no prices at all, we can't show insights
  if (prices.length === 0) {
    return null;
  }
  
  // Now we can safely calculate min and max since we have at least one value
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  const getY = (price: number) => {
    if (priceRange === 0) return 50; // Default middle position if all prices are the same
    return 100 - ((price - minPrice) / priceRange) * 80; // Scale to 10-90% of height
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="my-4 p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <h3 className="text-gray-800 text-sm font-medium mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        <span>Price Insights</span>
      </h3>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Current vs Typical Price */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-100">
          {/* Current Price - Only render if available */}
          {price_insights.current && (
            <div className="mb-5">
              <div className="text-gray-500 text-xs mb-1 uppercase tracking-wide font-medium">Current Price</div>
              <div className="text-indigo-600 font-bold text-2xl">
                {formatPrice(price_insights.current.price, currency)}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {price_insights.current.description}
              </div>
            </div>
          )}

          {/* Typical Price - Only render if available */}
          {price_insights.typical_price && (
            <div className="mb-5">
              <div className="text-gray-500 text-xs mb-1 uppercase tracking-wide font-medium">Typical Price</div>
              <div className="text-gray-700 font-semibold text-lg">
                {formatPrice(price_insights.typical_price.value, currency)}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {price_insights.typical_price.text}
              </div>
            </div>
          )}

          {/* Price Forecast */}
          {price_insights.price_forecast && (
            <div className="mb-5 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
              <div className="text-indigo-800 text-xs mb-1 flex items-center gap-1 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                <span>FORECAST</span>
              </div>
              <div className="text-gray-600 text-sm">
                {price_insights.price_forecast.text}
              </div>
            </div>
          )}

          {/* Price History */}
          {price_insights.price_history && (
            <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
              <div className="text-gray-700 text-xs mb-1 flex items-center gap-1 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="12 8 12 12 14 14"></polyline>
                  <path d="M3.05 11a9 9 0 1 1 .5 4"></path>
                  <path d="M3 16V8"></path>
                  <path d="M8 3H2"></path>
                </svg>
                <span>HISTORICAL DATA</span>
              </div>
              <div className="text-gray-600 text-sm">
                {price_insights.price_history.text}
              </div>
            </div>
          )}
        </div>

        {/* Price Graph */}
        {price_insights.graph_data && price_insights.graph_data.prices.length > 0 && (
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-gray-700 text-sm font-medium mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>Price Trend</span>
            </div>
            
            <div className="h-40 w-full relative">
              {/* Graph container */}
              <div className="absolute inset-0">
                {/* Horizontal guide lines */}
                <div className="absolute w-full h-px bg-gray-100 top-0"></div>
                <div className="absolute w-full h-px bg-gray-100 top-1/4"></div>
                <div className="absolute w-full h-px bg-gray-100 top-1/2"></div>
                <div className="absolute w-full h-px bg-gray-100 top-3/4"></div>
                <div className="absolute w-full h-px bg-gray-100 bottom-0"></div>

                {/* Min and Max price labels */}
                <div className="absolute -left-2 top-0 text-xs text-gray-500">
                  {formatPrice(maxPrice, currency)}
                </div>
                <div className="absolute -left-2 bottom-0 text-xs text-gray-500">
                  {formatPrice(minPrice, currency)}
                </div>

                {/* Current price line - only if available */}
                {price_insights.current && (
                  <div className="relative">
                    <div 
                      className="absolute w-full h-px bg-indigo-500 z-10" 
                      style={{ top: `${getY(price_insights.current.price)}%` }}
                    ></div>
                    <div 
                      className="absolute px-1 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-sm whitespace-nowrap"
                      style={{ top: `${getY(price_insights.current.price) - 3}%`, right: "0" }}
                    >
                      Current
                    </div>
                  </div>
                )}

                {/* Typical price line - only if available */}
                {price_insights.typical_price && (
                  <div className="relative">
                    <div 
                      className="absolute w-full h-px bg-gray-500 z-10 border-b border-dashed" 
                      style={{ top: `${getY(price_insights.typical_price.value)}%` }}
                    ></div>
                    <div 
                      className="absolute px-1 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-sm whitespace-nowrap"
                      style={{ top: `${getY(price_insights.typical_price.value) - 3}%`, right: "0" }}
                    >
                      Typical
                    </div>
                  </div>
                )}

                {/* Price graph line */}
                {price_insights.graph_data && price_insights.graph_data.prices.length > 1 && (
                  <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(99 102 241 / 0.8)" />
                        <stop offset="100%" stopColor="rgb(99 102 241 / 0.2)" />
                      </linearGradient>
                    </defs>
                    <polyline
                      points={price_insights.graph_data.prices.map((price, i) => {
                        const x = (i / (price_insights.graph_data!.prices.length - 1)) * 100;
                        const y = getY(price);
                        return `${x},${y}`;
                      }).join(' ')}
                      className="stroke-indigo-500 stroke-2 fill-none"
                    />
                    <polyline
                      points={`${price_insights.graph_data.prices.map((price, i) => {
                        const x = (i / (price_insights.graph_data!.prices.length - 1)) * 100;
                        const y = getY(price);
                        return `${x},${y}`;
                      }).join(' ')} 100,100 0,100`}
                      fill="url(#lineGradient)"
                      className="opacity-20"
                    />
                  </svg>
                )}

                {/* Price points */}
                {price_insights.graph_data && price_insights.graph_data.prices.map((price, i) => {
                  const x = (i / (price_insights.graph_data!.prices.length - 1)) * 100;
                  const y = getY(price);
                  return (
                    <div 
                      key={i}
                      className="absolute w-2.5 h-2.5 bg-white border-2 border-indigo-500 rounded-full -ml-1.5 -mt-1.5"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      title={`${price_insights.graph_data!.dates?.[i] || 'Date'}: ${formatPrice(price, currency)}`}
                    ></div>
                  );
                })}
              </div>
            </div>

            {/* Date labels */}
            <div className="flex justify-between mt-2 text-gray-600 text-xs">
              {price_insights.graph_data && price_insights.graph_data.dates && price_insights.graph_data.dates.length > 0 && (
                <>
                  <div>{price_insights.graph_data.dates[0]}</div>
                  {price_insights.graph_data.dates.length > 2 && (
                    <div>{price_insights.graph_data.dates[Math.floor(price_insights.graph_data.dates.length / 2)]}</div>
                  )}
                  <div>{price_insights.graph_data.dates[price_insights.graph_data.dates.length - 1]}</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PriceInsights; 