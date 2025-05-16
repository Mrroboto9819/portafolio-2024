pipeline {
    agent any

    stages {
        stage('Test Docker') {
            steps {
                script {
                    echo 'Checking Docker installation...'
                    sh 'docker --version'
                    sh 'docker ps'
                }
            }
        }
    }

    post {
        always {
            echo 'Test completed.'
        }
    }
}
