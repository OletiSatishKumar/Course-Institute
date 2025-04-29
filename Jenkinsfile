pipeline {
    agent any

    environment {
        APP_NAME = 'course-institute-management'
        GIT_REPO = 'https://github.com/OletiSatishKumar/Course-Institute.git'
        GIT_BRANCH = 'main'
        ARTIFACT_NAME = "${APP_NAME}.zip"
        S3_BUCKET = 'myclashofclansbucket'
        S3_PATH = 'artifacts/'
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

        stage('Package Artifact') {
            steps {
                echo "📦 Packaging ${APP_NAME} into a ${ARTIFACT_NAME} file..."
                bat '''
                echo Creating artifact...
                if exist build rmdir /s /q build
                mkdir build

                rem Copy all folders except 'build' itself
                for /d %%D in (*) do if /I not "%%D"=="build" xcopy "%%D" "build\\%%D\\" /s /e /y

                rem Copy all files to build folder
                for %%F in (*) do copy "%%F" "build\\"

                rem Delete old artifact if exists
                if exist %ARTIFACT_NAME% del %ARTIFACT_NAME%

                rem Create ZIP artifact
                powershell Compress-Archive -Path build\\* -DestinationPath %ARTIFACT_NAME%
                '''
            }
        }

        /* ======================
           🚀 Push to S3
           ====================== */
        stage('Upload Artifact to S3') {
            steps {
                echo "☁️ Uploading ${ARTIFACT_NAME} to S3 bucket ${S3_BUCKET}..."
                bat """
                aws s3 cp %ARTIFACT_NAME% s3://%S3_BUCKET%/%S3_PATH%%ARTIFACT_NAME%
                """
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
