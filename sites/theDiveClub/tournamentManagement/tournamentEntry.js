function getTournamentID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tournamentID');
}

// Example usage:
const tournamentID = getTournamentID();
console.log(tournamentID);
const tournamentDetails = GetTournamentDetails(tournamentID);
console.log(tournamentDetails);


document.getElementById('submit_signIn').addEventListener('click', () => 
{
    var email = document.getElementById('signIn_username').value;
    var password = document.getElementById('signIn_password').value;
    signIn(email, password);
});

async function GetTournamentDetails(_id) 
{
    const response = await supabase.from('tbl_tournaments').select().eq('id', _id);
    console.log(response.data[0]);

    if (response.error)
    {
        console.error('Error fetching tournament:', response.error);
        return null;
    } else 
    {
        PopulateTournamentDetails(response.data[0]);
    }

    return response;   
}

function PopulateTournamentDetails(_tournamentDetails)
{
    document.getElementById('txt_T_name').innerText = _tournamentDetails.name;
    document.getElementById('txt_T_date').innerText = _tournamentDetails.date;
    document.getElementById('txt_T_time').innerText = _tournamentDetails.time;
    document.getElementById('txt_T_location').innerText = _tournamentDetails.location;
    document.getElementById('txt_T_coordinatorName').innerText = _tournamentDetails.coordinatorID;
    document.getElementById('txt_T_maxEntries').innerText = _tournamentDetails.maxEntries;
    document.getElementById('txt_T_description').innerText = _tournamentDetails.description;
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
        const userDetails = await getUserDetails(signInResponse.data.session.access_token);
        console.log(userDetails);

        document.getElementById('signInForm').innerHTML = '';

        var loggedInMessage = 'Signed in as: ' + userDetails.name + ' ' + userDetails.surname + '\n';
        loggedInMessage += ' Username: ' + userDetails.username + '\n';
        loggedInMessage += ' ID: ' + userDetails.id;

        const p = document.createElement('p');
        p.className = 'p';
        p.innerText = loggedInMessage;
        document.getElementById('signInForm').appendChild(p);
    }
}

async function getUserDetails(_accessToken) 
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