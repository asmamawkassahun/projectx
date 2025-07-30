"use client"
import React from "react"
import Button from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CryptoInfo {
  title: string
  content: string
}

interface CryptoDetailProps {
  cryptoName?: string
  currentPrice?: string
  priceRange?: string
  changeAmount?: string
  changePercentage?: string
  changeType?: "positive" | "negative"
  chartData?: string
  timeRanges?: string[]
  selectedTimeRange?: string
  infoSections?: CryptoInfo[]
  callToAction?: {
    text: string
    link: string
  }
  variant?: "component-details" | "minimal" | "cta" | "chart-cta" | "chart-info" | "articles"
}

export default function CryptoDetail({
  cryptoName = "Bitcoin",
  currentPrice = "US $117,725.00",
  priceRange = "$117.5K and $118.5K",
  changeAmount = "-21.00",
  changePercentage = "-0.02%",
  changeType = "negative",
  chartData,
  timeRanges = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y"],
  selectedTimeRange = "1D",
  infoSections = [],
  callToAction,
  variant = "component-details"
}: CryptoDetailProps) {
  
  const handleCallToAction = () => {
    if (callToAction?.link) {
      window.open(callToAction.link, "_blank")
    }
  }

  const handleTimeRangeChange = (range: string) => {
    // Handle time range selection
    console.log("Time range changed to:", range)
  }

  const tradingDescription = `${cryptoName} is currently trading around $117,700, with intraday swings between ${priceRange}.`

  const renderComponentDetails = () => (
    <div className="bg-white/10 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Crypto Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Trading Info Card */}
      <div className="bg-white/10 rounded-lg p-4 mb-4 flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/bitcoin-logo.png" alt="Bitcoin logo" />
          <AvatarFallback className="bg-orange-500 text-white text-xs font-bold">
            ₿
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-white text-sm leading-tight">{tradingDescription}</p>
        </div>
      </div>

      {/* Price & Chart Card */}
      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-semibold text-lg">{cryptoName} (BTC)</h3>
            <p className="text-white text-2xl font-bold">{currentPrice}</p>
            <p className={`text-sm ${changeType === "positive" ? "text-green-400" : "text-red-400"}`}>
              {changeAmount} ({changePercentage}) Today
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedTimeRange === range
                  ? "bg-white text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="w-full h-32 bg-red-900/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-full h-16 bg-gradient-to-r from-red-600 to-red-400 rounded mb-2"></div>
            <p className="text-gray-400 text-xs">Price Chart</p>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      {infoSections.length > 0 && (
        <div className="space-y-3 mb-4">
          {infoSections.map((info, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-sm mb-1">{info.title}</h4>
              <p className="text-gray-300 text-sm">{info.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderMinimal = () => (
    <div className="bg-white/10 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Crypto Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Trading Info Card */}
      <div className="bg-white/10 rounded-lg p-4 flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/bitcoin-logo.png" alt="Bitcoin logo" />
          <AvatarFallback className="bg-orange-500 text-white text-xs font-bold">
            ₿
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-white text-sm leading-tight">{tradingDescription}</p>
        </div>
      </div>
    </div>
  )

  const renderCTA = () => (
    <div className="bg-white/10 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Crypto Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>CTA</span>
        </div>
      </div>

      {/* Trading Info Card */}
      <div className="bg-white/10 rounded-lg p-4 mb-4 flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/bitcoin-logo.png" alt="Bitcoin logo" />
          <AvatarFallback className="bg-orange-500 text-white text-xs font-bold">
            ₿
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-white text-sm leading-tight">{tradingDescription}</p>
        </div>
      </div>

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderChartCTA = () => (
    <div className="bg-white/10 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Crypto Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Trading Info Card */}
      <div className="bg-white/10 rounded-lg p-4 mb-4 flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/bitcoin-logo.png" alt="Bitcoin logo" />
          <AvatarFallback className="bg-orange-500 text-white text-xs font-bold">
            ₿
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-white text-sm leading-tight">{tradingDescription}</p>
        </div>
      </div>

      {/* Price & Chart Card */}
      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-semibold text-lg">{cryptoName} (BTC)</h3>
            <p className="text-white text-2xl font-bold">{currentPrice}</p>
            <p className={`text-sm ${changeType === "positive" ? "text-green-400" : "text-red-400"}`}>
              {changeAmount} ({changePercentage}) Today
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedTimeRange === range
                  ? "bg-white text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Chart */}
        {chartData ? (
          <div className="w-full h-32 rounded-lg overflow-hidden">
            <img 
              src={chartData} 
              alt={`${cryptoName} price chart`} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-red-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-full h-16 bg-gradient-to-r from-red-600 to-red-400 rounded mb-2"></div>
              <p className="text-gray-400 text-xs">Price Chart</p>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderChartInfo = () => (
    <div className="bg-white/10 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Crypto Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Trading Info Card */}
      <div className="bg-white/10 rounded-lg p-4 mb-4 flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/bitcoin-logo.png" alt="Bitcoin logo" />
          <AvatarFallback className="bg-orange-500 text-white text-xs font-bold">
            ₿
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-white text-sm leading-tight">{tradingDescription}</p>
        </div>
      </div>

      {/* Price & Chart Card */}
      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-semibold text-lg">{cryptoName} (BTC)</h3>
            <p className="text-white text-2xl font-bold">{currentPrice}</p>
            <p className={`text-sm ${changeType === "positive" ? "text-green-400" : "text-red-400"}`}>
              {changeAmount} ({changePercentage}) Today
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedTimeRange === range
                  ? "bg-white text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="w-full h-32 bg-red-900/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-full h-16 bg-gradient-to-r from-red-600 to-red-400 rounded mb-2"></div>
            <p className="text-gray-400 text-xs">Price Chart</p>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      {infoSections.length > 0 && (
        <div className="space-y-3 mb-4">
          {infoSections.map((info, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <h4 className="text-white font-semibold text-sm mb-1">{info.title}</h4>
              <p className="text-gray-300 text-sm">{info.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderArticles = () => (
    <div className="bg-white/10 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Crypto Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>



      {/* Trading Info Card */}
      <div className="bg-white/10 rounded-lg p-4 mb-4 flex items-start gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/bitcoin-logo.png" alt="Bitcoin logo" />
          <AvatarFallback className="bg-orange-500 text-white text-xs font-bold">
            ₿
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="text-white text-sm leading-tight">{tradingDescription}</p>
        </div>
      </div>

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-2 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  // Render based on variant
  switch (variant) {
    case "minimal":
      return renderMinimal()
    case "cta":
      return renderCTA()
    case "chart-cta":
      return renderChartCTA()
    case "chart-info":
      return renderChartInfo()
    case "articles":
      return renderArticles()
    case "component-details":
    default:
      return renderComponentDetails()
  }
}
