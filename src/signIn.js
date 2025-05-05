import { Amplify } from 'aws-amplify';
import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';
import awsExports from './aws-exports'; // Import your aws-exports.js file
import { generateClient } from 'aws-amplify/api';
//  VERY IMPORTANT:  Configure Amplify *before* using it.
Amplify.configure(awsExports); // Use the configuration from awsExports

async function handleSignIn() {
  try {
      const user = await signIn({
          username: 'testuser', //  email or username
          password: 'testpassword',
      });
      console.log('Sign in successful:', user);

      // Example of fetching auth session
      const session = await fetchAuthSession();
      console.log("Session:", session);


  } catch (error) {
      console.error('Error signing in:', error);
  }
}

async function handleSignOut() {
    try {
        await signOut();
        console.log('Signed out');
    } catch (error) {
        console.error('Error signing out: ', error);
    }
}

handleSignIn();