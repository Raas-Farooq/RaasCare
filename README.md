# 🏥 Raas-Care — Full-Stack Healthcare & Appointment Management System

Raas-Care is a modern healthcare management platform designed to simplify the appointment booking process for patients while providing powerful dashboards for doctors and admins.  
It supports **role-based access**, **automatic slot generation**, **patient management**, and **real-time healthcare analytics**.

---

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

