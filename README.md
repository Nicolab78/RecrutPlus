![CI](https://github.com/Nicolab78/RecrutPlus/actions/workflows/ci.yml/badge.svg)
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

## Tests & Quality

### Run tests
```bash
cd recrutplus-backend
mvn test
```

### Run tests with coverage
```bash
cd recrutplus-backend
mvn clean verify
```
The coverage report is generated in `target/site/jacoco/index.html`.

### Run SonarQube locally
```bash
# Start SonarQube
docker run -d --name sonarqube \
  -p 9000:9000 \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  sonarqube:community

# Run analysis
cd recrutplus-backend
mvn clean verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
  -Dsonar.projectKey=recrutplus \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_TOKEN
```

### Contributing to a PR
1. Create a branch from `dev`
2. Develop and commit (pre-commit hooks check style automatically)
3. Open a PR to `dev`
4. CI runs tests automatically
