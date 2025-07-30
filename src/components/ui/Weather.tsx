// "use client"

// interface WeatherProps {
//     temperature?: number
//     location?: string
//     condition?: string
//     humidity?: number
//     cloudiness?: number
//     unit?: "C" | "F"
//     month?: string
//     forecast?: ForecastDay[]
// }

// interface ForecastDay {
//     date: number
//     temp: number
//     maxTemp: number
//     condition: string
// }

// const Weather = ({
//     temperature = 72,
//     location = "Addis Ababa",
//     condition = "Partly cloudy",
//     humidity = 65,
//     cloudiness = 40,
//     unit = "F",
//     month,
//     forecast,
// }: WeatherProps) => {
//     // const getWeatherImage = (condition: string) => {
//     //     const conditionLower = condition.toLowerCase()
//     //     if (conditionLower.includes("rain") || conditionLower.includes("storm")) {
//     //         return "https://i.ibb.co/GvQCM1VZ/raining.png"
//     //     } else if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
//     //         return "https://i.ibb.co/4ZF2CxXb/Sunny.png"
//     //     } else {
//     //         return "https://i.ibb.co/nq8RHbhV/Party-Cloudy.png"
//     //     }
//     // }

//     const getWeatherIcon = (condition: string) => {
//         const conditionLower = condition.toLowerCase()
//         if (conditionLower.includes("rain") || conditionLower.includes("storm")) {
//             return "https://i.ibb.co/GvQCM1VZ/raining.png"
//         } else if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
//             return "https://i.ibb.co/4ZF2CxXb/Sunny.png"
//         } else if (conditionLower.includes("cloud")) {
//             return "https://i.ibb.co/nq8RHbhV/Party-Cloudy.png"
//         } else {
//             return "🌤️"
//         }
//     }


//     // Full layout with month and forecast (like the image)
//     // if (month && forecast) {
//     //     return (
//     //         <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-6 text-white relative overflow-hidden">
//     //             {/* Background glow effect */}
//     //             {/* <div className="absolute top-1/4 right-8 w-48 h-48 bg-yellow-400 rounded-full blur-3xl opacity-80"></div> */}

//     //             {/* Main weather content */}
//     //             <div className="relative z-10">
//     //                 {/* Location */}
//     //                 <div className="mb-6">
//     //                     <h2 className="text-gray-400 text-lg font-medium">{location}</h2>
//     //                 </div>

//     //                 {/* Current temperature and weather icon */}
//     //                 <div className="flex justify-between items-start mb-8">
//     //                     <div className="flex-1">
//     //                         <div className="flex items-start">
//     //                             <span className="text-7xl font-light">{temperature}</span>
//     //                             <span className="text-3xl font-light mt-2">°{unit}</span>
//     //                         </div>
//     //                     </div>

//     //                     {/* Large weather icon */}
//     //                     <div className="w-24 h-24 filter drop-shadow-lg">
//     //                         <img
//     //                             src={getWeatherIcon(condition) || "/placeholder.svg"}
//     //                             alt={condition}
//     //                             className="w-full h-full object-contain"
//     //                         />
//     //                     </div>
//     //                 </div>

//     //                 {/* Weather condition and stats */}
//     //                 <div className="mb-8">
//     //                     <h3 className="text-2xl font-semibold mb-4">{condition}</h3>

//     //                     <div className="flex items-center space-x-6 text-gray-300">
//     //                         <div className="flex items-center space-x-2">
//     //                             <img src="https://i.ibb.co/0RK8nnbv/Clouds-16.png" alt="Clouds" className="w-4 h-4 object-contain" />
//     //                             <span className="text-sm">{cloudiness}%</span>
//     //                         </div>
//     //                         <div className="flex items-center space-x-2">
//     //                             <img src="https://i.ibb.co/xRBb2hq/Humidity-16.png" alt="Humidity" className="w-4 h-4 object-contain" />
//     //                             <span className="text-sm">{humidity}%</span>
//     //                         </div>
//     //                     </div>
//     //                 </div>

