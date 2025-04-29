pipeline {
    agent any

    environment {
        APP_NAME = 'course-institute-management'
        GIT_REPO = 'https://github.com/OletiSatishKumar/Course-Institute.git'
        GIT_BRANCH = 'main'
        ARTIFACT_NAME = "${APP_NAME}.zip"
        S3_BUCKET = 'myclashofclansbucket'
        S3_PATH = 'artifacts/'
        EC2_HOST = '51.20.43.166'
        EC2_USER = 'ec2-user'
        PRIVATE_KEY_PATH = 'C:/Users/satis/Downloads/Deploy.pem'
    }

    triggers {
        githubPush()
    }

    stages {
        stage('🔄 Checkout Code') {
            steps {
                echo "🔄 Checking out code from ${GIT_REPO} (branch: ${GIT_BRANCH})"
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('🔧 Install Dependencies') {
            steps {
                echo "🔧 Installing Node.js Dependencies..."
                bat '''
                echo Installing npm dependencies...
                npm install
                '''
            }
        }

        stage('🧪 Test (Currently Skipped)') {
            steps {
                echo '🧪 Skipping Tests - No test cases implemented yet.'
            }
        }

        stage('📦 Package Artifact') {
            steps {
                echo "📦 Packaging into ${ARTIFACT_NAME}..."
                bat '''
                if exist build rmdir /s /q build
                mkdir build

                for /d %%D in (*) do if /I not "%%D"=="build" xcopy "%%D" "build\\%%D\\" /s /e /y
                for %%F in (*) do copy "%%F" "build\\"

                if exist %ARTIFACT_NAME% del %ARTIFACT_NAME%
                powershell Compress-Archive -Path build\\* -DestinationPath %ARTIFACT_NAME%
                '''
            }
        }

        stage('☁️ Upload Artifact to S3') {
            steps {
                echo "☁️ Uploading ${ARTIFACT_NAME} to S3..."
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds']]) {
                    bat '''
                    aws s3 cp %ARTIFACT_NAME% s3://%S3_BUCKET%/%S3_PATH%%ARTIFACT_NAME%
                    '''
                }
            }
        }

        stage('🚀 Deploy to EC2') {
            steps {
                echo "🚀 Deploying to EC2 (${EC2_HOST}) with PM2..."
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds']]) {
                    bat """
                    echo Connecting to EC2 and deploying...

                    ssh -o StrictHostKeyChecking=no -i "%PRIVATE_KEY_PATH%" %EC2_USER%@%EC2_HOST% ^
                    "bash -c \\"aws s3 cp s3://%S3_BUCKET%/%S3_PATH%%ARTIFACT_NAME% ~/ && \
                    rm -rf ~/app && \
                    unzip -o ~/%ARTIFACT_NAME% -d ~/app && \
                    cd ~/app && \
                    if ! command -v node > /dev/null; then \
                    curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash - && \
                    sudo yum install -y nodejs; \
                    fi && \
                    if ! command -v pm2 > /dev/null; then sudo npm install -g pm2; fi && \
                    npm install && \
                    echo PORT=8000 > .env && \
                    echo MONGO_URI=mongodb+srv://SatishKumar:Satish%40%401303@cluster0.8h7ix.mongodb.net/courseinstitute >> .env && \
                    pm2 delete ${APP_NAME} || true && \
                    pm2 start npm --name \\\\\\"${APP_NAME}\\\\\\" -- start && \
                    pm2 save\\""
                    """

                }
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
            echo '📦 Pipeline execution finished.'
        }
    }
}
