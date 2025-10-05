pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = 'saas-academy'
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

        stage('Install Frontend Dependencies') {
            steps {
                script {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                script {
                    sh '''
                        npm run typecheck
                        npm run lint
                    '''
                }
            }
        }

        stage('Build Frontend Application') {
            steps {
                script {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    sh """
                        docker build -f frontend/Dockerfile \
                            -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/frontend:${GIT_COMMIT_SHORT} \
                            -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/frontend:latest \
                            .
                    """
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    script {
                        sh 'npm ci'
                    }
                }
            }
        }

        stage('Build Backend Application') {
            steps {
                dir('backend') {
                    script {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    sh """
                        docker build -f backend/Dockerfile \
                            -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/backend:${GIT_COMMIT_SHORT} \
                            -t ${DOCKER_REGISTRY}/${DOCKER_REPO}/backend:latest \
                            backend/
                    """
                }
            }
        }

        stage('Push Docker Images') {
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
                            docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/frontend:${GIT_COMMIT_SHORT}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/frontend:latest
                            docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/backend:${GIT_COMMIT_SHORT}
                            docker push ${DOCKER_REGISTRY}/${DOCKER_REPO}/backend:latest
                        """
                    }
                }
            }
        }

        stage('Helm Lint') {
            steps {
                script {
                    sh '''
                        helm lint ./frontend/helm
                        helm lint ./backend/helm
                        helm lint ./infra/helm/myapp
                    '''
                }
            }
        }

        stage('Deploy PostgreSQL') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withKubeConfig([credentialsId: 'kubernetes-config']) {
                        sh '''
                            kubectl apply -f infra/k8s/postgresql.yaml
                            kubectl wait --for=condition=ready pod -l app=postgres -n database --timeout=300s
                        '''
                    }
                }
            }
        }

        stage('Deploy Backend') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withKubeConfig([credentialsId: 'kubernetes-config']) {
                        sh """
                            helm upgrade --install saas-academy-backend ./backend/helm \
                                --namespace ${K8S_NAMESPACE} \
                                --set image.tag=${GIT_COMMIT_SHORT} \
                                --wait \
                                --timeout 5m
                        """
                    }
                }
            }
        }

        stage('Deploy Frontend') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withKubeConfig([credentialsId: 'kubernetes-config']) {
                        sh """
                            helm upgrade --install saas-academy-frontend ./frontend/helm \
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
                        kubectl rollout status deployment/saas-academy-backend -n ${K8S_NAMESPACE}
                        kubectl rollout status deployment/saas-academy-frontend -n ${K8S_NAMESPACE}
                        kubectl get pods -n ${K8S_NAMESPACE}
                        kubectl get pods -n database
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
                        sleep 10
                        kubectl get svc -n ${K8S_NAMESPACE}
                        BACKEND_SVC=\$(kubectl get svc saas-academy-backend -n ${K8S_NAMESPACE} -o jsonpath='{.spec.clusterIP}')
                        curl -f http://\$BACKEND_SVC:3000/health || exit 1
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
                to: 'devops@saasacademy.com'
            )
        }
        failure {
            echo 'Pipeline failed!'
            emailext(
                subject: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' failed.

                Check console output at ${env.BUILD_URL}""",
                to: 'devops@saasacademy.com'
            )
        }
        always {
            cleanWs()
        }
    }
}