//     //                 {/* Month */}
//     //                 <div className="mb-6">
//     //                     <h4 className="text-xl font-medium text-gray-300">{month}</h4>
//     //                 </div>

//     //                 {/* 7-day forecast */}
//     //                 <div className="grid grid-cols-7 gap-2">
//     //                     {forecast.map((day, index) => (
//     //                         <div key={index} className="text-center">
//     //                             {/* Date */}
//     //                             <div className="text-gray-400 text-sm mb-2">{day.date}</div>

//     //                             {/* Temperature */}
//     //                             <div className="mb-2">
//     //                                 <div className="text-white font-medium text-lg">{day.temp}°</div>
//     //                                 <div className="text-gray-500 text-xs">{day.maxTemp} Max</div>
//     //                             </div>

//     //                             {/* Weather icon */}
//     //                             <div className="w-8 h-8 mx-auto">
//     //                                 <img
//     //                                     src={getWeatherIcon(day.condition) || "/placeholder.svg"}
//     //                                     alt={day.condition}
//     //                                     className="w-full h-full object-contain"
//     //                                 />
//     //                             </div>
//     //                         </div>
//     //                     ))}
//     //                 </div>
//     //             </div>
//     //         </div>
//     //     )
//     // }

//     if (month && forecast) {

//         return (
//             <>
//                 {/* Main container for the weather card */}
//                 <div className="  mx-auto left-[30.875rem] rounded-[1.375rem] opacity-100 text-white top-[19.4375rem] bg-white/10 backdrop-blur-[2.5rem] max-w-[28rem]">

//                     <div className="flex justify-between items-center ">
//                         {/* left section: City, Temp, and description */}
//                         <div className="flex flex-col gap-4 items-start mt-[4rem]   ml-[1.5rem] max-w-[33rem]">

//                             <div className=" w-[4.6rem] mt-[0.25rem] text-white">
//                                 {/* City name */}
//                                 <p className=" font-medium text-[0.9375rem] leading-[1.25rem] tracking-normal align-bottom opacity-50">{location}</p>
//                                 <div className="flex mt-1 text-white">
//                                     {/* Current temperature */}
//                                     <div className="text-[40px] font-medium leading-[130%]" style={{ fontSize: "40px" }}>
//                                         {temperature}
//                                     </div>
//                                     <div className="align-top mt-1 ml-1 text-[2.2rem]">&deg;{unit}</div>
//                                 </div>
//                             </div>

//                             {/* Bottom section: Condition and Stats */}
//                             <div className=" w-[8.5rem]  opacity-100">
//                                 {/* Weather condition */}
//                                 <p className="font-bold">{condition}</p>
//                                 <div className="flex items-center space-x-4 text-gray-200 text-sm mt-1">
//                                     <div className="flex items-center gap-2">
//                                         {/* Icon for cloudiness percentage */}
//                                         <img src="https://i.ibb.co/0RK8nnbv/Clouds-16.png" alt="Clouds-16" className="w-4 object-contain" />
//                                         {/* Cloudiness percentage */}
//                                         <span>{cloudiness}%</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <img src="https://i.ibb.co/xRBb2hq/Humidity-16.png" alt="Humidity" className="w-4 object-contain" />
//                                         {/* Humidity percentage */}
//                                         <span>{humidity}%</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Current weather icon */}
//                         <div className="max-w-[21rem] left-[6.875rem] mr-11 mt-4 opacity-100">
//                             {/* Current weather icon */}
//                             <img
//                                 src={getWeatherIcon(condition) || "/placeholder.svg"}
//                                 alt={condition}
//                                 className="w-full h-full object-contain"
//                             />
//                         </div>

//                     </div>



//                     {/* // Month and forecast section */}
//                     {/* Month */}
//                     <div className="ml-[1.5rem] mb-20 mr-5 ">


//                         <div className="mb-6">
//                             <h4 className="text-xl font-medium text-gray-300">{month}</h4>
//                         </div>

