import { Link } from "react-router-dom"



const PortfolioSite = () => {

    const navLinks = [
        {
            name:'Home',
            path:'#'
        },
        {
            name:'About',
            path:'#'
        },
        {
            name:'Contact',
            path:'#'
        }
    ]
    
    return(
        <div className="max-w-7xl flex flex-col items-center justify-center mx-auto">
            <div>
                <nav className="flex flex-col sm:flex-row gap-6 m-3 ">
                    {navLinks.map((link => (
                        <Link
                        className="border border-pink-300 px-8 py-4 shadow-xl rounded-2xl hover:text-pink-600 "
                        to={link.path}
                        >{link.name}</Link>
                    )))}
                </nav>
            </div>
            <h1 className="text-5xl text-blue-500 px-6 py-3 "> My Work </h1>
        </div>
    )

}

export default PortfolioSite