pipeline {
    agent any
    tools {
        nodejs 'NodeJS-23'
        dockerTool 'DockerLocal'
    }
    environment {
        IMAGE_NAME = "nitin890/initial_jk_run"
        PATH = "/usr/local/bin:${env.PATH}"
        DOCKER_IMAGE = "docker.io/${IMAGE_NAME}:${BUILD_NUMBER}"
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'release', url: 'https://github.com/git-nitin01/node-shopping-server.git'
            }
        }
        stage('Setup .env File') {
            steps {
                script{
                    withCredentials([file(credentialsId: 'env-vars', variable: 'ENV_FILE')]) {
                        sh 'cp $ENV_FILE .env'
                        echo "Copied .env file to the workspace"
                    }
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Using Jenkins credentials stored in the 'docker-hub-credentials' credential ID
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials-id', 
                                                      usernameVariable: 'DOCKER_HUB_USER', 
                                                      passwordVariable: 'DOCKER_HUB_PASS')]) {
                        // Combine login and push in one script block
                        sh """
                            echo $DOCKER_HUB_PASS | docker login -u $DOCKER_HUB_USER --password-stdin
                            docker build -t $DOCKER_IMAGE .
                            docker push $DOCKER_IMAGE
                        """
                    }
                }
            } 
        }
        stage('Trigger Webhook') {
            steps {
                script {
                    // URL encode the Docker image URL to pass as a query parameter
                    def encodedImageURL = URLEncoder.encode("${DOCKER_IMAGE}:${BUILD_NUMBER}", "UTF-8")
                    echo "Triggering Render deployment with Webhook URL"
                    
                    // Use withCredentials to access the Render Webhook URL securely
                    withCredentials([string(credentialsId: 'render-webhook', variable: 'RENDER_WEBHOOK_URL')]) {
                        // Trigger the Render deployment via Webhook URL
                        sh """
                        curl -X POST \
                        -H "Accept: application/json" \
                        -H "Content-Type: application/json" \
                        $RENDER_WEBHOOK_URL&imgURL=${encodedImageURL}
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            deleteDir()
            echo "Pipeline finished with tag ${BUILD_NUMBER}"
        }
    }
}
