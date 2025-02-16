document.addEventListener("DOMContentLoaded", function() {
    // Ensure Supabase is imported properly
    const { createClient } = supabase;
    
    const supabaseUrl = "https://mmvlwutnuouynukotdey.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tdmx3dXRudW91eW51a290ZGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2OTgyMzEsImV4cCI6MjA1NTI3NDIzMX0.qyEDq8w67G2BMfyHO7Iyvd3nFUSd0sulJhGl0eGkbfA";
    
    // Check if the URL contains an access token
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
        (async () => {
            // Store the token in Supabase's session
            await supabaseClient.auth.setSession({
                access_token: accessToken,
                refresh_token: urlParams.get("refresh_token")
            });

            // Remove token from URL for cleaner look
            window.history.replaceState({}, document.title, window.location.pathname);

            // Redirect to index page or user profile page
            window.location.href = "index.html";
        })();
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    document.getElementById("signup-btn")?.addEventListener("click", async function() {
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) {
            alert("Signup failed: " + error.message);
        } else {
            alert("Signup successful! Check your email to confirm your account.");
        }
    });

    document.getElementById("login-btn")?.addEventListener("click", async function() {
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            alert("Login failed: " + error.message);
        } else {
            alert("Login successful! Redirecting...");
            window.location.href = "index.html";
        }
    });

    async function checkUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
            console.log(user);
            document.getElementById("welcome-message").textContent = `Welcome, ${user.email}`;
            document.getElementById("login-link").style.display = "none";
            document.getElementById("logout-btn").style.display = "block";
        }
    }

    if (document.getElementById("logout-btn")) {
        checkUser();
        
        document.getElementById("logout-btn").addEventListener("click", async function() {
            await supabaseClient.auth.signOut();
            window.location.reload(); // Refresh page after logout
        });
    }

    document.getElementById("google-login-btn").addEventListener("click", async function() {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + "/index.html" // Change this to your desired page
            }
        });
    
        if (error) {
            alert("Google login failed: " + error.message);
        }
    });
    
    
});
