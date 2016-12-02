node {
    
    stage 'Checkout'
        checkout scm
        //Get dependencies
		sh 'npm install' 
		//may also need to grab plugins..  

    stage 'Test'
   		
        sh 'npm run build'

}
