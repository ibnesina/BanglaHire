<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use App\Models\User;

class ClientsSeeder extends Seeder
{
    public function run(): void
    {
        // Grab the UUIDs of the 3 most recent client users from the users table
        $clientUuids = User::where('type', 'Client')
                           ->orderBy('created_at', 'desc')  // Order by creation date, most recent first
                           ->pluck('id')
                           ->take(3)
                           ->values()
                           ->all();

        // Sample client data to seed
        $samples = [
            [
                'company_name' => 'Tech Innovators Inc.',
                'payment_method_verified' => true,
            ],
            [
                'company_name' => 'Creative Solutions Ltd.',
                'payment_method_verified' => false,
            ],
            [
                'company_name' => 'Green Earth Enterprises',
                'payment_method_verified' => true,
            ],
        ];

        foreach ($clientUuids as $index => $uuid) {
            $sample = $samples[$index];

            // Create or update the client record for the most recent clients
            Client::updateOrCreate(
                ['client_id' => $uuid],
                [
                    'company_name' => $sample['company_name'],
                    'payment_method_verified' => $sample['payment_method_verified'],
                ]
            );
        }
    }
}
