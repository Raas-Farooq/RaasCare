import useImageCached from "./useImageCached"


const HeroImage = () => {
    const {imageLoaded} = useImageCached('heroImage.webp')
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            {imageLoaded === 'loading' && 
            <div className="w-full h-[70vh] mx-auto px-4 py-6 bg-gray-200 animate-impulse rounded-lg">
                
            </div>
            }
            <div className="w-full flex justify-center ">
                <img
                src={'/heroImage.webp'}
                loading="lazy"
                alt={`hero-image`}
                className={` ${imageLoaded === 'loaded' ? 'w-full h-auto max-h-[70vh] object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow ': 'hidden'} `} />
            </div>
        </div>
    )
}

export default HeroImage

// what is the diff btw transtion and transition-all

