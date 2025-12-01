# RecrutPlus

RecrutPlus is a recruitment management web application.  
It allows companies to post job offers, manage applications, and candidates to apply easily.

The project consists of two parts:
- **Frontend** : React + Vite + TypeScript (`recrutplus-frontend`)
- **Backend** : Java + Spring Boot + Maven (`recrutplus-backend`)

## Prerequisites

Before starting, make sure you have installed:

- **Node.js**
- **Java** (JDK 17 or higher)
- **Mysql**
- **Java IDE** such as IntelliJ IDEA or Eclipse (highly recommended for backend development)

### Cloner le projet
```bash
git clone https://github.com/Nicolab78/RecrutPlus.git
cd RecrutPlus
```


### Backend
Navigate to the backend folder:

```bash
   cd recrutplus-backend
```

Configure the database in `src/main/resources/application.properties`:
```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/recrutplus
   spring.datasource.username=your_username
   spring.datasource.password=your_password
```
Launch the application:
   
   **Option A - Using Maven wrapper:**
```bash
   ./mvnw spring-boot:run
```
   
   **Option B - Using Java IDE:**
   - Open the project
   - Click the "Run" button


The backend will be accessible at `http://localhost:8080`

### Frontend

Navigate to the frontend folder:

```bash
   cd recrutplus-frontend
```
Install dependencies:

```bash
   npm install
```

Run the application in development mode:

```bash
   npm run dev
```
The frontend will be accessible at `http://localhost:5173`
