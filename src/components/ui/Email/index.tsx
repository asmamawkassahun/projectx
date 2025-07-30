"use client"
import React from 'react'
import LastEmail from './LastEmail'
import UnreadEmails from './UnreadEmails'
import ConnectEmail from './ConnectEmail'
import SummarizeEmail from './SummerizeEmail'
import { head } from 'lodash'
import SendEmail from './SendEmail'

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
    action: true,
}

interface SummarizeEmailDataType {
  summary?: string
  messages?: {
    avatar: string
    fallback: string
    content: string
    sender?: string
    subject?: string
    preview?: string
    receivedTime?: string
  }[]
  event?: {
    title: string
    date: string
    time: string
    avatar: string
  }
  location?: {
    name: string
    mapImage?: string
  }
  attachments?: {
    name: string
    icon?: React.ReactNode
  }[]
}




interface EmailProps {
    showConnect?: boolean
    showLastEmail?: boolean
    showUnread?: boolean
    showSummary?: boolean
    showSendEmail?: boolean
    lastEmailData?: typeof emailData
    unreadEmailData: any[]
    connectEmailData: {
        action: boolean
        photo: boolean
    }
    summarizeEmailData?: SummarizeEmailDataType
    sendEmailData?: {
        title?: string
        componentLabel?: string
        recipients?: {
            id: string
            name: string
            avatar?: string
            initials: string
        }[]
        message?: {
            subject: string
            preview: string
        }
        event?: {
            title: string
            date: string
            time: string
            participants: {
                id: string
                name: string
                avatar?: string
                initials: string
            }[]
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
        attachments?: {
            id: string
            name: string
            type: string
            icon?: string
        }[]
        onSend?: () => void
        onAddRecipient?: () => void
        maxVisibleRecipients?: number
    }
}

const Email = ({
    showConnect = true,
    showLastEmail = true,
    showUnread = true,
    showSummary = true,
    showSendEmail = true,
    lastEmailData,
    unreadEmailData,
    connectEmailData,
    summarizeEmailData,
    sendEmailData

}: EmailProps) => {

    return (
        <div className="space-y-8">
            {showConnect &&  <ConnectEmail emailData = {connectEmailData} />}
            {showLastEmail && lastEmailData && <LastEmail {...lastEmailData} />}
            {showUnread && unreadEmailData && <UnreadEmails emails={unreadEmailData} />}
            {showSummary &&summarizeEmailData && <SummarizeEmail {...summarizeEmailData} />}
            {showSendEmail &&summarizeEmailData && <SendEmail {...sendEmailData} />}
        </div>
    )
}

export default Email