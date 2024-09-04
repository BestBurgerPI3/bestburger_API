pipeline {
    agent any

    environment {
        REGISTRY_CREDENTIALS = credentials('bestburger-docker-credencials') 
        DOCKER_IMAGE = 'santiadi/bestburger-back:latest'  
        DOCKER_REPO = 'santiadi/bestburger-back'
        DB_HOST = '74.235.191.229'
        DB_PORT = '3310'
        DB_USER = 'my-user'
        DB_PASSWORD = 'my-user-password'
        DB_NAME = 'bestburger'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t ${DOCKER_REPO}:${BUILD_NUMBER} .'
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    sh "echo $REGISTRY_CREDENTIALS_PSW | docker login -u $REGISTRY_CREDENTIALS_USR --password-stdin"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh 'docker tag ${DOCKER_REPO}:${BUILD_NUMBER} ${DOCKER_IMAGE}'
                    sh 'docker push ${DOCKER_IMAGE}'
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    dir('/home/didier.carvajal.2021/docker-compose.yaml') {  
                        sh 'docker-compose down'  
                        sh 'docker-compose pull'  
                        sh 'docker-compose up -d'  
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
        success {
            echo '¡Despliegue exitoso!'
        }
        failure {
            echo 'El despliegue falló.'
        }
    }
}
