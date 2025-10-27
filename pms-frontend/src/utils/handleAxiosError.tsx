


const HandleAxiosError = (err:string | any ) => {
    if (err.response) {
        const { status, data } = err.response;
        if (status.code === 409) {
            return "A user with this email already exists.";
        }
        if (data.message) return data.message
        return "Server responded with an error. Please try again.";
    }
    if (err.request) return  "Network error. Please check your internet connection.";
    

    return "Unexpected error occured. Please try again later."
}

export default HandleAxiosError