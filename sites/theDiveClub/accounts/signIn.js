// Initialize Supabase client
const { createClient } = window.supabase;
const supabaseUrl = 'https://mmvlwutnuouynukotdey.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdmx3dXRudW91eW51a290ZGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTgyMzEsImV4cCI6MjA1NTI3NDIzMX0.qyEDq8w67G2BMfyHO7Iyvd3nFUSd0sulJhGl0eGkbfA';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => 
{
    document.getElementById('btn_signIn').addEventListener('click', () => 
    {
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        signIn(email, password);
    });

    document.getElementById('btn_googleSignIn').addEventListener('click', () => 
    {
        signInWithGoogle();
    });
});

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

async function signIn(_email, _password)
{
    const signInResponse = await supabase.auth.signInWithPassword({ email: _email, password: _password });
    
    if (signInResponse.error)
    {
        console.error('Error signing in:', signInResponse.error.message);
    } else 
    {
        console.log('User signed in:', signInResponse.data.user, signInResponse.session);
        localStorage.setItem('userDetails', signInResponse.data.user.email);

        var outPut = localStorage.getItem('userDetails');
        console.log(outPut);
    }
}