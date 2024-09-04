pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = 'bestburger-docker-credencials' // ID de tus credenciales Docker en Jenkins
        DOCKER_IMAGE = 'santiadi/bestburger-back:latest'
        DOCKER_REGISTRY = 'docker.io'
        REPO_URL = 'https://github.com/BestBurgerPI3/bestburger_API.git'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: "${env.REPO_URL}"
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Construir la imagen Docker
                    docker.build("${env.DOCKER_IMAGE}", ".")
                }
            }
        }
        stage('Login & Push Docker Image') {
            steps {
                script {
                    // Iniciar sesión en Docker Hub y empujar la imagen
                    docker.withRegistry("https://${env.DOCKER_REGISTRY}", "${env.DOCKER_CREDENTIALS_ID}") {
                        docker.image("${env.DOCKER_IMAGE}").push()
                    }
                }
            }
        }
        stage('Deploy to Server') {
            steps {
                sh '''
                    docker-compose down
                    docker-compose pull back-bestburger
                    docker-compose up -d
                '''
            }
        }
    }
    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
