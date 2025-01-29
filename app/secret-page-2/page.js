"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../utils/supabase';

const Secret_Page_2 = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secretMessages, setSecretMessages] = useState([]);
  const [newMessage, new_message] = useState('');
  const [editingMessageId, edited_message] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.log("Error fetching session:", error.message);
        router.push('/signin');
      } else if (session) {
        setUser(session.user);
        fetch_secret_message(session.user.email);
      } else {
        router.push('/signin');
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  const fetch_secret_message = async (userEmail) => {
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

  const save_message = async () => {
    if (!newMessage.trim()) return;
  
    const messageData = {
      user_email: user.email,
      message: newMessage,
    };

    if (editingMessageId) {
    
      const { data, error } = await supabase
        .from('secret_messages')
        .update({ message: newMessage })
        .eq('id', editingMessageId);

      if (error) {
        console.error('Error updating message:', error.message);
      } else {
        console.log('Message updated successfully');
        new_message(''); 
        edited_message(null);
        fetch_secret_message(user.email); 
      }
    } else {
      
      const { data, error } = await supabase
        .from('secret_messages')
        .upsert([messageData]);

      if (error) {
        console.error('Error saving message:', error.message);
      } else {
        console.log('Message saved successfully');
        new_message('');
        fetch_secret_message(user.email);
      }
    }
  };

  const deleteRow = async (messageId) => {
    const { error } = await supabase
      .from('secret_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error.message);
    } else {
      setSecretMessages(secretMessages.filter((msg) => msg.id !== messageId));
    }
  };

  const edit_message = (message) => {
    edited_message(message.id); 
    new_message(message.message); 
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error during sign-out:', error.message);
    } else {
      router.push('/signin');
    }
  };
  const secret_page_1 = () => {
    router.push('/secret-page-1');
  };

  const secret_page_3 = () => {
    router.push('/secret-page-3'); 
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Secret Page 2</h1>
        {user ? (
          <div>
            <p>Your email: {user.email}</p>
            <h2 className="mt-4 text-xl">Your Secret Messages:</h2>
            <ul>
              {secretMessages.length > 0 ? (
                secretMessages.map((msg) => (
                  <li key={msg.id} className="flex justify-between items-center mb-2">
                    <span>{msg.message}</span>
                    <button
                      onClick={() => edit_message(msg)}
                      className="ml-4 py-1 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRow(msg.id)}
                      className="ml-4 py-1 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No secret messages found.</p>
              )}
            </ul>

            <div className="mt-4">
              <textarea
                value={newMessage}
                onChange={(e) => new_message(e.target.value)}
                placeholder="Enter your new secret message"
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={save_message}
                className="mt-2 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                {editingMessageId ? 'Update Secret Message' : 'Save Secret Message'}
              </button>
            </div>

            <button
              onClick={logout}
              className="mt-4 w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Log Out
            </button>
            <button
              onClick={secret_page_1}
              className="mt-4 w-full py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Go to Secret Page 1
            </button>

            <button
              onClick={secret_page_3}
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

export default Secret_Page_2;
