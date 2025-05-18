<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Str;

class MessagesTableSeeder extends Seeder
{
    public function run()
    {
        // Get first 3 users for example (make sure you have at least 3 users)
        $users = User::take(3)->get();

        if ($users->count() < 2) {
            $this->command->info('Not enough users to seed messages.');
            return;
        }

        // Create some example messages between first 2 users
        Message::create([
            'id' => (string) Str::uuid(),
            'sender_id' => $users[0]->id,
            'receiver_id' => $users[1]->id,
            'message' => 'Hey, how are you?',
        ]);

        Message::create([
            'id' => (string) Str::uuid(),
            'sender_id' => $users[1]->id,
            'receiver_id' => $users[0]->id,
            'message' => 'I am good, thanks! What about you?',
        ]);

        // More messages to third user
        Message::create([
            'id' => (string) Str::uuid(),
            'sender_id' => $users[0]->id,
            'receiver_id' => $users[2]->id,
            'message' => 'Hello! Are you available for a project?',
        ]);

        Message::create([
            'id' => (string) Str::uuid(),
            'sender_id' => $users[2]->id,
            'receiver_id' => $users[0]->id,
            'message' => 'Yes, let’s discuss it!',
        ]);

        // $this->command->info('Sample messages seeded.');
    }
}
