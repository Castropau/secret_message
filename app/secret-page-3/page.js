"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../utils/supabase';
import Link from 'next/link';  
import { EyeIcon } from '@heroicons/react/24/solid';  

const Secret_Page_3 = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);  
  const [friendEmail, friend_email] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.log("Error fetching session:", error.message);
        router.push('/signin');
      } else if (session) {
        setUser(session.user);
        fetchFriendList(session.user.email);
        fetchPendingRequests(session.user.email);
      } else {
        router.push('/signin');
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  const fetchFriendList = async (userEmail) => {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .or(`friend_email.eq.${userEmail},user_email.eq.${userEmail}`) 
      .eq('status', 'friends');  

    if (error) {
      console.error('Error fetching friends:', error.message);
    } else {
      const formattedFriends = data.map((friend) => {
        return {
          friendEmail: friend.friend_email === userEmail ? friend.user_email : friend.friend_email,
        };
      });
      setFriendList(formattedFriends); 
    }
  };

  const fetchPendingRequests = async (userEmail) => {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('friend_email', userEmail)
      .eq('status', 'pending'); 

    if (error) {
      console.error('Error fetching pending requests:', error.message);
    } else {
      setPendingRequests(data);
    }
  };

  const send_friend_request = async () => {
    if (!friendEmail.trim()) return;
    const { data, error } = await supabase
      .from('friends')
      .insert([{ user_email: user.email, friend_email: friendEmail, status: 'pending' }]);

    if (error) {
      console.error('Error sending friend request:', error.message);
      alert('Failed to send friend request. Please try again.');
    } else {
      alert('Friend request sent!');
      friend_email('');  
    }
  };

  const accept_friend_request = async (friendEmail) => {
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'friends' }) 
      .eq('user_email', friendEmail)  
      .eq('friend_email', user.email)  
      .eq('status', 'pending');        

    if (error) {
      console.error('Error accepting friend request:', error.message);
      alert('Failed to accept friend request.');
    } else {
      alert('Friend request accepted!');
      // Refresh friends and pending requests
      fetchFriendList(user.email);
      fetchPendingRequests(user.email);
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
  const page_1 = () => {
    router.push('/secret-page-1'); 
  };
  const page_2 = () => {
    router.push('/secret-page-2'); 
  };



  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Secret Page 3</h1>
        {user ? (
          <div>
            <p>Your email: {user.email}</p>
            <h2 className="mt-4 text-xl">Your Friends:</h2>
            <ul>
              {friendList.length > 0 ? (
                friendList.map((friend, index) => (
                  <li key={index} className="flex justify-between items-center mb-2">
                    <span>{friend.friendEmail}</span>
                    <Link
                            href={`/secret-message/${friend.friendEmail}`}
                            className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
                        >
      
                        <EyeIcon className="w-5 h-5 mr-2" /> 
                        
                    </Link>
                  </li>
                ))
              ) : (
                <p>No friends found.</p>
              )}
            </ul>

           
            <h2 className="mt-4 text-xl">Pending Friend Requests:</h2>
            <ul>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <li key={request.id} className="flex justify-between items-center mb-2">
                    <span>{request.user_email}</span>
                    <button
                      onClick={() => accept_friend_request(request.user_email)}
                      className="ml-4 py-1 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                  </li>
                ))
              ) : (
                <p>No pending requests found.</p>
              )}
            </ul>

            
            <div className="mt-4">
              <input
                type="email"
                value={friendEmail}
                onChange={(e) => friend_email(e.target.value)}
                placeholder="Enter friend's email"
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={send_friend_request}
                className="mt-2 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Send Friend Request
              </button>
            </div>
            <button
              onClick={logout}
              className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Log Out
            </button>
            <button
              onClick={page_1}
              className="mt-4 w-full py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Go to Secret Page 1
            </button>
            <button
              onClick={page_2}
              className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Go to Secret Page 2
            </button>

            
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Secret_Page_3;