//                         {/* 7-day forecast */}
//                         <div className="grid grid-cols-7 gap-2">
//                             {forecast.map((day, index) => (
//                                 <div key={index} className=" flex flex-col  text-center">
//                                     {/* Date */}
//                                     <div className="text-gray-400 text-sm mb-2">{day.date}</div>

//                                     {/* Temperature */}
//                                     <div className="mb-2">
//                                         <div className="text-white font-medium text-lg">{day.temp}°</div>
//                                         <div className="text-gray-500 text-xs">{day.maxTemp} Max</div>
//                                     </div>

//                                     {/* Weather icon */}
//                                     <div className="w-8 h-8 mx-auto">
//                                         <img
//                                             src={getWeatherIcon(day.condition) || "/placeholder.svg"}
//                                             alt={day.condition}
//                                             className="w-full h-full object-contain"
//                                         />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>




//                 </div>
//             </>
//         )

//     }

//     return (
//         <>
//             {/* Main container for the weather card */}
//             <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-24 mx-auto p-6 rounded-[1.375rem] text-white bg-white/10 backdrop-blur-[2.5rem] max-w-[90%] md:max-w-[48rem]">

//                 {/* Left section */}
//                 <div className="flex flex-col gap-4 items-start">
//                     <div className="mt-2 text-white">
//                         <p className="font-medium text-[0.9375rem] leading-[1.25rem] tracking-normal align-bottom opacity-50">{location}</p>
//                         <div className="flex items-start mt-1 text-white">
//                             <div className="text-[2.5rem] font-medium leading-[130%]">{temperature}</div>
//                             <div className="mt-1 ml-1 text-[2.2rem]">&deg;{unit}</div>
//                         </div>
//                     </div>

//                     {/* Condition and Stats */}
//                     <div>
//                         <p className="font-bold">{condition}</p>
//                         <div className="flex items-center space-x-4 text-gray-200 text-sm mt-1">
//                             <div className="flex items-center gap-2">
//                                 <img src="https://i.ibb.co/0RK8nnbv/Clouds-16.png" alt="Clouds" className="w-4 object-contain" />
//                                 <span>{cloudiness}%</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <img src="https://i.ibb.co/xRBb2hq/Humidity-16.png" alt="Humidity" className="w-4 object-contain" />
//                                 <span>{humidity}%</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right section: Image */}
//                 <div className="w-full max-w-[14rem] h-[10rem] md:h-[12rem]">
//                     <img
//                         src={getWeatherIcon(condition) || "/placeholder.svg"}
//                         alt={condition}
//                         className="w-full h-full object-cover"
//                     />
//                 </div>
//             </div>

//         </>
//     )
// }

// export default Weather







"use client"

interface WeatherProps {
  temperature?: number
  location?: string
  condition?: string
  humidity?: number
  cloudiness?: number
  unit?: "C" | "F"
  month?: string
  forecast?: ForecastDay[]
}

interface ForecastDay {
  date: number
  temp: number
  maxTemp: number
  condition: string
}

