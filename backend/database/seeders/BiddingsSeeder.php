<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Freelancer;
use App\Models\Bidding;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BiddingsSeeder extends Seeder
{
    public function run()
    {
        // Get the 5 most recent projects
        $projects = Project::latest()->take(5)->get();

        // Get 10 random freelancers
        $freelancers = Freelancer::inRandomOrder()->take(10)->get();

        foreach ($projects as $project) {
            // Pick 3–6 random freelancers to bid on each project
            $bidders = $freelancers->random(rand(3, 6));

            foreach ($bidders as $freelancer) {
                Bidding::create([
                    'project_id'      => $project->id,
                    'freelancer_id'   => $freelancer->freelancer_id,
                    'cover_letter'    => fake()->paragraph(),
                    'bidding_amount'  => fake()->randomFloat(2, 50, 1000),
                ]);
            }
        }
    }
}
