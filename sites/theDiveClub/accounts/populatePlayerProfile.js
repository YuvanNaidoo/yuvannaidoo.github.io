var playerProfile = 
{
    username: "",
};

var allPlayers = [];

// Call the function on page load
document.addEventListener('DOMContentLoaded', PopulateProfile);

async function PopulateProfile() 
{
    playerProfile.username = await getUsername();
    playerProfile.credentials = await getPlayerInfo(playerProfile.username);
    playerProfile.id = playerProfile.credentials.id;
    playerProfile.matches = await getPlayerMatches(playerProfile.id);
    playerProfile.tournaments = await gettournaments(playerProfile.matches);
    playerProfile.leagues = await getLeagues(playerProfile.tournaments);
    playerProfile.teams = await getTeams(playerProfile.id);

    console.log(playerProfile);

    allPlayers = await supabase.from('tbl_players').select();
    allPlayers = allPlayers.data;

    CreateTeamsButtons(playerProfile.teams);
    CreateMatchesButtons(playerProfile.matches);

    document.getElementById('loginStatus').innerText = playerProfile.username;
}

async function getUsername() 
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
            username = supabaseAuthResponse.data.user.email;
            return username;
        }
    } else {
        document.getElementById('loginStatus').innerText = "Not Logged In";
    }
}

async function getPlayerInfo(_username) 
{
    const response = await supabase.from('tbl_players').select().eq('username', _username);

    if (response.error) {
        console.error('Error fetching player info:', error);
        return null;
    }

    return response.data[0];
}

async function getPlayerMatches(_id) 
{
    const response = await supabase.from('tbl_matches').select().or(`player_H.eq.${_id},player_A.eq.${_id}`);

    if (response.error) {
        console.error('Error fetching Matches:', error);
        return null;
    }

    return response.data;
}

async function gettournaments(_matches)
{
    var tournamentIDs = [];
    var tournaments = [];

    for (var i = 0; i < _matches.length; i++)
    {
        if (_matches[i].tournamentID)
        {
            if (!tournamentIDs.includes(_matches[i].tournamentID))
            {
                tournamentIDs.push(_matches[i].tournamentID);
            }
        }        
    }

    for (var i = 0; i < tournamentIDs.length; i++)
    {
        var response = await supabase.from('tbl_tournaments').select().eq('id', tournamentIDs[i]);
        tournaments.push(response.data[0]);
    }

    return tournaments;
}

async function getLeagues (_tournaments)
{
    var leagueIDs = [];
    var leagues = [];

    for (var i = 0; i < _tournaments.length; i++)
    {
        if (_tournaments[i].leagueID)
        {
            if (!leagueIDs.includes(_tournaments[i].leagueID))
            {
                leagueIDs.push(_tournaments[i].leagueID);
            }
        }        
    }

    for (var i = 0; i < leagueIDs.length; i++)
    {
        var response = await supabase.from('tbl_leagues').select().eq('id', leagueIDs[i]);
        leagues.push(response.data[0]);
    }

    return leagues;
}

async function getTeams(_playerID) 
{
    const response = await supabase.from('tbl_teams').select();

    if (response.error) 
    {
        console.error('Error fetching Teams:', error);
        return null;
    } else 
    {
        var allTeams = response.data;
        var playerTeams = [];
        for (var i = 0; i < allTeams.length; i ++)
        {
            var players = allTeams[i].players;
            if (players.includes(_playerID))
            {
                playerTeams.push(allTeams[i]);
            }
        }
        return playerTeams;
    }    
}

function CreateTeamsButtons(_teams) 
{
    var playerTeamsContainer = document.getElementById('player_Teams');
    playerTeamsContainer.innerHTML = ''; // Clear existing buttons

    for (var i = 0; i < _teams.length; i++) 
    {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'list-group-item list-group-item-action';
        button.innerText = _teams[i].name;
        playerTeamsContainer.appendChild(button);
    }
}

function CreateMatchesButtons(_matches) 
{
    //Matches Labels
    var matchLabels = [];

    for (var i = 0; i < _matches.length; i++)
    {
        var opponent = "";
        var result = "";
        var outcome = "";

        if (_matches[i].player_H == playerProfile.id)
        {
            opponent = GetPlayerNameByID(_matches[i].player_A);            
            result = _matches[i].result_H + ":" + _matches[i].result_A;
            if (_matches[i].result_H > _matches[i].result_A)
            {
                outcome = "Won";
            } else if (_matches[i].result_H < _matches[i].result_A)
            {
                outcome = "Lossed";
            } else
            {
                outcome = "Draw";
            }
        } else 
        {
            opponent = GetPlayerNameByID(_matches[i].player_H);
            result = _matches[i].result_A + ":" + _matches[i].result_H;
            if (_matches[i].result_A > _matches[i].result_H)
            {
                outcome = "Won";
            } else if (_matches[i].result_A < _matches[i].result_H)
            {
                outcome = "Lossed";
            } else
            {
                outcome = "Draw";
            }
        }

        matchLabels.push(outcome + " " + result + " vs " + opponent);
    }

    var playerMatchesContainer = document.getElementById('player_Matches');
    playerMatchesContainer.innerHTML = ''; // Clear existing buttons

    for (var i = 0; i < matchLabels.length; i++) 
    {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'list-group-item list-group-item-action';
        button.innerText = matchLabels[i];
        playerMatchesContainer.appendChild(button);
    }
}

function GetPlayerNameByID (_id)
{
    for (var i = 0; i < allPlayers.length; i++)
    {
        if (allPlayers[i].id == _id)
        {
            var playerAlias = allPlayers[i].name + " " + allPlayers[i].surname;
            if (allPlayers[i].nickname)
            {
                playerAlias += " '" + allPlayers[i].nickname + "'";
            }
            return  playerAlias;
        }
    }
    return "Player Not Found";
}

/*
function CreatePlayerProfileElement(playerProfile) {
    var profileTemplate = document.getElementById('profileTemplate');
    var profileClone = profileTemplate.content.cloneNode(true);

    profileClone.querySelector('.username').innerText = playerProfile.username;
    profileClone.querySelector('.id').innerText = playerProfile.id;
    profileClone.querySelector('.teams').innerText = playerProfile.teams.map(team => team.name).join(', ');
    profileClone.querySelector('.matches').innerText = playerProfile.matches.length;
    profileClone.querySelector('.tournaments').innerText = playerProfile.tournaments.map(comp => comp.name).join(', ');
    profileClone.querySelector('.leagues').innerText = playerProfile.leagues.map(league => league.name).join(', ');

    document.getElementById('profilesContainer').appendChild(profileClone);
}*/

