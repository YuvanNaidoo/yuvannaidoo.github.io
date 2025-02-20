document.addEventListener('DOMContentLoaded', () => 
{
    testGet();
});

async function testGet ()
{
    const response = await supabase.from('tbl_teams').select();
    console.log(response.data);

    const response2 = await supabase.from('tbl_players').select();
    console.log(response2.data);

    var teamMembers = response.data[0].players;
    var playerList = response2.data;

    var output = response.data[0].name + "\n";
    output += "Team Members: \n";

    for (var i = 0; i < teamMembers.length; i++)
    {
        var tM = null;
        var flag = false;
        for (var j = 0; j < playerList.length; j++)
        {
            if (teamMembers[i] == playerList[j].id)
            {
                var p = playerList[j];
                tM = p.name + " " + p.nickname + " " + p.surname;
                flag = true;
                break;
            }
        }
        if (flag)
        {
            output += tM + "\n";
        } else 
        {
            output += teamMembers[i] + ": Player not found.\n";
        }  
    }

    console.log(output);
}