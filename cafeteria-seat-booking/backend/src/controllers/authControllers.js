import supabase from '../config/supabaseClient.js'; // Supabase client
import axios from 'axios'; // To make the request to IBM W3 profile API

// Sign-Up Handler
export const signUp = async (req, res) => {
  const { w3_id, first_name, last_name, password } = req.body;

  try {
    // Check if the w3_id exists using IBM's Profile API
    const url = `https://w3-unified-profile-api.ibm.com/v3/profiles/${w3_id}`;
    const response = await axios.get(url);
    const data = response.data;

    if (Array.isArray(data.profiles) && data.profiles.length > 0) {
      // Use Supabase to sign up the user (handle authentication part)
      const { user, error } = await supabase.auth.signUp({
        email: w3_id, // Use w3_id as the email for authentication
        password,
        options: {
          emailRedirectTo: process.env.EMAIL_REDIRECT_URL || 'http://localhost:3000/auth/verify',
          data: {
            name: `${first_name} ${last_name}`, // Additional user data
          }
        }
      });

      if (error) {
        console.error("Supabase Sign-Up Error:", error);
        return res.status(400).json({ error: error.message });
      }

      // Store additional user data in Supabase (creating a profile)
      const { data: userData, error: userDataError } = await supabase
        .from('users') // Assuming 'users' table exists in Supabase
        .insert([
          { w3_id, first_name, last_name, email: w3_id } // You can add more fields here
        ]);

      if (userDataError) {
        console.error("Supabase Data Insertion Error:", userDataError);
        return res.status(400).json({ error: "Error storing user data." });
      }

      res.status(201).json({
        message: "User successfully registered. Please verify your email.",
        user: { w3_id, first_name, last_name },
      });
    } else {
      return res.status(400).json({ error: "Please use a valid W3 ID for signup." });
    }
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
};

// Login Handler
export const login = async (req, res) => {
  const { w3_id, password } = req.body;

  if (!w3_id || !password) {
    return res.status(400).json({ error: "Both w3_id and password are required" });
  }

  try {
    // Use Supabase to sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: w3_id, // W3 ID used as email
      password,
    });

    if (error) {
      console.error("Supabase Login Error:", error);
      return res.status(400).json({ error: error.message });
    }

    // Check if email is confirmed before allowing login
    if (!data.user.email_confirmed_at) {
      return res.status(403).json({
        error: "Please verify your email before logging in.",
        requiresEmailVerification: true
      });
    }

    // Determine user type (admin or regular)
    const adminW3s = ["Harsh.Pansuriya@ibm.com"]; // List of admin W3 IDs

    res.status(200).json({
      message: "Login successful",
      user: {
        w3_id: data.user.email, // W3 ID (email in Supabase)
        first_name: data.user.user_metadata?.name?.split(' ')[0], // Extract first name from metadata
        last_name: data.user.user_metadata?.name?.split(' ')[1], // Extract last name from metadata
        user_type: adminW3s.includes(data.user.email) ? "admin" : "user",
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Optional: Resend verification email
export const resendVerificationEmail = async (req, res) => {
  const { w3_id } = req.body;

  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: w3_id,
      options: {
        emailRedirectTo: process.env.EMAIL_REDIRECT_URL || 'http://localhost:3000/auth/verify'
      }
    });

    if (error) {
      console.error("Resend Verification Error:", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Verification email resent. Please check your inbox."
    });
  } catch (err) {
    console.error("Resend Verification Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
};
