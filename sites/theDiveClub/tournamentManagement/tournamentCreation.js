//To create a tournament, user should be logged in. If not logged in, redirect to login page.



/*Tournament Coordinator search routine:
1. On page loaded, get all players from database. Prep the data for search.
2. On keyup event in the search box, filter the players based on the search string.
3. Create the listgroup items for the filtered players.
4. On click of the player, set text in the search field to player name. Also update text element under the input field to show player id.

    <script>
        document.getElementById('search_bar').addEventListener('input', function() {
            var searchResults = document.getElementById('search_results');
            if (this.value.length > 0) {
                searchResults.style.display = 'block';
            } else {
                searchResults.style.display = 'none';
            }
        });
    </script>
*/

document.addEventListener('DOMContentLoaded', () => 
{
    if (checkLoginStatus())
    {
        document.getElementById('submit_newTournament').addEventListener('click', () => 
        {
            var fullName = userDetails.name + " " + userDetails.surname;
            CreateTournament(userDetails.id, fullName);
        });
    } else 
    {
        window.location.href = "../accounts/signIn.html";
    }    
});



//Check if user is logged in...............
var userDetails;

async function checkLoginStatus()
{
    var loggedIn = false;
    userDetails = await getUserDetails();
    console.log(userDetails);

    document.getElementById('txt_nT_coordinatorID').textContent = "ID: " + userDetails.id;
    document.getElementById('txt_nT_coordinatorName').textContent = userDetails.name + " " + userDetails.surname;

    if (userDetails)
    {
        loggedIn = true;
    }
    return loggedIn;
}

async function getUserDetails() 
{
    var accessToken = localStorage.getItem('access_token');
    if (accessToken)
    {
        const supabaseAuthResponse = await supabase.auth.getUser(accessToken);

        if (supabaseAuthResponse.error) 
        {
            console.error('Access Token found. Error fetching user details:', supabaseAuthResponse.error);
        } else 
        {
            const playerProfile = await supabase.from('tbl_players').select().eq('username', supabaseAuthResponse.data.user.email);

            const userDetails = 
            {
                name: playerProfile.data[0].name,
                surname: playerProfile.data[0].surname,
                id: playerProfile.data[0].id,
                username: playerProfile.data[0].username
            }
            
            

            return userDetails;
        }
    } else {
        document.getElementById('loginStatus').innerText = "Not Logged In";
    }
}

function CreateTournament (_id, _fullName)
{
    const nT_name = document.getElementById('txt_nT_name').value;
    const nT_date = document.getElementById('txt_nT_date').value;
    const nT_time = document.getElementById('txt_nT_time').value;
    const nT_location = document.getElementById('txt_nT_location').value;
    //txt_nT_coordinatorID comes from auth token after login
    const nT_coordinatorID = userDetails.id;    
    const nT_maxEntries = document.getElementById('txt_nT_maxEntries').value;
    const nT_description = document.getElementById('txt_nT_description').value;

    var newTournamentID = SubmitNewTournament(nT_name, nT_date, nT_time, nT_location, nT_coordinatorID, nT_maxEntries, nT_description);
    return newTournamentID;
}

async function SubmitNewTournament (_name, _date, _time, _location, _coordinatorID, _maxEntries, _description)
{
    const tournamentDetails = 
    {
        name: _name,
        date: _date,
        time: _time,
        location: _location,
        coordinatorID: _coordinatorID,
        maxEntries: _maxEntries,
        description: _description
    };

    const response = await supabase.from('tbl_tournaments').insert(tournamentDetails).select();

    if (response.error) 
    {
        console.error('Error inserting new tournament:', response.error);
        return null;
    } else 
    {
        console.log('New tournament created', response.data);
        document.getElementById('txt_nT_id').innerText = response.data[0].id;

        var tournamentEntryLink = "yuvannaidoo.github.io/sites/theDiveClub/tournamentManagement/entry.html?tournamentID=" + response.data[0].id;
        document.getElementById('txt_nT_link').innerText = tournamentEntryLink;

        var tournamentID = response.data[0].id;
        return tournamentID;
    }
}