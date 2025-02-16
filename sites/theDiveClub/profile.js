document.addEventListener("DOMContentLoaded", function() {
    // Ensure Supabase is imported properly
    const { createClient } = supabase;
    
    const supabaseUrl = "https://mmvlwutnuouynukotdey.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdmx3dXRudW91eW51a290ZGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTgyMzEsImV4cCI6MjA1NTI3NDIzMX0.qyEDq8w67G2BMfyHO7Iyvd3nFUSd0sulJhGl0eGkbfA";
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    var userProfile = null;

    async function checkUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
            //console.log(user.email);
            fetchPlayerProfile(user.email);
        }
    }

    async function fetchPlayerProfile (username)
    {
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/players?username=eq.${username}`, {
              method: 'GET',
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            //console.log("Record matching criteria:", data);
            userProfile = data;
            PopulateUserProfileText(userProfile);
          } catch (error) {
            console.error("Error fetching record:", error);
          }
    }

    function PopulateUserProfileText (userProfile)
    {
        document.getElementById("user-name").textContent = `${userProfile[0].name}`;
        document.getElementById("user-surname").textContent = `${userProfile[0].surname}`;
        document.getElementById("user-contact").textContent = `${userProfile[0].contact}`;
    }

    if (document.getElementById("logout-btn")) {
        checkUser();
        
        document.getElementById("logout-btn").addEventListener("click", async function() {
            await supabaseClient.auth.signOut();
            window.location.reload(); // Refresh page after logout
        });
    }
});
