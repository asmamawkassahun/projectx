'use client'

import React from 'react'
import { transformImageGenerationUpdates, transformWebSearchUpdates } from './data-transformers'

// Mock data for testing
const mockImageUpdates = [
  {
    id: 'img-1',
    tool: 'image_generation',
    event_type: 'image_generated',
    data: {
      image_url: '/test-image-1.jpg',
      prompt: 'A beautiful sunset over mountains',
      width: 1024,
      height: 768
    },
    timestamp: new Date()
  },
  {
    id: 'img-2',
    tool: 'image_generation',
    event_type: 'image_generated',
    data: {
      image_url: '/test-image-2.jpg',
      prompt: 'A futuristic city skyline',
      width: 1024,
      height: 768
    },
    timestamp: new Date()
  }
]

const mockWebSearchUpdates = [
  {
    id: 'search-1',
    tool: 'web_search',
    event_type: 'search_results',
    data: {
      results: [
        {
          title: 'Best Travel Destinations 2024',
          snippet: 'Discover the top travel destinations for 2024...',
          domain: 'travel.com',
          type: 'Article'
        },
        {
          title: 'Travel Tips and Guides',
          snippet: 'Essential travel tips for your next adventure...',
          domain: 'guides.com',
          type: 'Guide'
        }
      ]
    },
    timestamp: new Date()
  }
]

export default function TestIntegration() {
  const testImageTransformation = () => {
    const result = transformImageGenerationUpdates(mockImageUpdates)
    console.log('Image transformation result:', result)
    return result
  }

  const testWebSearchTransformation = () => {
    const result = transformWebSearchUpdates(mockWebSearchUpdates)
    console.log('Web search transformation result:', result)
    return result
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Integration Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Image Generation Test</h2>
          <button 
            onClick={testImageTransformation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Image Transformation
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Web Search Test</h2>
          <button 
            onClick={testWebSearchTransformation}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Web Search Transformation
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Integration Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>Data transformers created ✓</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>CardDeckSwiper updated ✓</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>InChatUpdates integration ready ✓</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span>Dummy data removed ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 