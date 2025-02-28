document.addEventListener('DOMContentLoaded', () => 
{
    if (document.getElementById('btn_signIn'))
    {
        document.getElementById('btn_signIn').addEventListener('click', () => 
        {
            const email = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            signIn(email, password);
        });   
    }
    
    if (document.getElementById('btn_googleSignIn'))
    {
        document.getElementById('btn_googleSignIn').addEventListener('click', () => 
        {
            signInWithGoogle();
        });
    } 

    if (document.getElementById('btn_forgotPassword'))
    {
        document.getElementById('btn_forgotPassword').addEventListener('click', () => 
        {
            forgotPassword(document.getElementById('username').value);
        });
    }    
});

async function forgotPassword(_email)
{
    var response = await supabase.auth.resetPasswordForEmail(_email);
    console.log(response);
}

// Function to handle Google OAuth login
async function signInWithGoogle() 
{
    console.log('Signing in with Google');
    const credentials = { provider: 'google', options: { redirectTo: '../index.html' } };
    const signInResponse = await supabase.auth.signInWithOAuth(credentials);
    
    if (signInResponse.error)
    {
        console.error('Error signing in with Google:', signInResponse.error.message);
    } else 
    {
        console.log('User signed in with Google:', signInResponse.user, signInResponse.session);
    }
}

async function signIn(_email, _password)
{
    const signInResponse = await supabase.auth.signInWithPassword({ email: _email, password: _password });
    
    if (signInResponse.error)
    {
        console.error('Error signing in:', signInResponse.error.message);
    } else 
    {
        //DEBUGGING: console.log('User signed in:', signInResponse.data, signInResponse.data.session);
        localStorage.setItem('access_token', signInResponse.data.session.access_token);
        window.location.href = '../accounts/profile.html';
    }
}

//Confirmation email
//Imaigine422&
//Test Reset Password