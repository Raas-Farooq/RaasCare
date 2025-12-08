

const DemoCredentials = () => {


    return (
        <div className="w-full max-w-3xl mx-auto mt-10">
            <div className="bg-white shadow-lg rounded-xl p-4 border border-purple-100">
                <h2 className="text-xl font-bold text-purple-700 mb-3 flex items-center gap-2">
                    🔐 Demo Login Credentials
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                    {/* Admin Card */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-700 mb-2">Admin</h3>
                        <p className="text-sm"><strong>Email:</strong> raas@gmail.com</p>
                        <p className="text-sm"><strong>Password:</strong> raas$0022</p>
                    </div>

                    {/* Doctor Card */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-700 mb-2">Doctor</h3>
                        <p className="text-sm"><strong>Email:</strong> farhan@gmail.com</p>
                        <p className="text-sm"><strong>Password:</strong> farhanali</p>
                    </div>

                </div>

                <div className="mt-4 text-sm text-gray-500">
                    *These accounts are read-only and safe for demo purposes.
                </div>
            </div>
        </div>

    )
}

export default DemoCredentials