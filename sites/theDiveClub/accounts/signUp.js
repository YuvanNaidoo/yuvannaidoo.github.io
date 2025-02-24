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
//User details should only be loaded on all pages.
//Sign in/up functions should be separated from the user details function (like the access token redirect)
//Create a profile page
//Profile picture functionality...
//Clear Out local storage on log out