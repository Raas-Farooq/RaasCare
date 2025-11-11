import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import {type ChangeEvent } from "react";
import HandleAxiosError from "../../../utils/handleAxiosError";
import { type ProfileImageProps } from "../admin.types";
// import HandleAxiosError from "../../utils/handleAxiosError";

interface ImageUploadProps{
        imgSrc:string,
        setImgSrc:React.Dispatch<React.SetStateAction<string>>,
        profileImageData:ProfileImageProps,
        setProfileImageData:React.Dispatch<React.SetStateAction<ProfileImageProps>>
}

const backend_url = import.meta.env.VITE_BACKEND_URL;
const UploadProfileImage :React.FC<ImageUploadProps> = ({ imgSrc, setImgSrc, setProfileImageData}) => {
    async function handleImageInsertion(e: ChangeEvent<HTMLInputElement>) {
        const toastId = toast.loading('Uploading on Cloudinary')
        if (e.target.files) {
            try {
                const image = e.target.files[0];
                const url = URL.createObjectURL(image);
                setImgSrc(url);
                const formData = new FormData();
                formData.append('image', image);
                const cloudinaryResult = await axios.post(`${backend_url}/pms/uploadOnCloudinary`, formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                )
                const response = cloudinaryResult.data;
                if (cloudinaryResult.data.success) {
                    localStorage.setItem("doctorProfileImage", response.url);
                    localStorage.setItem("doctorProfilePublic_id", response.public_id);
                    setProfileImageData(prev => ({
                        ...prev,
                        imageUrl:response.url,
                        public_id: response.public_id
                    }))
                    toast.dismiss(toastId);
                    toast.success("Success!")
                }
            }
            catch (err) {
                 let errorMessage = HandleAxiosError(err);
                toast.error(errorMessage, { id: toastId });
                setProfileImageData({imageUrl:'', public_id:''})
            }
        }
    }

    return (
        <div className="max-w-xs">
            <p className="text-gray-500 mb-2 block">
                Select Profile Image
            </p>

            {/* Hidden file input */}
            <input
                type="file"     
                id="docProfileImg"
                accept="image/*"
                onChange={handleImageInsertion}
                className="hidden"
            />

            {/* Custom clickable area */}
            <label
                htmlFor="docProfileImg"
                className="cursor-pointer inline-flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition-colors"
            >
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                ) : (
                    <FaUserCircle size={64} className="text-gray-400" />
                )}
                <span className="text-sm text-gray-600">
                    {imgSrc ? "Change Image" : "Click to upload image"}
                </span>
            </label>
        </div>
    )
}

export default UploadProfileImage