//VARIABLES

// Initialize Supabase client
const { createClient } = window.supabase;
const supabaseUrl = 'https://mmvlwutnuouynukotdey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdmx3dXRudW91eW51a290ZGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTgyMzEsImV4cCI6MjA1NTI3NDIzMX0.qyEDq8w67G2BMfyHO7Iyvd3nFUSd0sulJhGl0eGkbfA';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => 
{
    document.getElementById('submit_signup').addEventListener('click', () => 
    {
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        signUpWithEmail(email, password);
    });

    document.getElementById('googleSignupButton').addEventListener('click', () => 
    {
        signInWithGoogle();
    });
});

// Function to handle user sign up via manual entry of email and password
async function signUpWithEmail(_email, _password) 
{        
    const userCredentials = {email: _email, password: _password};//Create JSON Object to send to Supabase
    const signUpResponse = await supabase.auth.signUp(userCredentials);//Response from Supabase
    console.log(signUpResponse);

    if (signUpResponse.error) 
    {
        console.log('Error signing up:', signUpResponse.error.message, userCredentials);
        return null;
    } else 
    {
        console.log('User signed up:', signUpResponse.data.user);
        return signUpResponse.user;
    }
}

// Function to handle Google OAuth login
async function signInWithGoogle() 
{
    console.log('Signing in with Google');
    const userCredentials = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '../sites/theDiveClub/index.html' } });
    
    if (userCredentials.error)
    {
        console.error('Error signing in with Google:', userCredentials.error.message);
    } else 
    {
        console.log('User signed in with Google:', userCredentials.user, userCredentials.session);
    }
}



// Call the function on page load
document.addEventListener('DOMContentLoaded', checkForAccessTokenAndRedirect);

// Function to get user details using access token
async function getUserDetails(accessToken) {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
        console.error('Error fetching user details:', error.message);
    } else {
        console.error('User details:', data.user);
    }
}

// Modify checkForAccessTokenAndRedirect function to get user details
async function checkForAccessTokenAndRedirect() {
    console.error('Checking for access token and redirecting');
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    console.error(accessToken);

    /*
    if (accessToken) {
        await getUserDetails(accessToken);
        const redirectUrl = `https://yuvannaidoo.github.io/sites/theDiveClub/index.html?access_token=${accessToken}`;
        //window.location.href = redirectUrl;
        console.error(redirectUrl);
    }*/
}

