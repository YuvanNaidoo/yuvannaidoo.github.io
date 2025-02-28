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
    } else {
        console.log('No access token found');
    } 
}