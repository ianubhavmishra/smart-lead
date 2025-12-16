# Smart Lead Automation System

A full-stack application that simulates a lead enrichment and automation workflow.  
This project demonstrates batch API processing, business logic execution, background automation, and data integrity handling.

---

## 🚀 Live Links

- *Frontend URL:* https://smart-lead-ka4x.onrender.com
---

## 📦 Tech Stack

*Frontend*
- React
- Axios
- Tailwind

*Backend*
- Node.js
- Express.js

*Database*
- MongoDB (MERN Stack)  

*Other Tools*
- Nationalize.io API
- node-cron (for background automation)

---

## 🧠 Project Overview

The Smart Lead Automation System accepts a batch of first names, enriches them using an external API to predict nationality, applies business rules to verify leads, stores them in a database, and automatically syncs verified leads to a simulated CRM system.

---

## 🖥 Features

### Frontend Dashboard
- Batch input of names (comma-separated)
- Submit names for processing
- Live results table with:
  - Name
  - Predicted Country
  - Probability Score
  - Status (Verified / To Check)
- Filter leads by status

### Backend Automation
- Batch enrichment using Nationalize.io API
- Business logic for lead verification
- Persistent storage in database
- Background job for CRM sync simulation
- Idempotent processing (no duplicate syncs)
