
var leagues, competitions, matches, teams, players;
var userPhoneNumber;

// Call the function on page load
document.addEventListener('DOMContentLoaded', PopulateProfile());

async function PopulateProfile()
{
    var user = await getUserName();
    var dataFetched = await GetAllDataFromDB();
    if (dataFetched)
    {
        GetPlayerData(user);
    }
}

async function getUserName() 
{
    var accessToken = localStorage.getItem('access_token');
    var userName;
    if (accessToken)
    {
        const supabaseAuthResponse = await supabase.auth.getUser(accessToken);

        if (supabaseAuthResponse.error) 
        {
            console.error('Error fetching user details:', supabaseAuthResponse.error);
        } else 
        {
            userName = supabaseAuthResponse.data.user.email;
            userPhoneNumber = supabaseAuthResponse.data.user.phone;
            return userName;
        }
    }
}

async function GetAllDataFromDB() 
{
    leagues = await supabase.from('tbl_leagues').select();
    competitions = await supabase.from('tbl_competitions').select();
    matches = await supabase.from('tbl_matches').select();
    teams = await supabase.from('tbl_teams').select();
    players = await supabase.from('tbl_players').select();

    matches = await supabase
        .from('tbl_matches')
        .select()
        .or(`player_H.eq.${playerID},player_A.eq.${playerID}`);

    return true;
}


function GetPlayerData (_user)
{
    //Get player ID
    var playerID;
    for (var i = 0; i < players.data.length; i ++)
    {
        if (players.data[i].username && players.data[i].username == _user)
        {
            playerID = players.data[i].id;
            break;
        }
    }
    console.log(_user, playerID);

    //Get all matches for player
    var playerMatches = [];
    for (var i = 0; i < matches.data.length; i ++)
    {
        var m = matches.data[i];
        if (m.player_H == playerID || m.player_A == playerID)
        {
            playerMatches.push(m);
        }
    }

    //Build Matches Output Text
    var outMatches = "Matches: \n";
    var outCompetitions = "Competitions: \n";
    var outLeagues = "Leagues: \n";
    for (var i = 0; i < playerMatches.length; i ++)
    {
        var p = playerMatches[i];
        if (p.competitionID)
        {
            var c = GetObjectByID(p.competitionID, competitions);
            if (c.leagueID)
            {
                var l = GetObjectByID(c.leagueID, leagues);
                outMatches += l.name + ", ";
                outCompetitions += l.name + ", "
                outLeagues += l.name + "\n";
            }
            outMatches += c.name + " : ";
            outCompetitions += c.name + "\n";             
        }
        if (p.player_H == playerID)
        {
            var opponent = GetObjectByID(p.player_A, players);
            outMatches += "Home - " + p.result_H + "|" + p.result_A + " - " + opponent.name + " " + opponent.surname + " (" + opponent.nickname + ")\n";
        } else if (p.player_A == playerID)
        {
            var opponent = GetObjectByID(p.player_H, players);
            outMatches += "Away - " + p.result_A + "|" + p.result_H + " - " + opponent.name + " " + opponent.surname + " (" + opponent.nickname + ")\n";
        }
    } 

    //Build Teams Output Text
    var playerTeams = [];
    var outTeams = "Teams:\n";
    for (var i = 0; i < teams.data.length; i ++)
    {
        for (var j = 0; j < teams.data[i].players.length; j ++)
        {
            if (teams.data[i].players[j] == playerID)
            {
                playerTeams.push(teams.data[i]);
            }
        }
    }

    for (var i = 0; i < playerTeams.length; i ++)
    {
        outTeams += playerTeams[i].name;
    }

    //OUTPUTS
    document.getElementById('playerID').innerText = "Player ID: " + playerID;
    document.getElementById('phoneNumber').innerText = "Phone Number: " + userPhoneNumber;
    document.getElementById('nickname').innerText = "Nickname: " + GetObjectByID(playerID, players).nickname;
    document.getElementById('teams').innerText = outTeams;
    document.getElementById('matches').innerText = outMatches;
    document.getElementById('competitions').innerText = outCompetitions;
    document.getElementById('leagues').innerText = outLeagues;

    var player = GetObjectByID(playerID, players);
    document.getElementById('playerName').innerText = player.name + " " + player.surname + " (" + player.nickname + ")";
}

function GetObjectByID (id, array)
{
    for (var i = 0; i < array.data.length; i ++)
    {
        if (array.data[i].id == id)
        {
            return array.data[i];
        }
    }
}