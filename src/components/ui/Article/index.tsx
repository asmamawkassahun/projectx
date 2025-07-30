"use client"
import React from "react"
import PersonalDetail from "./PersonalDetail"
import SportsDetail from "./SportsDetail"
import BuildingDetail from "./BuildingDetail"
import F1Detail from "./F1Detail"
import CryptoDetail from "./CryptoDetail"

interface PersonalDetailData {
  name?: string
  description?: string
  avatarUrl?: string
  experiences?: {
    title: string
    company: string
    duration: string
    logoUrl?: string
    logoType?: "plus" | "x" | "pwc" | "custom"
  }[]
  callToAction?: {
    text: string
    link: string
  }
  variant?: "component-details" | "minimal" | "work-history" | "logos-cta" | "rich"
  largeImageUrl?: string
}

interface SportsDetailData {
  player?: {
    name: string
    avatarUrl?: string
    minutesPlayed: number
    distanceRan: string
    opponent: string
  }
  match?: {
    homeTeam: {
      name: string
      logoUrl?: string
      score: number
      logoType?: "al-nassr" | "al-khaleej" | "custom"
    }
    awayTeam: {
      name: string
      logoUrl?: string
      score: number
      logoType?: "al-nassr" | "al-khaleej" | "custom"
    }
    status: string
  }
  stats?: {
    label: string
    value: string | number
  }[]
  callToAction?: {
    text: string
    link: string
  }
  variant?: "full-details" | "minimal" | "minimal-info" | "stats" | "rich"
  largeImageUrl?: string
}

interface BuildingDetailData {
  buildingName?: string
  location?: string
  description?: string
  height?: string
  floors?: string
  elevators?: string
  imageUrl?: string
  avatarIconUrl?: string
  callToAction?: {
    text: string
    link: string
  }
  variant?: "component-details" | "minimal" | "minimal-cta" | "image" | "image-info" | "image-info-2" | "rich"
}

interface F1DetailData {
  raceDate?: string
  raceDay?: string
  location?: string
  circuit?: string
  description?: string
  sponsorLogoUrl?: string
  backgroundImageUrl?: string
  schedule?: {
    day: string
    events: {
      name: string
      time: string
    }[]
  }[]
  callToAction?: {
    text: string
    link: string
  }
  variant?: "component-details" | "minimal" | "minimal-hero" | "cta" | "schedule" | "rich"
}

interface CryptoDetailData {
  cryptoName?: string
  currentPrice?: string
  priceRange?: string
  changeAmount?: string
  changePercentage?: string
  changeType?: "positive" | "negative"
  chartData?: any
  timeRanges?: string[]
  selectedTimeRange?: string
  infoSections?: {
    title: string
    content: string
  }[]
  callToAction?: {
    text: string
    link: string
  }
  variant?: "component-details" | "minimal" | "cta" | "chart-cta" | "chart-info" | "articles"
}

interface ArticleProps {
  personalDetailData?: PersonalDetailData
  sportsDetailData?: SportsDetailData
  buildingDetailData?: BuildingDetailData
  f1DetailData?: F1DetailData
  cryptoDetailData?: CryptoDetailData
}

export default function Article({ personalDetailData, sportsDetailData, buildingDetailData, f1DetailData, cryptoDetailData }: ArticleProps) {
  return (
    <div className="space-y-8">
      {personalDetailData && <PersonalDetail {...personalDetailData} />}
      {sportsDetailData && <SportsDetail {...sportsDetailData} />}
      {buildingDetailData && <BuildingDetail {...buildingDetailData} />}
      {f1DetailData && <F1Detail {...f1DetailData} />}
      {cryptoDetailData && <CryptoDetail {...cryptoDetailData} />}
    </div>
  )
}