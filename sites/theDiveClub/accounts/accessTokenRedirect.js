// Call the function on page load
document.addEventListener('DOMContentLoaded', CheckForAccessTokenAndRedirect);

// Function to check for access token and redirect
function CheckForAccessTokenAndRedirect()
{
    accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    if (accessToken)
    {
        //localStorage.setItem('access_token', accessToken);
        console.log("REDIRECT");
        const redirectUrl = `https://yuvannaidoo.github.io/sites/theDiveClub/index.html`;
        //window.location.href = redirectUrl;
    }
}