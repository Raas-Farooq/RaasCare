import { Brain, Cylinder, Droplet, Mail, Scissors, Stethoscope } from "lucide-react";
import { FaBaby, FaHeartbeat, FaInstagram, FaLinkedin, FaSnapchat, FaTooth, FaTwitter, FaWhatsapp } from "react-icons/fa";


const doctorsSpecialities = [
    { speciality: 'All Doctors', logo: <Stethoscope size={40} className="text-purple-500" />, strength: 7 },
    { speciality: 'Physician', logo: <Stethoscope size={40} className="text-purple-500" />, strength: 7 },
    { speciality: 'Cardialogist', logo: <FaHeartbeat size={40} className="text-purple-500" />, strength: 7 },
    { speciality: 'Surgeon', logo: <Scissors size={40} className="text-purple-500" />, strength: 6 },
    { speciality: 'Gynecologist', logo: <FaBaby size={40} className="text-purple-500" />, strength: 5 },
    { speciality: 'Gastroenterologist', logo: <Cylinder size={40} className="text-purple-500" />, strength: 6 },
    { speciality: 'Oncologist', logo: <FaTooth size={40} className="text-purple-500" />, strength: 6 },
    { speciality: 'Dermatologist', logo: <Droplet size={40} className="text-purple-500" />, strength: 3 },
    { speciality: 'Psychologist', logo: <Brain size={40} className="text-purple-500" />, strength: 4 },
    { speciality: 'Dentist', logo: <Brain size={40} className="text-purple-500" />, strength: 4 },
    { speciality: 'Orthopaedics', logo: <Brain size={40} className="text-purple-500" />, strength: 4 },
    { speciality: 'Neurologist', logo: <Brain size={40} className="text-purple-500" />, strength: 4 },
]

const servicesImages = [
    {
        title: 'Our Doctors',
        path: '/youngDoctor.jpg',
        alt: "Our Doctors List ",
        description: 'Board-certified specialists',
        cta: 'view Doctors list'

    },
    {
        title: 'Nursing Care',
        path: '/nursingCare1.webp',
        alt: "Nursing Care Unit ",
        description: '24/7 Care for You',
        cta: 'contact with the center'

    }, {
        title: 'Diagnostic Center',
        path: '/MRI.webp',
        alt: "Diagnostic Center",
        description: 'Provide 90% Accurate results',
        cta: 'checkout more'
    }
]

const footerLinks = [
    {
        name: 'Professionals',
        data: [
            'Physicians',
            'Cardialogists',
            'Surgeons',
            'Gynecologists',
            'Gastroenterologists',
            'Oncology',
            'Dermatologists',
            'Psychologists',
        ]
    },
    {
        name: 'Departments',
        data: ['Surgical Department',
            'Cardic Center',
            'Cancer Care',
            'Gyny Facilities',
            'Dental Research Search',
            'Skin Care',
            'Mental Health Center']
    },
    {
        name: 'Blogs And News',
        data: ['Daily News',
            'Daily Blog',
            'Weekly Doctors Blog',
            'Blog on Research',
            'Patients Reviews',
            'Recognition & Awards',]
    },
    {
        name: 'About',
        data: [
            'About Us',
            'Contact',
            'Locations',
            'Help Center',
            'Our Research Center',
            'About Rehabiliation',
            'More Services']
    },
    {
        name: 'More',
        data: [
            'Career',
            'Education and Training',
            'Research Activities',
            'Home Services',
            'Patients Reviews',
            'Recognition & Awards'
        ]
    }
]



const myIcons = [
  { logo: <FaTwitter className="text-blue-400 border border-gray-300 p-2 rounded-full hover:bg-blue-100 transition-all duration-200 hover:scale-110 " size={40} />, type:'Twitter' },
  { logo: <FaSnapchat className="text-yellow-400 border border-gray-300 p-2 rounded-full hover:bg-yellow-100 transition-all duration-200 hover:scale-110" size={40} />, type:'Snapchat' },
  { logo: <FaWhatsapp className="text-green-500 border border-gray-300 p-2 rounded-full hover:bg-green-100 transition-all duration-200 hover:scale-110" size={40} />, type:'WhatsApp'},
  { logo: <FaLinkedin className="text-blue-500 border border-gray-300 p-2 rounded-full hover:bg-blue-100 transition-all duration-200 hover:scale-110" size={40} />, type:'LinkedIn' },
  { logo: <FaInstagram className="text-pink-500 border border-gray-300 p-2 rounded-full hover:bg-pink-100 transition-all duration-200 hover:scale-110" size={40} />, type:'Instagram'},
  { logo: <Mail className="text-gray-700 border border-gray-300 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110" size={40} />, type:'Mail' }
]


const termsAndConditions = [
    'Terms and Conditions',
    'Privacy Policy',
    'Copyright And Licensing',
    'About This Website',
    'Site Map',
    'Website Usage',
    "Manage Cookies",
    'Send Us Feedback',
]


export {  footerLinks, doctorsSpecialities, servicesImages, myIcons, termsAndConditions }