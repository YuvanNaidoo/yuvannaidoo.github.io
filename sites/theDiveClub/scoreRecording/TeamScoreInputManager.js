/*
Assume: Every tournament has a specified format.
Every format will require a different form of input.
Think: Round Robin Vs Knockout
*/

var allPlayers, allTeams, allLeagues, alltournaments, allMatches;

document.addEventListener('DOMContentLoaded', () => 
{
    PopulateAllData();
});

async function PopulateAllData ()
{
    allPlayers = await GetData('tbl_players');
    allTeams = await GetData('tbl_teams');
    allLeagues = await GetData('tbl_leagues');
    alltournaments = await GetData('tbl_tournaments');
    allMatches = await GetData('tbl_matches');


    var newtournament = tournament_TeamRoundRobin(alltournaments[0], allTeams[0], allTeams[1]);

    console.log(newtournament.tournament);
    console.log(newtournament.teams);
    console.log(newtournament.matches);

    OutputtournamentToScoreSheet(newtournament);
    OutputtournamentToMatches(newtournament);
}

//0. Define data structures for tournament types.

//Get Data from Supabase
async function GetData (_table)
{
    var response = await supabase.from(_table).select();
    return response.data;
}

function GetObjectByID (_id, _array)
{
    for (var i = 0; i < _array.length; i ++)
    {
        if (_array[i].id == _id)
        {
            return _array[i];
        }
    }
}

//Team-based Round Robin
function tournament_TeamRoundRobin (_tournament, _team_Home, _team_Away)
{
    this.tournament = _tournament;
    this.teams = [_team_Home, _team_Away];
    this.matches = [];

    //Generate Matches
    for (var i = 0; i < this.teams[0].players.length; i ++)
    {
        for (var j = 0; j < this.teams[1].players.length; j ++)
        {
            var newMatch = 
            {
                tournamentID: this.tournament.id,
                player_h: GetObjectByID(this.teams[0].players[i], allPlayers),
                player_A: GetObjectByID(this.teams[1].players[j], allPlayers),
                result_H: null,
                result_A: null,
                apples_H: null,
                apples_A: null
            }
            this.matches.push(newMatch);
        }
    }

    return this;
}

function OutputtournamentToScoreSheet (comp)
{
    //Populate Away Team Players in Header Row
    const headerRow = document.getElementById('scoreSheet_headerRow');

    for (var i = 0; i < comp.teams[1].players.length; i ++)
    {
        const newCell = document.createElement('th');
        var playerName = GetObjectByID(comp.teams[1].players[i], allPlayers).name;
        newCell.textContent = playerName;
        headerRow.appendChild(newCell);
    }

    //Populate Home Team Players in First Column
    const tableBody = document.getElementById('scoreSheet_tableBody');

    for (var i = 0; i < comp.teams[0].players.length; i ++)
    {
        const newRow = document.createElement('tr');
        const newCell = document.createElement('td');
        var playerName = GetObjectByID(comp.teams[0].players[i], allPlayers).name;
        newCell.textContent = playerName;
        newRow.appendChild(newCell);
        for (var j = 0; j < comp.teams[1].players.length; j ++)
        {
            const emptyCell = document.createElement('td');
            const select = document.createElement('select');
            const options = ['-', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'Z', 'X'];
            options.forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                select.appendChild(option);
            });
            emptyCell.appendChild(select);
            newRow.appendChild(emptyCell);
        }
        tableBody.appendChild(newRow);
    }

    // Add event listeners to dropdowns
    const selects = tableBody.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', (event) => {
            console.log('Dropdown changed:', event.target.value);
            // You can add more logic here to handle the change event
        });
    });
}

function OutputtournamentToMatches (comp)
{
    const tableBody = document.getElementById('matches_tableBody');

    for (var i = 0; i < comp.teams[0].players.length; i ++)
    {
        const newRow = document.createElement('tr');

        var playerName_H = GetObjectByID(comp.teams[0].players[i], allPlayers).name;
        const cell_PH = document.createElement('td');
        cell_PH.id = `player_H_${i}`;
        cell_PH.textContent = playerName_H;
        newRow.appendChild(cell_PH);

        const cell_R = document.createElement('td');
        newRow.appendChild(cell_R);

        for (var j = 0; j < comp.teams[1].players.length; j ++)
        {
            var playerName_A = GetObjectByID(comp.teams[1].players[j], allPlayers).name;
            const cell_PA = document.createElement('td');
            cell_PA.textContent = playerName_A;
            if (j == 0)
            {
                newRow.appendChild(cell_PA);
                tableBody.appendChild(newRow);
            } else 
            {
                const n_r = document.createElement('tr');
                const blank_0 = document.createElement('td');
                const blank_1 = document.createElement('td');
                n_r.appendChild(blank_0);
                n_r.appendChild(blank_1);
                n_r.appendChild(cell_PA);
                tableBody.appendChild(n_r);
            }
        }
    }
}