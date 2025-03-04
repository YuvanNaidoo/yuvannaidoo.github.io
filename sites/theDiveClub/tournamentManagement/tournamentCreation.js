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
    document.getElementById('submit_newTournament').addEventListener('click', () => 
    {
        const nT_name = document.getElementById('txt_nT_name').value;
        const nT_date = document.getElementById('txt_nT_date').value;
        const nT_time = document.getElementById('txt_nT_time').value;
        const nT_location = document.getElementById('txt_nT_location').value;
        //txt_nT_coordinatorID comes from auth token after login
        const nT_coordinatorID = "ed3c5f68-9e79-4166-afdd-6c55697ed840";
        const nT_maxEntries = document.getElementById('txt_nT_maxEntries').value;
        const nT_description = document.getElementById('txt_nT_description').value;


        SubmitNewTournament(nT_name, nT_date, nT_time, nT_location, nT_coordinatorID, nT_maxEntries, nT_description);
    });
});

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
        console.log('New tournament created');
        console.log(response.data);
        return response.data;
    }
}