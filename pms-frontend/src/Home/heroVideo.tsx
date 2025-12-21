// import useImageCached from "./useImageCached"


const HeroVideo = () => {
    const videoUrl = import.meta.env.VITE_VIDEO_URL; 
    return (
        <div className="w-full flex justify-center mx-auto items-center max-w-6xl mx-auto px-4 py-6">
           <div className="w-full max-w-2xl md:max-w-4xl aspect-video">
             <video 
             controls
             autoPlay
                muted
                playsInline
                loop
             poster="./heroImage.webp"
              className="w-full h-full object-cover rounded-lg shadow-md">
                <source
                 src={videoUrl}
                 type="video/mp4"
                  />
                Your Browser doesn't support video tag.
            </video>
           </div>
        </div>
    )
}

export default HeroVideo

//  const {imageLoaded} = useImageCached('heroImage.webp')
//     return (
//         <div className="w-full max-w-6xl mx-auto px-4 py-6">
//             {imageLoaded === 'loading' && 
//             <div className="w-full h-[70vh] mx-auto px-4 py-6 bg-gray-200 animate-impulse rounded-lg">
                
//             </div>
//             }
//             <div className="w-full flex justify-center ">
//                 <img
//                 src={'/heroImage.webp'}
//                 loading="lazy"
//                 alt={`hero-image`}
//                 className={` ${imageLoaded === 'loaded' ? 'w-full h-auto max-h-[70vh] object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow ': 'hidden'} `} />
//             </div>
//         </div>

