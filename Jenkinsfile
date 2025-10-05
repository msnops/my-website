pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = 'devops-academy'
        IMAGE_NAME = 'frontend'
        HELM_CHART_PATH = './frontend/helm'
        K8S_NAMESPACE = 'default'
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out commit: ${GIT_COMMIT_SHORT}"
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        npm ci
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh '''
                        npm run typecheck
                        npm run lint
                    '''
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    sh '''
                        npm run build
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -f frontend/Dockerfile \
                            -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/${IMAGE_NAME}:${GIT_COMMIT_SHORT} \
                            -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/${IMAGE_NAME}:latest \
                            .
                    """
                }
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials',
                                                     usernameVariable: 'DOCKER_USER',
                                                     passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin ${DOCKER_REGISTRY}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/${IMAGE_NAME}:${GIT_COMMIT_SHORT}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/${IMAGE_NAME}:latest
                        """
                    }
                }
            }
        }

        stage('Helm Lint') {
            steps {
                script {
                    sh """
                        helm lint ${HELM_CHART_PATH}
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withKubeConfig([credentialsId: 'kubernetes-config']) {
                        sh """
                            helm upgrade --install devops-academy-frontend ${HELM_CHART_PATH} \
                                --namespace ${K8S_NAMESPACE} \
                                --set image.tag=${GIT_COMMIT_SHORT} \
                                --wait \
                                --timeout 5m
                        """
                    }
                }
            }
        }

        stage('Verify Deployment') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh """
                        kubectl rollout status deployment/devops-academy-frontend -n ${K8S_NAMESPACE}
                        kubectl get pods -n ${K8S_NAMESPACE} -l app=devops-academy-frontend
                    """
                }
            }
        }

        stage('Run Smoke Tests') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh """
                        # Wait for service to be ready
                        sleep 10
                        # Get service endpoint and test
                        ENDPOINT=\$(kubectl get ingress devops-academy-frontend-ingress -n ${K8S_NAMESPACE} -o jsonpath='{.spec.rules[0].host}')
                        curl -f http://\$ENDPOINT || exit 1
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
            emailext(
                subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' completed successfully.

                Check console output at ${env.BUILD_URL}""",
                to: 'devops@academy.com'
            )
        }
        failure {
            echo 'Pipeline failed!'
            emailext(
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' failed.

                Check console output at ${env.BUILD_URL}""",
                to: 'devops@academy.com'
            )
        }
        always {
            cleanWs()
        }
    }
}
