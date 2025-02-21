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
    const credentials = { provider: 'google', options: { redirectTo: '../sites/theDiveClub/index.html' } };
    const signInResponse = await supabase.auth.signInWithOAuth(credentials);
    
    if (signInResponse.error)
    {
        console.error('Error signing in with Google:', signInResponse.error.message);
    } else 
    {
        console.log('User signed in with Google:', signInResponse.user, signInResponse.session);
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', getUserDetails());

// Function to get user details using access token
async function getUserDetails() 
{
    var accessToken = localStorage.getItem('access_token');
    if (accessToken)
    {
        const supabaseAuthResponse = await supabase.auth.getUser(accessToken);

        if (supabaseAuthResponse.error) 
        {
            console.error('Error fetching user details:', supabaseAuthResponse.error);
        } else 
        {
            localStorage.setItem('UserDetails', supabaseAuthResponse.data.user);
            document.getElementById('UserAccountInfo').innerText = supabaseAuthResponse.data.user.email;
        }
    }  
}
//User details should only be loaded on all pages.
//Sign in/up functions should be separated from the user details function (like the access token redirect)
//Create a profile page
//Profile picture functionality...
//Clear Out local storage on log out