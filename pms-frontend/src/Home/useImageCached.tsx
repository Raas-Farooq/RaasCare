import { useEffect, useState } from "react"

type ImageLoadingState = 'loaded' | 'loading' | 'failed'


const useImageCached = (src:string) => {

    const [imageLoaded, setImageLoaded] = useState<ImageLoadingState>('loading');

    useEffect(() => {

        if(!src) return;
        const image = new Image();                                                                                                                                                                                                                                   
        image.src= src;
            if(image.complete && image.naturalWidth > 0){
                setImageLoaded('loaded')
                return;
            }

      
        const handleLoad = () => setImageLoaded('loaded');
        const handleError = () => setImageLoaded('failed');

        
        image.addEventListener('load', handleLoad);
        image.addEventListener('error', handleError);

        return () => {
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
        }
        
    },[src])

    return {imageLoaded}
}

export default useImageCached