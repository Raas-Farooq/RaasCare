# 🏥 Raas-Care — Full-Stack Healthcare & Appointment Management System

Raas-Care is a modern healthcare management platform designed to simplify the appointment booking process for patients while providing powerful dashboards for doctors and admins.  
It supports **role-based access**, **automatic slot generation**, **patient management**, and **real-time healthcare analytics**.

---
## Live Demo
**App Link**: https://raas-care.vercel.app

**Note**: You can directly login using one click buttons on login page otherwise the credentials are given below as well.

**Demo Credentials**

<h6 font="italic">Admin Login</h6>

email: raas@gmail.com

password: raas$0022

<h6 font="italic">Doctor Login</h6>

email: farhan@gmail.com

password: farhanali

## Screenshots

<h4>Admin Dashboard</h4>
<img width="1322" height="653" alt="readmiAdmin" src="https://github.com/user-attachments/assets/7ee76082-fd76-4d4a-991b-c32871663dd9" />

<h4>Doctor Dashboard</h4>
<img width="1314" height="615" alt="doctorDashboardReadmi" src="https://github.com/user-attachments/assets/abac73ab-ff9b-4248-82fc-381a24896ba8" />

<h4>Doctor Profile</h4>
<img width="1315" height="642" alt="doctorProfileReadmi" src="https://github.com/user-attachments/assets/253e3635-513d-4492-bb03-1086ab7ce891" />

<h4>New Patient Record</h4>
<img width="958" height="639" alt="newPatient" src="https://github.com/user-attachments/assets/c4230850-b2ff-4f64-b84b-d1045baf30d6" />

#### Admin Dashboard

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

## 🔮 Future Improvements

### Online Payment Integration
SafePay payment gateway integration (in progress)

### AI Features (Upcoming)
- **AI-assisted treatment strategy recommendations**
- **Symptom-based diagnosis prediction**  
  (initial medical insights before lab reports)

---

## 📁 Project Structure

