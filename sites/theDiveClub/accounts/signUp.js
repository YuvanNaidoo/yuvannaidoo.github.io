document.addEventListener('DOMContentLoaded', () => 
{
    document.getElementById('submit_signup').addEventListener('click', () => 
    {
        const email = document.getElementById('signUp_username').value;
        const password = document.getElementById('signUp_password').value;
        signUpWithEmail(email, password);
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
        document.getElementById('signUpStatus').textContent = 'Error signing up:', signUpResponse.error.message;
        return null;
    } else 
    {
        console.log('User signed up:', signUpResponse.data.user);
        document.getElementById('signUpStatus').textContent = 'Sign-Up Successful. Please Log in.';
        return signUpResponse.user;
    }
}