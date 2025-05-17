pipeline {
    agent any

    environment {
        APP_ENV = "${env.APP_ENV}"
    }

    stages {
        stage('Debug') {
            steps {
                echo "🔧 Global APP_ENV is: ${env.APP_ENV}"
                
            }
        }

        stage('Sync Files from Node.js Template') {
            steps {
                script {
                    def templatesBase = '/templates'
                    def dockerfile = "dockerfile.${env.APP_ENV}"
                    def composeDir = 'compose'
                    def composeFile = "${composeDir}/docker-compose.${env.APP_ENV}.yml"
                    def envFile = ".env.${env.APP_ENV == 'dev' ? 'development' : 'production'}"
                    def targetEnvFile = "${composeDir}/${envFile}"

                    sh "mkdir -p ${composeDir}"
                    sh "cp ${templatesBase}/${dockerfile} ${dockerfile}"
                    echo "✅ Synced ${dockerfile} from template"

                    sh "cp ${templatesBase}/docker-compose.${env.APP_ENV}.yml ${composeFile}"
                    echo "✅ Synced ${composeFile} from template"

                    sh "cp ${templatesBase}/${envFile} ${targetEnvFile}"
                    echo "✅ Synced ${envFile} into ${targetEnvFile}"
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
                    def composeFile = "compose/docker-compose.${env.APP_ENV}.yml"

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
            echo "✅ Deployment finished for environment: ${env.APP_ENV}"
        }
    }
}
