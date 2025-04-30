<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategoriesSeeder::class,
            UsersSeeder::class,
            AdminSeeder::class,
            FreelancersSeeder::class,
            ClientsSeeder::class,
            ProjectsSeeder::class,
            BiddingsSeeder::class,
        ]);
    }
}
