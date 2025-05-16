pipeline {
    agent any

    stages {
        stage('Copy Dev Files from Template if Missing') {
            steps {
                script {
                    def composeDir = 'compose'
                    def composeDevFile = "${composeDir}/docker-compose.dev.yml"
                    def dockerDevFile = 'dockerfile.dev'
                    def templatePath = '/templates'

                    sh "mkdir -p ${composeDir}"

                    if (!fileExists(dockerDevFile)) {
                        sh "cp ${templatePath}/dockerfile.dev ${dockerDevFile}"
                        echo "Copied ${dockerDevFile} from template"
                    } else {
                        echo "${dockerDevFile} already exists"
                    }

                    if (!fileExists(composeDevFile)) {
                        sh "cp ${templatePath}/docker-compose.dev.yml ${composeDevFile}"
                        echo "Copied ${composeDevFile} from template"
                    } else {
                        echo "${composeDevFile} already exists"
                    }
                }
            }
        }

        stage('List Dev Files') {
            steps {
                sh 'ls -lah'
                sh 'ls -lah compose/'
            }
        }
    }

    post {
        always {
            echo 'Dev file setup complete.'
        }
    }
}
