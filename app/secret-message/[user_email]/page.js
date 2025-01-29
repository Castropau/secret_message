"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabase';

const Secret_Message_Page = ({ params }) => {
  const [secretMessages, setSecretMessages] = useState([]);  
  const [userEmail, setUserEmail] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');  
  const router = useRouter();
  const [userStatus, setUserStatus] = useState('');  

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      const user_email = unwrappedParams?.user_email;

      if (user_email) {
        const decodedEmail = decodeURIComponent(user_email);
        setUserEmail(decodedEmail);
      }
    };

    unwrapParams();
  }, [params]); 

  useEffect(() => {
    if (userEmail) {
      const fetchSecretMessages = async () => {
        const { data, error } = await supabase
          .from('secret_messages')  
          .select('*') 
          .eq('user_email', userEmail); 

        if (error) {
          console.error('Error fetching secret messages:', error.message);
          setErrorMessage('Failed to load secret messages.');
        } else {
          setSecretMessages(data); 
        }
      };

      fetchSecretMessages();  
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      const fetch_user_status = async () => {
        const { data: userData, error: userError } = await supabase
          .from('friends') 
          .select('status')
          .or(`user_email.eq.${userEmail},friend_email.eq.${userEmail}`)  
          .single();  

        if (userError) {
          console.error('Error fetching user status:', userError.message);
          setErrorMessage('Failed to fetch user status.');
        } else {
          if (userData?.status !== 'friends') {
            
            router.push('../../401');
          } else {
            setUserStatus(userData?.status); 
          }
        }
      };

      fetch_user_status(); 
    }
  }, [userEmail, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">Secret Messages</h1>
        {userEmail && (
          <p className="text-lg font-semibold text-center mb-4">
            {userEmail}
          </p>
        )}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {secretMessages.length > 0 ? (
          secretMessages.map((message) => (
            <div key={message.id} className="mb-4">
              <p><strong>Message:</strong> {message.message}</p>
            </div>
          ))
        ) : (
          <p>No secret messages found for {userEmail}.</p>
        )}

        <button
          onClick={() => router.push('/secret-page-1')}
          className="mt-4 w-full py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Go to Secret Page 1
        </button>
        <button
          onClick={() => router.push('/secret-page-2')}
          className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Go to Secret Page 2
        </button>

        <button
          onClick={() => router.push('/secret-page-3')}
          className="mt-4 w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Go to Secret Page 3
        </button>
      </div>
    </div>
  );
};

export default Secret_Message_Page;
