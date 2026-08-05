\# 🚨 Emergency Contact Directory



A full-stack web application to store and manage emergency contacts safely and accessibly.



!\[Emergency Contact Directory](https://img.shields.io/badge/Status-Live-brightgreen)

!\[GitHub Pages](https://img.shields.io/badge/Frontend-GitHub%20Pages-blue)

!\[Render](https://img.shields.io/badge/Backend-Render-purple)

!\[Node.js](https://img.shields.io/badge/Node.js-v24-green)

!\[Express](https://img.shields.io/badge/Express-v4.18-lightgrey)



\---



\## 🌍 Live Demo



| Part | URL |

|------|-----|

| 🌐 Frontend | \[Emergency Contact Directory](https://nareshkumarpunganoor-crypto.github.io/Emergency-Contact-Directory/) |

| ⚙️ Backend API | \[API Server](https://emergency-contact-naresh.onrender.com) |

| 📦 API Contacts | \[View Contacts](https://emergency-contact-naresh.onrender.com/api/contacts) |



\---



\## 📸 Features



\- ✅ Add emergency contacts

\- ✅ Edit existing contacts

\- ✅ Delete contacts

\- ✅ Search by name or phone number

\- ✅ Filter by category and priority

\- ✅ Priority badges (High 🔴, Medium 🟡, Low 🟢)

\- ✅ Category icons (Family, Doctor, Police, etc.)

\- ✅ Click-to-call phone links

\- ✅ Delete confirmation modal

\- ✅ Success and error notifications

\- ✅ Fully responsive design (Mobile friendly)



\---



\## 🛠️ Tech Stack



\### Frontend

| Technology | Usage |

|------------|-------|

| HTML5 | Structure |

| CSS3 | Styling \& Animations |

| JavaScript | Logic \& API calls |

| GitHub Pages | Hosting |



\### Backend

| Technology | Usage |

|------------|-------|

| Node.js | Runtime |

| Express.js | Web Framework |

| JSON File | Database |

| CORS | Cross Origin Requests |

| Nodemon | Development Server |

| Render.com | Hosting |



\---



\## 📁 Project Structure

&#x20;Emergency-Contact-Directory/

│

├── backend/

│ ├── server.js

│ ├── package.json

│ ├── data/

│ │ └── contacts.json

│ └── routes/

│ └── contacts.js

│

├── frontend/

│ ├── index.html

│ ├── style.css

│ └── script.js

│

├── index.html

├── style.css

├── script.js

├── .gitignore

└── README.md





\---



\## 🚀 API Endpoints



| Method | Endpoint | Description |

|--------|----------|-------------|

| GET | `/api/contacts` | Get all contacts |

| GET | `/api/contacts/:id` | Get single contact |

| POST | `/api/contacts` | Create new contact |

| PUT | `/api/contacts/:id` | Update a contact |

| DELETE | `/api/contacts/:id` | Delete a contact |



\---



\## 🔍 API Query Parameters



| Parameter | Example | Description |

|-----------|---------|-------------|

| search | `?search=john` | Search by name or phone |

| relationship | `?relationship=Doctor` | Filter by category |

| priority | `?priority=High` | Filter by priority |



\---



\## 📞 Contact Categories



| Icon | Category |

|------|----------|

| 👨‍👩‍👧‍👦 | Family |

| 🤝 | Friend |

| 🏥 | Doctor |

| 👮 | Police |

| 🚒 | Fire Department |

| 🚑 | Ambulance |

| 🏠 | Neighbor |

| 💼 | Workplace |

| 📋 | Other |



\---



\## 🎯 Priority Levels



| Priority | Color | Usage |

|----------|-------|-------|

| High | 🔴 Red | Most important contacts |

| Medium | 🟡 Yellow | Regular contacts |

| Low | 🟢 Green | Less urgent contacts |



\---



\## ⚙️ Run Locally



\### Prerequisites

\- Node.js installed

\- Git installed



\### Clone Repository



```bash

git clone https://github.com/nareshkumarpunganoor-crypto/Emergency-Contact-Directory.git

cd Emergency-Contact-Directory

