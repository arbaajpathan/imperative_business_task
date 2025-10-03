---

# Imperative Business Ventures - PDF Field Mapping Tool

[![React][react-badge]][react-url]
[![Vite][vite-badge]][vite-url]
[![Node.js][node-badge]][node-url]
[![Express][express-badge]][express-url]
[![MySQL][mysql-badge]][mysql-url]
[![Tailwind CSS][tailwind-badge]][tailwind-url]

A full-stack web application designed for interactive PDF field mapping and data review. This tool allows users to upload a PDF document, visually define data fields by drawing bounding boxes, and save these mappings to a database. A corresponding review interface allows executives to load the mapped data, view the fields in a structured form, and see the corresponding annotations highlighted on the PDF.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Live Demo / Screenshots](#live-demo--screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Directory Structure](#directory-structure)

## Project Overview

This project provides a streamlined solution for extracting structured data from PDF documents. It consists of two primary modules:

1.  **Mapping Page**: An interface for technical users to upload a PDF, draw rectangular areas over data points (like text fields, dates, or checkboxes), and define the properties for each area (e.g., `first_name`, `DateField`, `required`).
2.  **Executive Page**: A clean, user-friendly interface for reviewers to load a previously mapped document. It displays a dynamic form based on the mappings and allows users to click on any form field to instantly highlight the corresponding area on the PDF, ensuring data accuracy and context.

This system is ideal for digitizing forms, streamlining data entry processes, and creating a verifiable link between raw documents and structured data.

## Core Features

### 🗺️ Field Mapping Module
- **PDF Upload**: Securely upload PDF files to the server.
- **Interactive Drawing**: Draw bounding boxes directly onto the rendered PDF pages to define field areas.
- **Dynamic Field Configuration**: For each drawn box, configure properties like `field_name`, `field_header`, `field_type` (e.g., CharField, DateField), and validation rules like `required`.
- **Bulk Save**: Save all defined mappings for a document in a single, efficient API call.
- **Visual Feedback**: All drawn annotations are displayed on the PDF, providing immediate visual confirmation.

### 📋 Executive Review Module
- **Load by Document ID**: Retrieve all field mappings and the associated PDF by entering the unique Document ID generated during the mapping phase.
- **Dynamic Form Generation**: The application automatically generates a web form based on the fetched field metadata.
- **Interactive Annotation Highlighting**: Clicking or focusing on a form input instantly scrolls to the correct page and highlights the corresponding bounding box on the PDF viewer.
- **Multi-Page Support**: Seamlessly navigate between pages of the PDF document.
- **Zoom Functionality**: Zoom in and out of the PDF for better readability and precision.

## Tech Stack

The project is built with a modern, robust technology stack.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [React](https://react.dev/) ([Vite](https://vitejs.dev/)) | A fast and modern UI library for building the interactive user interface. |
| | [Tailwind CSS](https://tailwindcss.com/) | A utility-first CSS framework for rapid and responsive UI development. |
| | [React PDF](https://github.com/wojtekmaj/react-pdf) | A library for displaying and interacting with PDF documents in the browser. |
| | [Axios](https://axios-http.com/) | A promise-based HTTP client for making API requests to the backend. |
| | [Lucide React](https://lucide.dev/) | Beautiful and consistent icons. |
| **Backend** | [Node.js](https://nodejs.org/) | A JavaScript runtime for building the server-side application. |
| | [Express](https://expressjs.com/) | A minimal and flexible Node.js web application framework for building the REST API. |
| | [MySQL2](https://github.com/sidorares/node-mysql2) | A fast and feature-rich MySQL client for Node.js. |
| | [Multer](https://github.com/expressjs/multer) | A Node.js middleware for handling `multipart/form-data`, used for file uploads. |
| **Database** | [MySQL](https://www.mysql.com/) | A reliable open-source relational database for storing document and annotation data. |



## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18.x or later)
- [npm](https://www.npmjs.com/get-npm) (or yarn)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### Database Setup

1.  Start your MySQL server.
2.  Connect to your MySQL instance and create a new database.
    ```sql
    CREATE DATABASE pdf_mapper_db;
    ```
3.  Use the new database.
    ```sql
    USE pdf_mapper_db;
    ```
4.  Run the following SQL scripts to create the necessary tables:

    **`documents` Table:**
    ```sql
    CREATE TABLE documents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        process_id INT NOT NULL,
        form_id INT NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        storage_filename VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

    **`annotations` Table:**
    ```sql
    CREATE TABLE annotations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        document_id INT NOT NULL,
        field_name VARCHAR(255) NOT NULL,
        field_header VARCHAR(255),
        field_type VARCHAR(50),
        page_number INT NOT NULL,
        bbox_x1 FLOAT NOT NULL,
        bbox_y1 FLOAT NOT NULL,
        bbox_x2 FLOAT NOT NULL,
        bbox_y2 FLOAT NOT NULL,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
    );
    ```

### Backend Setup

1.  **Navigate to the Backend Directory**
    ```sh
    cd Backend
    ```
2.  **Install Dependencies**
    ```sh
    npm install
    ```
3.  **Configure Database Connection**
    - Open the `Backend/config/db.js` file.
    - Update the connection details (especially `password`) to match your MySQL setup.
    ```javascript
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'YOUR_MYSQL_PASSWORD', // <-- Change this
        database: 'pdf_mapper_db',
        // ...
    });
    ```
4.  **Start the Backend Server**
    ```sh
    npm start
    ```
    The backend server will be running on `http://localhost:3001`.

### Frontend Setup

1.  **Open a new terminal** and navigate to the frontend directory.
    ```sh
    cd Frontend
    ```
2.  **Install Dependencies**
    ```sh
    npm install
    ```
3.  **Start the Frontend Development Server**
    ```sh
    npm run dev
    ```
4.  **Open the Application**
    - Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## API Endpoints

The backend provides the following REST API endpoints:

#### `POST /api/documents/upload`
Uploads a PDF file and saves its metadata to the database.
- **Request Type**: `multipart/form-data`
- **Form Fields**:
  - `file`: The PDF file to upload.
  - `process_id`: (Number) The process identifier.
  - `form_id`: (Number) The form identifier.
- **Success Response** (201):
  ```json
  {
    "message": "File uploaded successfully",
    "documentId": 1,
    "filePath": "/uploads/file-1672531200000-123456789.pdf"
  }
  ```

#### `POST /api/annotations/bulk`
Saves a batch of field annotations for a specific document.
- **Request Body**:
  ```json
  {
    "documentId": 1,
    "annotations": [
      {
        "field_name": "first_name",
        "field_header": "First Name",
        "field_type": "CharField",
        "page": 1,
        "bbox": [0.1, 0.2, 0.3, 0.25],
        "metadata": { "required": true, "max_length": 50 }
      }
    ]
  }
  ```
- **Success Response** (201):
  ```json
  { "message": "Annotations saved successfully." }
  ```

#### `GET /api/annotations/document/:documentId`
Fetches all annotations and metadata for a given document ID.
- **URL Parameter**:
  - `documentId`: The ID of the document to retrieve.
- **Success Response** (200):
  ```json
  {
    "filePath": "/uploads/file-1672531200000-123456789.pdf",
    "fields": [
      {
        "id": 1,
        "annotation": {
          "bbox": { "x1": 0.1, "y1": 0.2, "x2": 0.3, "y2": 0.25 },
          "page": 1,
          "field_id": 1,
          "field_name": "first_name",
          "field_header": "First Name"
        },
        "field_name": "first_name",
        "field_header": "First Name",
        "field_type": "CharField",
        "max_length": 50,
        "required": true,
        "placeholder": "first name",
        "types": "char"
      }
    ]
  }
  ```

## Directory Structure

Here is a high-level overview of the project's structure:

```
arbaajpathan-imperative_business_task/
├── Backend/
│   ├── index.js            # Main server entry point
│   ├── package.json
│   ├── config/
│   │   └── db.js           # Database connection configuration
│   ├── controllers/
│   │   └── apiController.js  # Logic for handling API requests
│   ├── routes/
│   │   └── apiRoutes.js    # API route definitions
│   └── uploads/            # Directory for storing uploaded PDFs
│
└── Frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx             # Main application component with routing
        ├── main.jsx            # Frontend entry point
        ├── services/
        │   └── api.js          # Centralized API service for frontend
        ├── components/
        │   ├── FieldMappingPanel.jsx # UI for defining field properties
        │   ├── FormFieldDisplay.jsx  # Renders a single form field
        │   └── PDFViewer.jsx       # Component for PDF rendering and annotation
        └── pages/
            ├── ExecutivePage.jsx   # The executive review interface
            └── MappingPage.jsx     # The field mapping interface
```

[react-badge]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[vite-badge]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vitejs.dev/
[node-badge]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[express-badge]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[express-url]: https://expressjs.com/
[mysql-badge]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[mysql-url]: https://www.mysql.com/
[tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com/
