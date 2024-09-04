pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = 'bestburger-docker-credencials'
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
                    docker.build("${env.DOCKER_IMAGE}", ".")
                }
            }
        }
        stage('Login to Docker Hub') {
            steps {
                script {
                    docker.withRegistry("https://${env.DOCKER_REGISTRY}", "${env.DOCKER_CREDENTIALS_ID}") {
                        sh "docker login -u santiadi -p ${env.DOCKER_CREDENTIALS_ID}"
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    docker.image("${env.DOCKER_IMAGE}").push()
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
