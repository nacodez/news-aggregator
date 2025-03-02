## Running the Application with Docker

### Prerequisites

Before running the application, ensure you have Docker installed on your machine. To check if Docker is installed:

1. Open a terminal or command prompt.
2. Run the following command:
   docker --version
3. If Docker is installed, you should see version information (e.g., Docker version 20.10.7, build f0df350).
4. If Docker is not installed, please follow the installation guide to install Docker for your operating system at https://www.docker.com/get-started/.

### Running the Application with Docker

To run the project inside Docker, follow these steps:

1. Clone the repository to your local machine:
   git clone <https://github.com/nacodez/news-aggregator>

2. Navigate to the project directory:
   cd <news-aggregator>

3.Build and start the Docker containers:
docker-compose up --build

4. Access the Application:
   Frontend: Open your browser and go to http://localhost:3000.
   Backend: The backend is accessible at http://localhost:5000 (for API requests).

5. Stopping the Containers: To stop the running containers, use:
   docker-compose down
