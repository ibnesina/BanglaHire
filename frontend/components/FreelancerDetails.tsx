import React from 'react';
import { getFreelancerByIdAPI } from '@/lib/api/profileUpdateAPI';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/components/ui/loader';
import Image from 'next/image';
import Link from 'next/link';

export default function FreelancerDetails({userId}: {userId: string}) {
  const { data: freelancerData, isLoading } = useQuery({
    queryKey: ['freelancer', userId],
    queryFn: () => getFreelancerByIdAPI(userId)
  });
  
  if (isLoading) return <Loader />;
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
  <div className="md:flex">
    <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-white border-2 border-blue-300 overflow-hidden mb-4">
          {freelancerData?.user?.profile_picture ? (
            <Image src={freelancerData.user.profile_picture} alt={freelancerData.user.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-blue-500 text-3xl font-bold">
              {freelancerData?.user?.name?.charAt(0)}
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{freelancerData?.user?.name}</h2>
        <p className="text-sm text-gray-600 mb-2">{freelancerData?.user?.email}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-medium">৳{freelancerData?.hourly_rate}/hr</span>
          {freelancerData?.user?.nationality && (
            <span className="text-gray-600 text-sm">{freelancerData.user.nationality}</span>
          )}
        </div>
        <div className="w-full py-2 px-3 bg-white rounded-md shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Balance:</span>
            <span className="font-medium text-gray-800">৳{freelancerData?.user?.balance}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-auto">
          <p>Member since: {new Date(freelancerData?.created_at).toLocaleDateString()}</p>
        </div>
        <Link href="/settings" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">
          Edit Profile
        </Link>
      </div>
    </div>
    
    <div className="md:w-2/3 p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-semibold text-gray-700 border-b border-gray-200 pb-1">Bio</h3>
          <p className="text-gray-600 text-sm mt-2">{freelancerData?.bio}</p>
        </div>
        
        <div>
          <h3 className="text-md font-semibold text-gray-700 border-b border-gray-200 pb-1">Skills</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {freelancerData?.skills && 
              (Array.isArray(freelancerData.skills) 
                ? freelancerData.skills 
                : JSON.parse(freelancerData.skills)
              ).map((skill: string, index: number) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))
            }
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-semibold text-gray-700 border-b border-gray-200 pb-1">Experience</h3>
          <p className="text-gray-600 text-sm mt-2">{freelancerData?.experiences}</p>
        </div>
        
        {freelancerData?.certifications && (
          <div>
            <h3 className="text-md font-semibold text-gray-700 border-b border-gray-200 pb-1">Certifications</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(typeof freelancerData.certifications === 'string' 
                ? JSON.parse(freelancerData.certifications) 
                : freelancerData.certifications
              ).map((cert: string, index: number) => (
                <a key={index} href={cert} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-500 hover:text-blue-700 text-sm flex items-center">
                  <span className="mr-1">📜</span> Certification {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {freelancerData?.portfolio_link && (
          <div>
            <h3 className="text-md font-semibold text-gray-700 border-b border-gray-200 pb-1">Portfolio</h3>
            <a href={freelancerData.portfolio_link} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center mt-2 text-blue-500 hover:text-blue-700 text-sm">
              <span className="mr-1">🔗</span> View Portfolio
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
  );
}
