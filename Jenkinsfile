pipeline {
    agent any

    environment {
        APP_NAME = 'course-institute-management'
        GIT_REPO = 'https://github.com/OletiSatishKumar/Course-Institute.git'
        GIT_BRANCH = 'main'
        ARTIFACT_NAME = "${APP_NAME}.zip"
        S3_BUCKET = 'myclashofclansbucket'
        S3_PATH = 'artifacts/'
        EC2_HOST = '13.49.23.149'
        EC2_USER = 'ec2-user'
        PRIVATE_KEY_PATH = 'C:/Users/satis/Downloads/Deploy.pem'
    }

    triggers {
        githubPush()
    }

    stages {
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
                echo '🧪 Skipping Tests - No test cases implemented yet.'
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

                rem Remove existing zip file if present
                if exist %ARTIFACT_NAME% del %ARTIFACT_NAME%

                rem Create ZIP artifact
                powershell Compress-Archive -Path build\\* -DestinationPath %ARTIFACT_NAME%
                '''
            }
        }

        stage('Upload Artifact to S3') {
            steps {
                echo "☁️ Uploading ${ARTIFACT_NAME} to S3 bucket ${S3_BUCKET}..."
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds']]) {
                    bat '''
                    aws s3 cp %ARTIFACT_NAME% s3://%S3_BUCKET%/%S3_PATH%%ARTIFACT_NAME%
                    '''
                }
            }
        }
        stage('Deploy to EC2') {
    steps {
        echo "🚀 Deploying ${ARTIFACT_NAME} to EC2 instance ${EC2_HOST}..."
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds']]) {
            bat """
            echo Connecting to EC2 and deploying the app...

            ssh -o StrictHostKeyChecking=no -i "%PRIVATE_KEY_PATH%" %EC2_USER%@%EC2_HOST% "
                # Download and extract the artifact
                aws s3 cp s3://%S3_BUCKET%/%S3_PATH%%ARTIFACT_NAME% ~/ &&
                unzip -o ~/%ARTIFACT_NAME% -d ~/app &&

                # Navigate to app directory
                cd ~/app &&

                # Install Node.js if not installed
                if ! command -v node > /dev/null; then
                    curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash - &&
                    sudo yum install -y nodejs
                fi &&

                # Install dependencies
                npm install &&

                # Install PM2 if not already
                if ! command -v pm2 > /dev/null; then
                    sudo npm install -g pm2
                fi &&

                # Stop previous PM2 process (if any) and start again
                pm2 delete ${APP_NAME} || true &&
                pm2 start index.js --name ${APP_NAME} &&
                pm2 save
            "
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
