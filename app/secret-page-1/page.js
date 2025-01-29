'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../utils/supabase';

const Secret_Page_1 = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secretMessages, setSecretMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.log("Error fetching session:", error.message);
        router.push('/signin');
      } else if (session) {
        setUser(session.user);
        fetchSecretMessages(session.user.email);
      } else {
        router.push('/signin');
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  const fetchSecretMessages = async (userEmail) => {
    const { data, error } = await supabase
      .from('secret_messages')
      .select('*')
      .eq('user_email', userEmail);
  
    if (error) {
      console.error('Error fetching secret messages:', error.message);
    } else {
      setSecretMessages(data);
    }
  };

  

  const delete_account = async () => {
    try {
      const { error: deleteMessagesError } = await supabase
        .from('secret_messages')
        .delete()
        .eq('user_email', user.email);  
  
      if (deleteMessagesError) {
        console.error('Error deleting secret messages:', deleteMessagesError.message);
        alert('Failed to delete secret messages. Please try again.');
        return;
      }
  
     
      const { data, error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', user.email);
  
      if (deleteError) {
        console.error('Error deleting account:', deleteError.message);
        alert('Failed to delete account. Please try again.');
      } else {
        await supabase.auth.signOut(); 
        alert('Account deleted successfully.');
        router.push('/signin');
      }
    } catch (err) {
      console.error('Error during account deletion process:', err.message);
      alert('An unexpected error occurred. Please try again.');
    }
  };
  

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during sign-out:', error.message);
    } else {
      router.push('/signin');
    }
  };

  const page_2 = () => {
    router.push('/secret-page-2');
  };

  const page_3 = () => {
    router.push('/secret-page-3'); 
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Secret Page 1</h1>
        {user ? (
          <div>
            <p>Your email: {user.email}</p>
            <h2 className="mt-4 text-xl">Your Secret Messages:</h2>
            <ul>
              {secretMessages.length > 0 ? (
                secretMessages.map((msg) => (
                  <li key={msg.id} className="flex justify-between items-center mb-2">
                    <span>{msg.message}</span>
                  </li>
                ))
              ) : (
                <p>No secret messages found.</p>
              )}
            </ul>
            <button
              onClick={delete_account}
              className="mt-4 w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Delete Account
            </button>

            {/* Log out button */}
            <button
              onClick={logout}
              className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Log Out
            </button>
            <button
              onClick={page_2}
              className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Go to Secret Page 2
            </button>

            <button
              onClick={page_3}
              className="mt-4 w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Go to Secret Page 3
            </button>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Secret_Page_1;
