export const dummyGeneratedClips = 
[
            {
              imageSrc: "/GCImage1.png",
              step: "Step 1",
              duration: "26 sec",
              resolution: "1080x1920",
            },
            {
              imageSrc: "/GCImage2.png",
              step: "Step 2",
              duration: "9 min 26 sec",
              resolution: "1080x1920",
            },
            {
              imageSrc: "/GCImage3.png",
              step: "Step 3",
              duration: "4 min",
              resolution: "1080x1920",
            },
          ]

export type GeneratedClip = (typeof dummyGeneratedClips)[number];          