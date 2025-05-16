pipeline {
    agent any

    stages {
        stage('Sync Dev Files from Node.js Template') {
            steps {
                script {
                    def templatesBase = '/templates'
                    def dockerDevFile = 'dockerfile.dev'
                    def composeDir = 'compose'
                    def composeDevFile = "${composeDir}/docker-compose.dev.yml"

                    sh "mkdir -p ${composeDir}"

                    sh "cp ${templatesBase}/dockerfile.dev ${dockerDevFile}"
                    echo "Synced ${dockerDevFile} from template"

                    sh "cp ${templatesBase}/docker-compose.dev.yml ${composeDevFile}"
                    echo "Synced ${composeDevFile} from template"
                }
            }
        }

        stage('List Config Files') {
            steps {
                sh 'ls -lah'
                sh 'ls -lah compose/'
            }
        }

        stage('Build & Deploy Production App') {
            steps {
                script {
                    def composeFile = './compose/docker-compose.dev.yml'

                    if (!fileExists(composeFile)) {
                        error "❌ ${composeFile} not found. Cannot deploy."
                    }

                    sh """
                    docker-compose -f compose/docker-compose.dev.yml down || true
                    docker-compose -f compose/docker-compose.dev.yml build
                    docker-compose -f compose/docker-compose.dev.yml up -d
                    """
                }
            }
        }
    }


    post {
        always {
            echo 'Setup complete.'
        }
    }
}
