pipeline {
    agent any

    parameters {
        string(name: 'APP_ENV', defaultValue: 'dev', description: 'Set environment: dev or prod')
    }

    environment {
        APP_ENV = "${params.APP_ENV}"
    }

    stages {
        stage('Debug') {
            steps {
                echo "🔧 APP_ENV is: ${env.APP_ENV}"
            }
        }
        stage('Sync Files from Node.js Template') {
            steps {
                script {
                    def templatesBase = '/templates'
                    def dockerfile = "dockerfile.${APP_ENV}"
                    def composeDir = 'compose'
                    def composeFile = "${composeDir}/docker-compose.${APP_ENV}.yml"

                    sh "mkdir -p ${composeDir}"
                    sh "cp ${templatesBase}/${dockerfile} ${dockerfile}"
                    echo "Synced ${dockerfile} from template"

                    sh "cp ${templatesBase}/docker-compose.${APP_ENV}.yml ${composeFile}"
                    echo "Synced ${composeFile} from template"
                }
            }
        }

        stage('List Config Files') {
            steps {
                sh 'ls -lah'
                sh 'ls -lah compose/'
            }
        }

        stage('Build & Deploy App') {
            steps {
                script {
                    def composeFile = "compose/docker-compose.${APP_ENV}.yml"

                    if (!fileExists(composeFile)) {
                        error "❌ ${composeFile} not found. Cannot deploy."
                    }

                    sh """
                    docker-compose -f ${composeFile} down || true
                    docker-compose -f ${composeFile} build
                    docker-compose -f ${composeFile} up -d
                    """
                }
            }
        }
    }

    post {
        always {
            echo "✅ Deployment finished for environment: ${APP_ENV}"
        }
    }
}
