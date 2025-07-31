"use client"
import React from "react"
import Button from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MatchStats {
  label: string
  value: string | number
}

interface Team {
  name: string
  logoUrl?: string
  score: number
  logoType?: "al-nassr" | "al-khaleej" | "custom"
}

interface Player {
  name: string
  avatarUrl?: string
  minutesPlayed: number
  distanceRan: string
  opponent: string
}

interface SportsDetailProps {
  player?: Player
  match?: {
    homeTeam: Team
    awayTeam: Team
    status: string
  }
  stats?: MatchStats[]
  callToAction?: {
    text: string
    link: string
  }
  variant?: "full-details" | "minimal" | "minimal-info" | "stats" | "rich"
  largeImageUrl?: string
}

export default function SportsDetail({
  player,
  match,
  stats = [],
  callToAction,
  variant = "full-details",
  largeImageUrl
}: SportsDetailProps) {
  
  const handleCallToAction = () => {
    if (callToAction?.link) {
      window.open(callToAction.link, "_blank")
    }
  }

  const renderTeamLogo = (team: Team) => {
    const { logoType, logoUrl, name } = team
    
    if (logoUrl) {
      return <img src={logoUrl} alt={`${name} logo`} className="w-full h-full object-cover rounded-full" />
    }
    
    switch (logoType) {
      case "al-nassr":
        return (
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AN</span>
          </div>
        )
      case "al-khaleej":
        return (
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AK</span>
          </div>
        )
      default:
        return (
          <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{name.charAt(0)}</span>
          </div>
        )
    }
  }

  const renderFullDetails = () => (
    <div className="bg-white/10 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Sports Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>
      {/* Player Info Header */}
      {player && (
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
            <AvatarImage src={player.avatarUrl} alt={player.name} />
            <AvatarFallback className="bg-gray-600 text-white text-sm">
              {player.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-white text-lg font-semibold">{player.name}</p>
            <p className="text-gray-400 text-sm leading-tight">
              played for {player.minutesPlayed} minutes in his last match
              against {player.opponent}, and ran a total of {player.distanceRan}
            </p>
          </div>
        </div>
      )}

      {/* Match Score */}
      {match && (
        <div className="p-5 flex flex-col items-center justify-center mb-6">
          <div className="flex justify-between items-center w-full max-w-[300px] mb-4">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {renderTeamLogo(match.homeTeam)}
              </div>
              <p className="text-white text-sm font-medium">
                {match.homeTeam.name}
              </p>
            </div>

            {/* Score and Status */}
            <div className="flex flex-col items-center">
              <p className="text-white text-5xl font-bold">
                {match.homeTeam.score} - {match.awayTeam.score}
              </p>
              <p className="text-gray-300 text-sm font-medium">
                {match.status}
              </p>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {renderTeamLogo(match.awayTeam)}
              </div>
              <p className="text-white text-sm font-medium">
                {match.awayTeam.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics List */}
      {stats.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-xl p-4 flex justify-between items-center"
            >
              <p className="text-gray-300 text-base">{stat.label}</p>
              <p className="text-white text-base font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {callToAction && (
        <Button
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  );

  const renderMinimal = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Sports Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Minimal</span>
        </div>
      </div>

      {/* Player Info Header */}
      {player && (
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
            <AvatarImage src={player.avatarUrl} alt={player.name} />
            <AvatarFallback className="bg-gray-600 text-white text-sm">
              {player.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-white text-lg font-semibold">{player.name}</p>
            <p className="text-gray-400 text-sm leading-tight">
              played for {player.minutesPlayed} minutes in his last match against {player.opponent}, and ran a total of {player.distanceRan}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  const renderMinimalInfo = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Sports Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Minimal + Info</span>
        </div>
      </div>

      {/* Player Info Header */}
      {player && (
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
            <AvatarImage src={player.avatarUrl} alt={player.name} />
            <AvatarFallback className="bg-gray-600 text-white text-sm">
              {player.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-white text-lg font-semibold">{player.name}</p>
            <p className="text-gray-400 text-sm leading-tight">
              played for {player.minutesPlayed} minutes in his last match against {player.opponent}, and ran a total of {player.distanceRan}
            </p>
          </div>
        </div>
      )}

      {/* Match Score */}
      {match && (
        <div className="p-5 flex flex-col items-center justify-center">
          <div className="flex justify-between items-center w-full max-w-[300px] mb-4">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {renderTeamLogo(match.homeTeam)}
              </div>
              <p className="text-white text-sm font-medium">{match.homeTeam.name}</p>
            </div>

            {/* Score and Status */}
            <div className="flex flex-col items-center">
              <p className="text-white text-5xl font-bold">
                {match.homeTeam.score} - {match.awayTeam.score}
              </p>
              <p className="text-gray-300 text-sm font-medium">{match.status}</p>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {renderTeamLogo(match.awayTeam)}
              </div>
              <p className="text-white text-sm font-medium">{match.awayTeam.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStats = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Sports Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Stats</span>
        </div>
      </div>

      {/* Player Info Header */}
      {player && (
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
            <AvatarImage src={player.avatarUrl} alt={player.name} />
            <AvatarFallback className="bg-gray-600 text-white text-sm">
              {player.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-white text-lg font-semibold">{player.name}</p>
            <p className="text-gray-400 text-sm leading-tight">
              played for {player.minutesPlayed} minutes in his last match against {player.opponent}, and ran a total of {player.distanceRan}
            </p>
          </div>
        </div>
      )}

      {/* Match Score */}
      {match && (
        <div className="p-5 flex flex-col items-center justify-center mb-6">
          <div className="flex justify-between items-center w-full max-w-[300px] mb-4">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {renderTeamLogo(match.homeTeam)}
              </div>
              <p className="text-white text-sm font-medium">{match.homeTeam.name}</p>
            </div>

            {/* Score and Status */}
            <div className="flex flex-col items-center">
              <p className="text-white text-5xl font-bold">
                {match.homeTeam.score} - {match.awayTeam.score}
              </p>
              <p className="text-gray-300 text-sm font-medium">{match.status}</p>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {renderTeamLogo(match.awayTeam)}
              </div>
              <p className="text-white text-sm font-medium">{match.awayTeam.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics List */}
      {stats.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-4 flex justify-between items-center">
              <p className="text-gray-300 text-base">{stat.label}</p>
              <p className="text-white text-base font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg"
        >
          {callToAction.text}
        </Button>
      )}
    </div>
  )

  const renderRich = () => (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-md mx-auto rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Sports Details</h1>
        <div className="h-0.5 bg-white w-full"></div>
      </div>

      {/* Component Label */}
      <div className="mb-6">
        <div className="text-purple-400 text-sm mb-1">Component</div>
        <div className="text-purple-400 font-medium flex items-center gap-1">
          <span className="text-purple-400">✦</span>
          <span>Rich</span>
        </div>
      </div>

      {/* Player Info Header */}
      {player && (
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
            <AvatarImage src={player.avatarUrl} alt={player.name} />
            <AvatarFallback className="bg-gray-600 text-white text-sm">
              {player.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-white text-lg font-semibold">{player.name}</p>
            <p className="text-gray-400 text-sm leading-tight">
              played for {player.minutesPlayed} minutes in his last match against {player.opponent}, and ran a total of {player.distanceRan}
            </p>
          </div>
        </div>
      )}

      {/* Large Player Image with Match Score Overlay */}
      {largeImageUrl && match && (
        <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
          <img 
            src={largeImageUrl} 
            alt={player?.name || "Player"} 
            className="w-full h-full object-cover"
          />
          
          {/* Match Score Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
            <div className="flex justify-between items-center w-full">
              {/* Home Team */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
                  {renderTeamLogo(match.homeTeam)}
                </div>
                <p className="text-white text-xs font-medium">{match.homeTeam.name}</p>
              </div>

              {/* Score and Status */}
              <div className="flex flex-col items-center">
                <p className="text-white text-3xl font-bold">
                  {match.homeTeam.score} - {match.awayTeam.score}
                </p>
                <p className="text-gray-300 text-xs font-medium">{match.status}</p>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center">
                  {renderTeamLogo(match.awayTeam)}
                </div>
                <p className="text-white text-xs font-medium">{match.awayTeam.name}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {callToAction && (
        <Button 
          onClick={handleCallToAction}
          className="w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg"
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
    case "minimal-info":
      return renderMinimalInfo()
    case "stats":
      return renderStats()
    case "rich":
      return renderRich()
    case "full-details":
    default:
      return renderFullDetails()
  }
}
