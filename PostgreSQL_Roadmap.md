---

## 1. Purpose
This document outlines how the WiseCents team will design, implement, host, and maintain the project’s PostgreSQL database. It covers the development phases from initial schema design to deployment, including security and management considerations.

---

## 2. Goals
- [ ] Establish a secure, scalable PostgreSQL environment for WiseCents.  
- [ ] Design a relational data structure aligned with the app’s objectives (tracking spending, goals, and AI-generated insights).  
- [ ] Ensure compatibility with Node.js/Express backend and Plaid API integration.  
- [ ] Define management, access control, and backup strategies.  

---

## 3. Research Summary
### 3.1 PostgreSQL Overview
- **Type:** Relational Database Management System (RDBMS)  
- **Why Chosen:**  
  - Open-source and reliable  
  - Strong ACID compliance  
  - Excellent for structured financial data  
  - Integrates well with Node.js via `pg`, `Sequelize`, or `Prisma`  

### 3.2 Hosting Options (Under Review)
| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Local PostgreSQL (Dev Machine)** | Easy setup, no cost | Not shareable remotely | Free |
| **Render / Railway.app** | Fast, student-friendly hosting | Free tier limited storage | Free / low cost |
| **Neon.tech (PostgreSQL Cloud)** | Serverless scaling, simple setup | Less control over configs | Free / low cost |
| **Supabase** | Built-in auth & APIs | Overhead features not needed | Free / low cost |

**Tentative Plan:** Use **Render** or **Neon.tech** for cloud hosting in production, local DB for dev/testing.

---

## 4. Database Design Plan
### 4.1 Phase 1 – ERD (Entity Relationship Diagram)
- Identify main entities: **Users, Transactions, Goals, Categories, Notifications, AI_Recommendations**  
- Define relationships (one-to-many, many-to-one).  
- Deliverable: ERD image in repo `/docs/erd.png`.  

### 4.2 Phase 2 – Schema Construction
- Write SQL scripts (`schema.sql`) for table creation.  
- Use foreign keys and constraints to ensure data integrity.  
- Example Tables:
  - `users` — stores user credentials and account info  
  - `transactions` — stores spending/income data  
  - `goals` — stores saving targets  
  - `categories` — links transactions to spending types  
  - `ai_recommendations` — stores personalized AI-generated advice  

### 4.3 Phase 3 – Integration
- Connect PostgreSQL to **Node.js backend** using the `pg` library.  
- Secure credentials using `.env` variables.  
- Test CRUD operations with dummy data.  

### 4.4 Phase 4 – Testing & Maintenance
- Create seed data (`seed_data.sql`) for demo and testing.  
- Implement data validation checks.  
- Prepare daily/weekly backup schedule on hosting platform.  

---

## 5. Security & Compliance
- **Encryption:** Use bcrypt for stored passwords.  
- **Access Control:** Create separate database roles for dev, admin, and app services.  
- **Data Handling:** Follow NIST and GLBA guidelines.  
- **Connection Security:** Only connect over HTTPS/SSL.  
- **Data Privacy:** Never store raw transaction data directly in AI prompts.  

---

## 6. Tools & Technologies
| Category | Tool | Purpose |
|-----------|------|---------|
| Database | PostgreSQL 15+ | Main data storage |
| Design | Lucidchart / dbdiagram.io | ERD creation |
| Client Connection | `pg` (Node.js package) | Database access |
| Management | pgAdmin / DBeaver | GUI management |
| Hosting | Render / Neon.tech | Cloud deployment |
| Backup | pg_dump | Data export/restore |

---

## 7. Timeline & Milestones
| Phase | Task | Owner | Deadline |
|-------|------|-------|----------|
| 1 | ERD Design | Koen | Oct 10, 2025 |
| 2 | Schema Build (`schema.sql`) | Koen | Oct 15, 2025 |
| 3 | Backend Connection Test | Jeremy + Koen | Oct 20, 2025 |
| 4 | Data Seeding & Validation | Koen | Oct 25, 2025 |

---

## 8. Expected Deliverables
- [x] `PostgreSQL_Roadmap.md` (this document)  
- [ ] `schema.sql` (database creation script)  
- [ ] `seed_data.sql` (sample test data)  
- [ ] `/docs/erd.png` (ERD diagram)  
- [ ] Connection test results in backend logs  

---

## 9. Next Steps
- [ ] Finalize hosting choice (Render vs. Neon).  
- [ ] Begin ERD design this week.  
- [ ] Create `schema.sql` next week and review structure with Jeremy before integration.  
