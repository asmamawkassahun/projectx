export interface SingleCombinedVideo {
  title: string;
  fileName: string;
  duration: string;
  resolution: string;
  thumbnail: string;
}

export const dummySingleCombinedVideo: SingleCombinedVideo = {
  title: "Single combined video",
  fileName: "final_video_with_new_audio.mp4",
  duration: "0:26 sec",
  resolution: "720x1280",
  thumbnail: "/SCImage1.png", // Using the provided image path
};