const Weather = ({
  temperature = 72,
  location = "Addis Ababa",
  condition = "Partly cloudy",
  humidity = 65,
  cloudiness = 40,
  unit = "F",
  month,
  forecast,
}: WeatherProps) => {
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()
    if (conditionLower.includes("rain") || conditionLower.includes("storm")) {
      return "https://i.ibb.co/GvQCM1VZ/raining.png"
    } else if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
      return "https://i.ibb.co/4ZF2CxXb/Sunny.png"
    } else if (conditionLower.includes("cloud")) {
      return "https://i.ibb.co/nq8RHbhV/Party-Cloudy.png"
    } else {
      return "/placeholder.svg"
    }
  }

  // Full layout with month and forecast - responsive image positioning
  if (month && forecast) {
    return (
      <div className="w-full max-w-md mx-auto rounded-xl dark:bg-background dark:text-foreground text-white bg-white/10 backdrop-blur-[2.5rem] p-4 sm:p-6 dark:">
        {/* Main weather section */}
        <div className="flex flex-row justify-between items-center mb-6">
          {/* Weather icon - always on the right */}
          <div className="w-full max-w-[10rem] sm:max-w-[12rem] h-[8rem] sm:h-[10rem] mx-auto sm:mx-0 order-2">
            <img
              src={getWeatherIcon(condition) || "/placeholder.svg"}
              alt={condition}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Left section: City, Temp, and description - always on the left */}
          <div className="flex flex-col gap-4 items-start w-full sm:w-auto order-1 flex-1">
            <div className="text-white text-left">
              {/* City name */}
              <p className="font-medium text-[0.9375rem] leading-[1.25rem] tracking-normal opacity-50 mb-2">
                {location}
              </p>
              <div className="flex items-start justify-start text-white">
                {/* Current temperature */}
                <div className="text-[2.5rem] sm:text-[40px] font-medium leading-[130%]">{temperature}</div>
                <div className="mt-1 ml-1 text-[1.8rem] sm:text-[2.2rem]">&deg;{unit}</div>
              </div>
            </div>

            {/* Condition and Stats */}
            <div className="w-full sm:w-[8.5rem] text-left">
              {/* Weather condition */}
              <p className="font-bold mb-2">{condition}</p>
              <div className="flex items-center justify-start space-x-4 text-gray-200 text-sm">
                <div className="flex items-center gap-2">
                  {/* Icon for cloudiness percentage */}
                  <img src="https://i.ibb.co/0RK8nnbv/Clouds-16.png" alt="Clouds" className="w-4 h-4 object-contain" />
                  <span>{cloudiness}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="https://i.ibb.co/xRBb2hq/Humidity-16.png"
                    alt="Humidity"
                    className="w-4 h-4 object-contain"
                  />
                  <span>{humidity}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Month and forecast section */}
        <div className="mt-6 dark:bg-background dark:text-foreground">
          {/* Month */}
          <div className="mb-4 sm:mb-6 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-medium text-gray-300">{month}</h4>
          </div>

          {/* 7-day forecast */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {forecast.map((day, index) => (
              <div key={index} className="flex flex-col text-center">
                {/* Date */}
                <div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">{day.date}</div>

                {/* Temperature */}
                <div className="mb-1 sm:mb-2">
                  <div className="text-white font-medium text-sm sm:text-lg">{day.temp}°</div>
                  <div className="text-gray-500 text-xs">{day.maxTemp} Max</div>
                </div>

                {/* Weather icon */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto">
                  <img
                    src={getWeatherIcon(day.condition) || "/placeholder.svg"}
                    alt={day.condition}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Simple layout without month and forecast - always side by side
  return (
    <div className="flex flex-row justify-between items-center gap-6 md:gap-24 mx-auto p-6 rounded-xl dark:bg-background dark:text-foreground text-white bg-white/10 backdrop-blur-[2.5rem] max-w-md">
      {/* Image section - always on the right */}
      <div className="w-full max-w-[14rem] h-[10rem] md:h-[12rem] order-2">
        <img
          src={getWeatherIcon(condition) || "/placeholder.svg"}
          alt={condition}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Left section - always on the left */}
      <div className="flex flex-col gap-4 items-start order-1 flex-1">
        <div className="mt-2 text-white">
          <p className="font-medium text-[0.9375rem] leading-[1.25rem] tracking-normal opacity-50">{location}</p>
          <div className="flex items-start mt-1 text-white">
            <div className="text-[2.5rem] font-medium leading-[130%]">{temperature}</div>
            <div className="mt-1 ml-1 text-[2.2rem]">&deg;{unit}</div>
          </div>
        </div>

        {/* Condition and Stats */}
        <div>
          <p className="font-bold">{condition}</p>
          <div className="flex items-center space-x-4 text-gray-200 text-sm mt-1">
            <div className="flex items-center gap-2">
              <img src="https://i.ibb.co/0RK8nnbv/Clouds-16.png" alt="Clouds" className="w-4 h-4 object-contain" />
              <span>{cloudiness}%</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="https://i.ibb.co/xRBb2hq/Humidity-16.png" alt="Humidity" className="w-4 h-4 object-contain" />
              <span>{humidity}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather
