

const Home = () => {
    
    const handleSearchChange = (e) => {
        console.log("e.target.vlaue: ", e.target.value);
    }

    return(
        <div className="bg-gray-600">
            <label>
                Search Patient
            </label>
                <input type="search" name="search" onChange={handleSearchChange} />
        </div>
    )
}

export default Home