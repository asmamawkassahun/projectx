import { ThemeToggle } from "@/components/common_components/ThemeToggle";
import IngredientsCard from "@/components/ui/loading/IngridentLoading";
import LinksListWithLoading from "@/components/ui/loading/ItemListWithLoading";
import VideoCard from "@/components/ui/loading/VideoCardLoading";
import ArchivingTaskFilesWithLoading from "@/components/ui/loading/ArchivingTaskFilesWithLoading";
import GeneratedAudioWithLoading from "@/components/ui/loading/GeneratedAudioWithLoading";
import GeneratedClipsWithLoading from "@/components/ui/loading/GeneratedClipsWithLoading";
import SingleCombinedVideoWithLoading from "@/components/ui/loading/SingleCombinedVideoWithLoading";
import React from "react";
import FlightCardWithLoading from "@/components/ui/loading/FlightCardWithLoading";
import MapCardLoading from "@/components/ui/loading/MapCardLoading";
import ImageGridWithLoading from "@/components/ui/loading/ImageGridWithLoading";
import HotelsCardLoading from "@/components/ui/loading/HotelsCardLoading";
import Weather from "@/components/ui/Weather";
import LastEmail from "@/components/ui/Email/LastEmail";
import Email from "@/components/ui/Email";
import { FileText } from "lucide-react";
import Article from "@/components/ui/Article";


