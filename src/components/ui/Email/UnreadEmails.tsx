"use client"

interface EmailData {
  senderName: string
  senderInitials: string
  avatar: string
  subject: string
  snippet?: string
  relativeTimestamp?: string
  specificTime?: string
  showReplyIcon?: boolean
}

interface EmailListProps {
  emails: EmailData[]
}

const DoubleCheckmarkIcon = () => (
  <svg width="22" height="13" viewBox="0 0 22 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path
      d="M5.70011 13.0001L0.0501099 7.3501L1.47511 5.9501L7.12511 11.6001L5.70011 13.0001ZM11.3501 13.0001L5.70011 7.3501L7.10011 5.9251L11.3501 10.1751L20.5501 0.975098L21.9501 2.4001L11.3501 13.0001ZM11.3501 7.3501L9.92511 5.9501L14.8751 1.0001L16.3001 2.4001L11.3501 7.3501Z"
      fill="#1078FF"
    />
  </svg>
)

const ReplyIcon = () => (
  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.99954 4.00958V0.182129L0.329407 7.00002L7.99954 13.8179V9.98592C10.2361 9.96191 11.5143 10.2111 12.3264 10.6171C13.1683 11.0381 13.5867 11.665 14.0699 12.6315L15.3329 12.3334C15.3329 9.47717 14.9232 7.32861 13.6125 5.92075C12.3937 4.61169 10.5325 4.08468 7.99954 4.00958Z"
        fill="white"
      />
    </svg>
  </div>
)

const DiamondIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
    <path d="M8 0L12 4L8 8L4 4L8 0Z" fill="#a855f7" />
  </svg>
)

export default function EmailList({ emails }: EmailListProps) {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center p-4 pb-8">
       <div className="w-full max-w-md rounded-xl">
        {/* Unread emails header */}
        <div className="flex items-center text-white text-sm mb-4">
          <h2 className="font-bold text-[1.5rem] leading-[110%]">Unread emails</h2>
        </div>

        {/* Main content with purple border */}
        <div
          className=" rounded-lg p-6 bg-white/10 "
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Email List Title */}
          <h1 className="text-2xl font-bold text-white mb-6">Email List</h1>

          {/* Horizontal line */}
          <div className="w-full h-px bg-gray-600 mb-6" />

          {/* Email List */}
          <div className="space-y-6">
            {emails.map((email, index) => (
              <div key={index}>
                <div className="flex items-start gap-4 relative">
                  {/* Avatar */}
                  <img
                    src={email.avatar || "/placeholder.svg"}
                    alt={email.senderName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />

                  {/* Email Details */}
                  <div className="flex-1 min-w-0">
                    {/* Sender Name */}
                    <div className="bg-white/10 text-white text-sm font-medium px-3 py-1 rounded-[0.5rem] inline-block mb-2">
                      {email.senderName}
                    </div>

                    {/* Subject */}
                    <h2 className="text-white text-lg font-bold mb-2 leading-tight">{email.subject}</h2>

                    {/* Email Snippet - Only render if snippet exists */}
                    {email.snippet && <p className="text-gray-300 text-sm mb-3 leading-relaxed">{email.snippet}</p>}

                    {/* Status/Timestamp - Only render if timestamp data exists */}
                    {(email.relativeTimestamp || email.specificTime) && (
                      <div className="flex items-center text-sm text-gray-400">
                        <DoubleCheckmarkIcon />
                        <span>
                          Received: {email.relativeTimestamp}
                          {email.relativeTimestamp && email.specificTime && ", "}
                          {email.specificTime}
                        </span>
                        
                      </div>
                      
                    )}
                    
                    
                  </div>
                  

                  {/* Reply Icon - Only render if showReplyIcon is true */}
                  {email.showReplyIcon && (
                    <div className="flex-shrink-0">
                      <ReplyIcon />
                    </div>
                  )}
                </div>
                
                {/* Separator - Add separator between emails except for the last one */}
                {index < emails.length - 1 && (
                  <div className="w-full h-px bg-gray-600 mt-6" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom label */}
        {/* <div className="text-center mt-4">
          <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded">360 x 590 Hug</span>
        </div> */}
      </div>
    </div>
  )
}
