node {
    
    stage 'Checkout'
        checkout scm
        //Get dependencies
		sh 'npm install' 
		//may also need to grab plugins..  

    stage 'Build'
   		
        sh 'npm run build-prod'

    stage 'E2E Tests'

        //sh 'npm install -g protractor@latest'
        sh 'protractor ./protractor.js'

}
