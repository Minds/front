node {
    
    stage 'Checkout'
        checkout scm
        //Get dependencies
		sh 'npm install' 
		//may also need to grab plugins..  

    //stage 'Build'
   	//	
    //   sh 'npm run build-prod'

    stage 'Code styling'
        //sh 'npm install -g protractor@latest'
        sh 'tslint -c tslint.json \\"app/**/*.ts\\"'

    stage 'Spec tests'
	    sh 'npm run test'

}
