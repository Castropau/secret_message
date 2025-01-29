"use client";
import { useRouter } from 'next/navigation';

const UnauthorizedPage = () => {
  const router = useRouter();


  const page_1 = () => {
    router.push('../secret-page-1'); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6">401 Unauthorized</h1>
        <p className="text-lg text-center mb-4">You do not have permission to view this page.</p>

        
        <button
          onClick={page_1}
          className="mt-4 w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Go Back to Secret Page 1
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
