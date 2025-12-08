# 🏥 Raas-Care — Full-Stack Healthcare & Appointment Management System

Raas-Care is a modern healthcare management platform designed to simplify the appointment booking process for patients while providing powerful dashboards for doctors and admins.  
It supports **role-based access**, **automatic slot generation**, **patient management**, and **real-time healthcare analytics**.

---
## Live Demo
**App Link**: https://raas-care.vercel.app

**Note**: You can directly login as Visitor using demo credentials by just one click buttons. Available on login page otherwise credentials are given below as well.

**Demo Credentials**

### Admin Login  
**email:** raas@gmail.com  
**password:** raas$0022  

### Doctor Login

**email:** farhan@gmail.com

**password:** farhanali

## Screenshots

<h4>Admin Dashboard</h4>
<img width="831" height="637" alt="adminSun" src="https://github.com/user-attachments/assets/0939b54d-c576-4459-8850-306f588fc0a7" />

<h4>Doctor Dashboard</h4>
<img width="769" height="648" alt="doctorSun" src="https://github.com/user-attachments/assets/e983ae3d-5cc7-428e-b9d8-eaf27e3fc3fa" />

<h4>Slots Selection </h4>
<img width="831" height="634" alt="slotsSelection" src="https://github.com/user-attachments/assets/5276e10e-f2a7-4f1d-af1e-2066daf80c6a" />

<h4>Doctor Profile</h4>
<img width="1315" height="642" alt="doctorProfileReadmi" src="https://github.com/user-attachments/assets/253e3635-513d-4492-bb03-1086ab7ce891" />

<h4>New Patient Record</h4>
<img width="958" height="639" alt="newPatient" src="https://github.com/user-attachments/assets/c4230850-b2ff-4f64-b84b-d1045baf30d6" />


## Features

###  Admin Dashboard
- Add, update, or remove doctors
- Track monthly **revenue**, **appointments**, and **patient activity**
- View platform-wide analytics through charts
- Manage all appointments in the system (cancel, delete, complete)

###  Patient Portal
- View available slots in real-time
- Book, manage appointments
- Explore hospital services such as *Diagnostics*, *Home Nursing*, and more

###  Doctor Dashboard
- Manage daily appointments
- Add new patients (with diagnosis & treatment history)
- Update patient medical records
- Edit personal profile and availability
- Mark appointments as completed or cancelled


### ⏱ Automatic Slot Management
- Daily backend cron job auto-generates next-day doctor slots
- Removes outdated slots (previous than today)
- Ensures patients always see up-to-date availability

---

##  System Highlights

- Fully role-based system: **Admin**, **Doctor**, **Patient**
- Slot automation
- Real-time updates
- End-to-end healthcare workflow management
- Clean and modern UI built for accessibility
- Backend automation for operational accuracy
- Real-world patient management: treatment, diagnosis, history

---

## 🏗 Tech Stack

### Frontend
- **React**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Cron Jobs for Automation**

### Deployment
- **Frontend:** Vercel  
- **Backend:** Render
- **Database:** MongoDB Atlas  

---

## 📊 Admin Analytics (Reports)
The Admin dashboard shows:
- Monthly **Revenue**
- Monthly **Appointments**
- Patient growth
- Doctor activity insights

Charts are generated dynamically based on real-time data from the MongoDB database.

---

## High Level Architecture

Frontend (React/Tailwind)

      ↓ REST API
      
Backend (Node/Express)

      ↓
      
MongoDB (Mongoose)


## API Documentation
#### user/patient Routes
| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| POST   | `/pms/createNewUser`       | Register new patient |
| POST   | `/pms/loginUser`           | User login           |
| GET    | `/pms/logout`              | Logout user          |
| GET    | `/pms/checkAuthentication` | Verify auth token    |


#### admin routes
| Method | Endpoint                  | Description                  |
| ------ | ------------------------- | ---------------------------- |
| GET    | `/pms/getAllAdmins`       | Fetch all admins (protected) |
| POST   | `/pms/uploadOnCloudinary` | Upload profile images        |
| POST   | `/pms/createDoctor`       | Create new doctor            |

#### slots management Routes
| Method | Endpoint                           | Description                      |
| ------ | ---------------------------------- | -------------------------------- |
| POST   | `/pms/generateNewDoctorSlots`      | Generate doctor slots            |
| POST   | `/pms/bookSlot/:slotId`            | Book slot                        |
| GET    | `/pms/getDoctorBookedSlots/:docId` | Get booked slots                 |
| POST   | `/pms/handleAppointmentAction/:id` | Doctor/admin updates appointment |
| POST   | `/pms/bookAppointment/:id`         | Patient books appointment        |

#### doctor Routes
| Method | Endpoint                           | Description                      |
| ------ | ---------------------------------- | -------------------------------- | 
| GET    | `/pms/fetchAllDoctors`             | fetching available doctors       |
| GET    | `/pms/fetchDoctorProfile/:id`      | Fetch doctor profile             |
| POST   | `/pms/bookAppointment/:id`         | book appointment                 |
| POST   | `/pms/handleAppointmentAction/:id` | Doctor/admin updates appointment |
| POST   | `/pms/onlinePaymentRequest/:slotId`| Online Payment request           |

## Installation & Local Setup

`git clone https://github.com/Raas-Farooq/RaasCare.git`

cd RaasCare

##### 🛠 Backend Setup

cd backend
`npm install`

`add .env file`

`npm run dev`


##### 🧩 Frontend Setup

`cd pms-frontend`

`npm install`

`npm start`

##### .env
MONGO_URI=

JWT_SECRET=

SAFEPAY_SECRET_KEY=

SAFEPAY_MERCHANT_KEY=

NODE_ENV=development

FRONT_END=

SALT_ROUNDS=

PORT=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

BACKEND_URL=

## 🛡 Security Features

- JWT Authentication

- Role-based Access Control (RBAC)

- Password hashing using bcrypt

- Protected API routes

- Token expiry handling

- Form-data validation with middleware

- Cloudinary upload security presets

## 🔮 Future Improvements

### Online Payment Integration
SafePay payment gateway integration (in progress)

### AI Features (Upcoming)
- **AI-assisted treatment strategy recommendations**
- **Symptom-based diagnosis prediction**  
  (initial medical insights before lab reports)
### Web Sockets
- **for real time update

### Email/SMS reminders

### Redis 
- **for caching Analytics data
---

## Challenges & Solutions

#### Unique slot generation each day by preserving the old booked ones
→ Solved using a unique compound index: { doctorId, startDate, endDate, timeSlot }

#### Ensuring patient record linking with phone number
→ Implemented conditional matching + optional DOB check.

#### Automatic generation of next 14 days slots
→ Specific functions used to take simple day (Sun) and timeSlot (4:30-5:00 PM) and generate get slots of this time efficiently  
→ Aggregation pipelines optimized for using $match, $group, $project.

#### Role-based routing in React
→ Built a ProtectedRoute wrapper that checks JWT + role.

#### Cron jobs

→ Used cron jobs for auto slot generation instead of running logic on the frontend
