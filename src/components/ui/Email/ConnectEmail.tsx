"use client"
import { Mail } from "lucide-react"
import Button from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

type EmailProps = {
  emailData: {
    action: boolean
    photo: boolean
  }
}

export default function Component({ emailData }: EmailProps) {

  if (emailData && emailData.action && emailData.photo) {
    return (

      <div className="p-4 pb-8 text-white/10 bg-background backdrop-blur-[1.25rem]">
        <div className="max-w-md mx-auto pt-8 rounded-xl">
          <h1 className="text-2xl font-semibold mb-8 text-foreground pl-20">Connect an account</h1>

          <div className="space-y-6 p-4  mb-16 w-full">

            <Card className="bg-white/10 ">
              <CardContent className="flex flex-col p-6 text-center space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-gray-300 text-sm text-left">
                    Connect your email account to send and receive email
                  </p>
                </div>

                <div className="relative w-full h-[20.625rem] mx-auto">
                  <Image
                    src="/Email.svg"
                    alt="email"
                    fill={true}
                    className="object-cover"
                  />
                </div>

                <Button className="w-full bg-white text-black hover:bg-gray-100 font-medium">
                  Add an email account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
  else if (emailData && emailData.action && !emailData.photo) {
    return (
      <div className="p-4 pb-8 text-white/10 bg-background backdrop-blur-[1.25rem]">
        <div className="max-w-md mx-auto pt-8 bg-[#1C1C1C] rounded-xl">
          <h1 className="text-2xl font-semibold mb-8 text-foreground pl-20">Connect an account</h1>

          <div className="space-y-6 p-4 mx-20 mb-16">

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-gray-300 text-sm text-left">Connect your email account to send and receive email</p>
                </div>

                <Button className="w-full bg-white text-black hover:bg-gray-100 font-medium" >
                  Add an email account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  else {
    return (
      <div className="p-4 pb-8 text-white/10 bg-background backdrop-blur-[1.25rem]">
        <div className="max-w-md mx-auto pt-8 bg-[#1C1C1C] rounded-xl">
          <h1 className="text-2xl font-semibold mb-8 text-foreground pl-20">Connect an account</h1>

          <div className="space-y-6 p-4 mx-20 mb-16">

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-gray-300 text-sm text-left">Connect your email account to send and receive email</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}
