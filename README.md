# AIESEC Local Committee Management System

<img src="docs/images/AIESEC_logo_glow.png" width="50%" height="50%" alt="Logo">

#### Running the Application

## Development Environment

- Make sure the following network ports are not in use since the following services will be running from the container

  - 8080: phpmyadmin
  - 8081: server app
  - 3000: client app

- To build the images and run

```
	docker-compose -f docker-compose.dev.yml up
```

- To rebuild and run (in case the compose file was edited) use --force-recreate flag

```
	docker-compose -f docker-compose.dev.yml up --force-recreate
```

- Use Ctrl+C to stop all services

### Problem ❓:

AIESEC's current management system, based on Google apps, faces issues with:

- Data Insecurity
- Inefficiencies
- Poor User Experience

### Solution 💭:

We're developing a new system focused on:

- **Robust Security 🔐**: Through tiered user access.
- **Automation** 🤖: Streamlining repetitive tasks.
- **Enhanced UX**✨: A unified, user-friendly platform.

## Progress So Far:

1. Member management
2. 75% of iGV processes including:
   - Project management
   - Slot management
   - Application management

## Upcoming Features:

- **iGV (Remaining 25%)**:
  1.  Email automation system
  2.  Work reminder notifications
  3.  Post-arrival project participant management
  4.  Partner organizations management system
- **iGT**:

  1.  Internship opportunities system
  2.  Application management
  3.  Partner organization system
  4.  New partnership system

- **oGT + oGV**:

  1.  Applicants selection system
  2.  Marketing campaign system
  3.  Opportunities management system
  4.  Auto-suggestions for applicants

- **Marketing**:

  1.  Campaign management
  2.  Content management (photos, videos, posts, blogs)

- **Business Development**:

  1.  Market research & cold calls system
  2.  Revenue dashboard
  3.  Member target system

- **People Management**:

  _Note: Managed by the People Management team but accessible to all members._

  1.  Task management system (with reminders & member performance metrics)
  2.  Interview management tool
  3.  Opportunities hub (local, national, and international)
  4.  Event and special announcement notifications
  5.  Confidential member feedback (accessible only to President & VPs)
  6.  Achievement badges for member profiles
  7.  Training resources hub

- **Finance**:
  1.  Finance report publishing portal
  2.  Finance data collection (for future budgets and more)

### 🤺Run Locally ? check [installation guide](client/README.md)

## Tech Stack:

- **Client:**
  ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white)
  ![Formik](https://img.shields.io/badge/-Formik-162B4D?logo=formik&logoColor=white)
  ![MaterialUI](https://img.shields.io/badge/-MaterialUI-0081CB?logo=material-ui)

- **Server:**
  ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
  ![JWT](https://img.shields.io/badge/-JWT-000000?logo=json-web-tokens)
  ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white)
  ![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express)
  ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)

## Feedback

If you have any feedback, please reach out to us at test@test.com
