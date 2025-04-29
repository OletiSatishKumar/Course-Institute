pipeline {
    agent any

    environment {
        APP_NAME = 'course-institute-management'
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/OletiSatishKumar/Course-Institute.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "🔧 Installing Node.js Dependencies..."
                npm install
                '''
            }
        }

        stage('Optional Test (Skip for Now)') {
            steps {
                echo "🧪 Skipping Tests (No tests configured yet)"
            }
        }
    }

    post {
        success {
            echo '✅ Build stage completed successfully.'
        }
        failure {
            echo '❌ Build stage failed.'
        }
    }
}