interface SendEmailData {
  title?: string
  componentLabel?: string
  recipients?: Array<{
    id: string
    name: string
    initials: string
    avatar?: string
  }>
  message?: {
    subject: string
    preview: string
  }
  event?: {
    title: string
    date: string
    time: string
    participants: Array<{
      id: string
      name: string
      initials: string
      avatar?: string
    }>
    additionalCount?: number
  }
  location?: {
    name: string
    mapImage?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  attachments?: Array<{
    id: string
    name: string
    type: string
    icon?: string
  }>
  maxVisibleRecipients?: number
}

const page = () => {
  const forecastData = [
    { date: 3, temp: 72, maxTemp: 84, condition: "sunny" },
    { date: 4, temp: 65, maxTemp: 90, condition: "cloudy" },
    { date: 5, temp: 78, maxTemp: 75, condition: "sunny" },
    { date: 6, temp: 80, maxTemp: 88, condition: "sunny" },
    { date: 7, temp: 70, maxTemp: 92, condition: "sunny" },
    { date: 8, temp: 82, maxTemp: 85, condition: "sunny" },
    { date: 9, temp: 75, maxTemp: 80, condition: "sunny" },
  ]

  const emailData = {
    sender: {
      name: "Anisha Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AS",
    },
    heading: true,
    subject: "Project Sync: Status Update",
    preview: "Hey Jaffar, what are you doing for your birthday? Got any plans this weekend?",
    receivedTime: "Yesterday, 3:31 PM",
    event: {
      title: "Coffee and catch-up",
      date: "17 July, 2025",
      time: "5:00 PM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    location: {
      name: "Starbucks",
      mapImage: "/placeholder.svg?height=120&width=400",
    },
    action: false,
  }

  const connectEmailData = {
    action: true,
    photo: true
  }


  const unreadEmailData = [
    {
      senderName: "Anisha Singh",
      senderInitials: "AS",
      avatar: "/placeholder.svg?height=48&width=48&text=AS",
      subject: "Project Sync: Status Update",
      snippet: "Hey Jaffar, what are you doing for your birthday? Got any plans this weekend?",
      relativeTimestamp: "Yesterday",
      specificTime: "3:31 PM",
      showReplyIcon: true,
    },
    {
      senderName: "Carlota Zajac",
      senderInitials: "CZ",
      avatar: "/placeholder.svg?height=48&width=48&text=CZ",
      subject: "Latest roadmap for CoStar 2.0",
      snippet: "Hey Jaffar, what are you doing for your birthday? Got any plans this weekend?",
      relativeTimestamp: "Yesterday",
      specificTime: "2:12 PM",
      showReplyIcon: true,
    },
    {
      senderName: "Felipe López",
      senderInitials: "FL",
      avatar: "/placeholder.svg?height=48&width=48&text=FL",
      subject: "How are you doing?",
      snippet: "Hey Jaffar, what are you doing for your birthday? Got any plans this weekend?",
      relativeTimestamp: "Yesterday",
      specificTime: "6:48 PM",
      showReplyIcon: true,
    },


  ]


  // Summarize email data
  const summarizeEmailData = {
    summary: "Gustavo asked if you were planning anything for your 39th birthday",
    messages: [
      {
        avatar: "/placeholder.svg?height=40&width=40&text=G",
        fallback: "G",
        content: "Gustavo asked if you were planning anything for your 39th birthday",
      },
      {
        avatar: "/placeholder.svg?height=40&width=40&text=A",
        fallback: "A",
        sender: "Anisha Singh",
        subject: "Project Sync: Status Update",
        preview: "Hey Jaffar, what are you doing for your birthday? Got any plans this weekend?",
        receivedTime: "Yesterday, 3:31 PM",
        content: "Hey Jaffar, what are you doing for your birthday? Got any plans this weekend?",
      },
    ],
    event: {
      title: "Coffee and catch-up",
      date: "17 July, 2025",
      time: "5:00 PM",
      avatar: "/placeholder.svg?height=32&width=32&text=C",
    },
    location: {
      name: "Starbucks",
      mapImage: "/placeholder.svg?height=120&width=400",
    },
    attachments: [
      {
        name: "Design Presentation.key",
        icon: <FileText className="w-6 h-6 text-gray-400" />
      }
    ]
  }


  const sendEmailData: SendEmailData = {
    title: "Send Email",
    componentLabel: "Send Email",
    recipients: [
      { id: "1", name: "Anisha Singh", initials: "AS", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "2", name: "Gustavo Paris", initials: "GP", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "3", name: "Chandra", initials: "CH", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "4", name: "Appu", initials: "AP", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "5", name: "Oguzhan", initials: "OG", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "6", name: "Val", initials: "VA", avatar: "/placeholder.svg?height=32&width=32" },
      { id: "7", name: "Vlad", initials: "VL", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    message: {
      subject: "Let's meet for a coffee!",
      preview: "Message copy goes here as I talk to the AI via voice input...",
    },
    event: {
      title: "Coffee and catch-up",
      date: "17 July, 2025",
      time: "5:00 PM",
      participants: [
        { id: "1", name: "Anisha Singh", initials: "AS", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "2", name: "Gustavo Paris", initials: "GP", avatar: "/placeholder.svg?height=32&width=32" },
        { id: "3", name: "Chandra", initials: "CH", avatar: "/placeholder.svg?height=32&width=32" },
      ],
      additionalCount: 2,
    },
    location: {
      name: "Starbucks",
      mapImage: "/placeholder.svg?height=128&width=400",
    },
    attachments: [{ id: "1", name: "Design Presentation.key", type: "keynote" }],
    maxVisibleRecipients: 7,
  }

  // Personal Detail data
  const personalDetailData = {
    name: "Gustavo Paris",
    description: "A Brazilian design leader focused on building teams and creating captivating experiences for innovative brands.",
    avatarUrl: "/placeholder.svg?height=44&width=44&text=GP",
    experiences: [
      {
        title: "Director of Product Design",
        company: "CoStar",
        duration: "2024 - Present",
        logoType: "plus" as const
      },
      {
        title: "Director of Product Design",
        company: "Fantasy",
        duration: "2016 - 2022",
        logoType: "x" as const
      },
      {
        title: "Director of Product Design",
        company: "PwC",
        duration: "2013 - 2017",
        logoType: "pwc" as const
      }
    ],
    callToAction: {
      text: "View LinkedIn",
      link: "https://linkedin.com/in/gustavo-paris"
    },
    variant: "component-details" as const,
    largeImageUrl: "/prompt-images/building-details.png"
  }

  // Sports Detail data
  const sportsDetailData = {
    player: {
      name: "Cristiano Ronaldo",
      avatarUrl: "/placeholder.svg?height=48&width=48&text=CR",
      minutesPlayed: 86,
      distanceRan: "12.8 km",
      opponent: "Al-Khaleej"
    },
    match: {
      homeTeam: {
        name: "Al-Nassr",
        score: 2,
        logoType: "al-nassr" as const
      },
      awayTeam: {
        name: "Al-Khaleej",
        score: 0,
        logoType: "al-khaleej" as const
      },
      status: "Full-time"
    },
    stats: [
      { label: "Shots", value: 14 },
      { label: "Shots on target", value: 12 },
      { label: "Goals", value: 1 },
      { label: "Possession", value: "79%" },
      { label: "Passes", value: 63 },
      { label: "Pass Accuracy", value: "93%" },
      { label: "Distance ran", value: "12.8 km" },
      { label: "Fouls", value: 1 },
      { label: "Yellow cards", value: 0 },
      { label: "Red cards", value: 0 },
      { label: "Offsides", value: 2 }
    ],
    callToAction: {
      text: "View stats",
      link: "https://example.com/stats"
    },
    variant: "full-details" as const,
    largeImageUrl: "/prompt-images/sport-sample.png"
  }

  // Building Detail data
  const buildingDetailData = {
    buildingName: "The Burj Khalifa",
    location: "Dubai, United Arab Emirates",
    description: "is a megatall skyscraper located in",
    height: "829.8 m",
    floors: "154",
    elevators: "57",
    imageUrl: "/BurjiKhalifa.jpg",
    avatarIconUrl: "/placeholder.svg?height=44&width=44&text=BK",
    callToAction: {
      text: "View details",
      link: "https://example.com/burj-khalifa"
    },
    variant: "component-details" as const
  }

  // F1 Detail data
  const f1DetailData = {
    raceDate: "27 July",
    raceDay: "Sunday",
    location: "Belgium",
    circuit: "Spa-Francorchamps",
    description: "The next Formula 1 race is on",
    sponsorLogoUrl: "/tag-heuer-logo.png",
    backgroundImageUrl: "/spa-circuit.jpg",
    schedule: [
      {
        day: "Friday, 25 July",
        events: [
          { name: "Practice 1", time: "11:30 - 12:30" },
          { name: "Sprint Qualifying", time: "15:30 - 16:14" }
        ]
      },
      {
        day: "Saturday, 26 July",
        events: [
          { name: "Sprint", time: "11:00 - 12:00" },
          { name: "Qualifying", time: "15:00 - 16:00" }
        ]
      },
      {
        day: "Sunday, 27 July",
        events: [
          { name: "Race", time: "14:00" }
        ]
      }
    ],
    callToAction: {
      text: "Race preview",
      link: "https://example.com/f1-race"
    },
    variant: "component-details" as const
  }

  // Crypto Detail data
  const cryptoDetailData = {
    cryptoName: "Bitcoin",
    currentPrice: "US $117,725.00",
    priceRange: "$117.5K and $118.5K",
    changeAmount: "-21.00",
    changePercentage: "-0.02%",
    changeType: "negative" as const,
    timeRanges: ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y"],
    selectedTimeRange: "1D",
    chartData: "/CryptoGraph.png",
    infoSections: [
      {
        title: "Price Trend",
        content: "New highs (~$123K), slight pullback to ~$117K"
      },
      {
        title: "Legislative Momentum",
        content: "Positive regulatory clarity emerging in U.S."
      },
      {
        title: "Institutional Outlook",
        content: "Strong appetite: ETFs and treasury buys continue"
      },
      {
        title: "Forecast Range",
        content: "$130K-200K by end-2025, consensus near ~$145K"
      },
      {
        title: "Risks",
        content: "Security breaches, volatility, macro events"
      }
    ],
    callToAction: {
      text: "View charts",
      link: "https://example.com/bitcoin-charts"
    },
    variant: "component-details" as const
  }



  // const unreadEmailDataMinimal = [
  //   {
  //     senderName: "John Doe",
  //     senderInitials: "JD",
  //     avatar: "/placeholder.svg?height=48&width=48&text=JD",
  //     subject: "Quick Question",
  //     snippet: "Hey Jaffar, what are you doing for your birthday? Got any plans this weekend?",
  //     relativeTimestamp: "Yesterday",
  //         specificTime: "6:48 PM",
  //     // No optional fields provided
  //   },
  //   {
  //     senderName: "Jane Smith",
  //     senderInitials: "JS",
  //     avatar: "/placeholder.svg?height=48&width=48&text=JS",
  //     subject: "Meeting Tomorrow",
  //     snippet: "Just a quick reminder about our meeting.",
  //     relativeTimestamp: "Yesterday",
  //         specificTime: "6:48 PM",
  //     // No timestamp or reply icon
  //   },
  // ]


  return (
    <div className="flex flex-col  bg-background text-foreground justify-center min-h-screen  p-4">
      <div className="flex w-full justify-end items-center mx-auto">
        <ThemeToggle />
      </div>
      <div className="flex flex-col  w-full ">

        <Article
          personalDetailData={personalDetailData}
          sportsDetailData={sportsDetailData}
          buildingDetailData={buildingDetailData}
          f1DetailData={f1DetailData}
          cryptoDetailData={cryptoDetailData}
        />

        <Email
          showConnect={true}
          showLastEmail={true}
          showUnread={true}
          showSummary={true}
          lastEmailData={emailData}
          connectEmailData={connectEmailData}
          unreadEmailData={unreadEmailData}
          summarizeEmailData={summarizeEmailData}
          sendEmailData={sendEmailData}
        />
        <Weather
          temperature={72}
          location="Singapore"
          condition="rainy"
          humidity={92}
          cloudiness={57}
          unit="F"
          month="April"
          forecast={forecastData}
        />
        <HotelsCardLoading />
        <FlightCardWithLoading />
        <MapCardLoading />
        <LinksListWithLoading />
        <IngredientsCard />
        <VideoCard />
        <GeneratedClipsWithLoading />
        <GeneratedAudioWithLoading />
        <SingleCombinedVideoWithLoading />
        <ArchivingTaskFilesWithLoading />
        <ImageGridWithLoading />
      </div>
    </div>
  );
};

export default page;
