

const HeroImage = () => {

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            <img
                src={'/hospitalWallpaper.jpg'}
                alt={`hero-image`}
                className="w-full h-auto max-h-[70vh] object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow" />
        </div>
    )
}

export default HeroImage

// what is the diff btw transtion and transition-all

