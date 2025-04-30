"use client";
import React from 'react';
import { getClientByIdAPI } from '@/lib/api/profileUpdateAPI';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/components/ui/loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Building, CreditCard, Mail, User, Flag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ClientComponent({userId}: {userId: string}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['client', userId],
    queryFn: () => getClientByIdAPI(userId)
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading client data</div>;

  return (
    <div className="mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-blue-100 p-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg mb-6">
              <AvatarImage src={data?.user?.profile_picture || data?.user?.avatar} />
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
                {data?.user?.name?.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{data?.user?.name}</h2>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 mb-6">
              <User size={16} className="mr-2" />
              <span className="font-medium">Client</span>
            </div>
            
            <div className="w-full mt-4">
              <div className="flex items-center justify-between py-3 border-b border-blue-100">
                <span className="text-gray-600">Balance:</span>
                <span className="font-medium text-gray-800">৳{data?.user?.balance}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3 p-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">
            Client Information
          </h3>
          
          <div className="grid grid-cols-1 gap-y-6">
            <div className="flex items-start">
              <Building className="h-5 w-5 text-blue-600 mt-1 mr-4" />
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Company</h4>
                <p className="text-lg font-medium text-gray-800">{data?.company_name || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-600 mt-1 mr-4" />
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Email Address</h4>
                <p className="text-lg font-medium text-gray-800 break-words">{data?.user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Flag className="h-5 w-5 text-blue-600 mt-1 mr-4" />
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Nationality</h4>
                <p className="text-lg font-medium text-gray-800">{data?.user?.nationality || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-blue-600 mt-1 mr-4" />
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Member Since</h4>
                <p className="text-lg font-medium text-gray-800">{formatDate(data?.user?.created_at)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 text-blue-600 mt-1 mr-4" />
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Payment Status</h4>
                <p className={`text-lg font-medium ${data?.payment_method_verified ? 'text-green-600' : 'text-amber-600'}`}>
                  {data?.payment_method_verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
