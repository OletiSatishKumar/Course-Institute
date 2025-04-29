pipeline {
    agent any

    environment {
        APP_NAME = 'course-institute-management'
        GIT_REPO = 'https://github.com/OletiSatishKumar/Course-Institute.git'
        GIT_BRANCH = 'main'
    }

    triggers {
        githubPush()
    }

    stages {
        /* ======================
           🛠️ Continuous Integration (CI)
           ====================== */

        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out code from ${GIT_REPO} (branch: ${GIT_BRANCH})"
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "🔧 Installing Node.js Dependencies for ${APP_NAME}..."
                bat '''
                echo Installing dependencies...
                npm install
                '''
            }
        }

        stage('Test (Currently Skipped)') {
            steps {
                echo "🧪 Skipping Tests - No test cases implemented yet."
            }
        }
    }

    post {
        success {
            echo "✅ CI Pipeline completed successfully for ${APP_NAME}."
        }
        failure {
            echo "❌ CI Pipeline failed for ${APP_NAME}."
        }
        always {
            echo "📦 Pipeline execution finished."
        }
    }
}
