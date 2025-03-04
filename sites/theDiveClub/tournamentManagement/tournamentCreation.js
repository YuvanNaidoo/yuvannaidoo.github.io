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