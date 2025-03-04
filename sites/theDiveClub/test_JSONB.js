document.addEventListener('DOMContentLoaded', () => 
{
    testAll();
});

async function testAll ()
{
    var tableNames = ['tbl_leagues', 'tbl_tournaments', 'tbl_matches' , 'tbl_teams', 'tbl_players'];
    var responses = [];

    for (var i = 0; i < tableNames.length; i++)
    {
        responses[i] = await supabase.from(tableNames[i]).select();
        console.log(responses[i].data);
    }

    var leagues = responses[0].data;
    var tournaments = responses[1].data;
    var matches = responses[2].data;
    var teams = responses[3].data;
    var players = responses[4].data;

    var outPut = "Leagues: \n";
    for (var i = 0; i < leagues.length; i++)
    {
        outPut += leagues[i].name + "\n";
        for (var j = 0; j < tournaments.length; j++)
        {
            if (tournaments[j].leagueID == leagues[i].id)
            {
                outPut += tournaments[j].name + "\n" + "H | A" + "\n";
                for (var k = 0; k < matches.length; k ++)
                {
                    if (matches[k].tournamentID == tournaments[j].id)
                    {
                        var m = matches[k];
                        outPut += GetPlayerName(m.player_H, players) + " - " + m.result_H + ":" + m.result_A + " - " + GetPlayerName(m.player_A, players) + "\n";
                    }
                }
            }
        }
    }   
    
    console.log(outPut);        
}

function GetPlayerName (id, allPlayers)
{
    for (var i = 0; i < allPlayers.length; i ++)
    {
        if (allPlayers[i].id == id)
        {
            return allPlayers[i].name;
        }
    }
}