<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Category;
use App\Models\Client;
use Illuminate\Support\Arr;

class ProjectsSeeder extends Seeder
{
    public function run(): void
    {
        // Get available clients and categories
        $clients = Client::inRandomOrder()->take(3)->pluck('client_id')->all();
        $categories = Category::all();

        $sampleTitles = [
            'Build a Company Website',
            'Data Analysis for Sales Trends',
            'Design a Product Brochure',
            'Project Timeline & Sprint Management',
            'iOS App for Task Scheduling',
            'AWS Infrastructure Setup',
            'Security Audit & Pen Test',
            'SEO & PPC Campaign',
            'Kubernetes CI/CD Pipeline',
            'ML Model for Image Classification',
        ];

        $descriptions = [
            'We need someone to create a responsive web app.',
            'Looking for insights from our customer purchase data.',
            'Need modern and clean design for our product marketing.',
            'Help manage our team’s tasks and reports.',
            'Develop a lightweight and fast iOS app.',
            'Need cloud infrastructure for microservices.',
            'Audit our system and perform vulnerability testing.',
            'Improve our search ranking and paid ad performance.',
            'Configure a scalable CI/CD pipeline with monitoring.',
            'Train and validate a model on a large image dataset.',
        ];

        foreach (range(0, 9) as $i) {
            $category = $categories->random();

            $skills = $category->skills;
            $requiredSkills = Arr::random($skills, rand(1, min(3, count($skills)))); // Pick 1 to 3 valid skills

            Project::create([
                'client_id' => $clients[array_rand($clients)],
                'category_id' => $category->id,
                'title' => $sampleTitles[$i],
                'description' => $descriptions[$i],
                'required_skills' => $requiredSkills,
                'budget' => rand(500, 10000),
                'status' => 'Open',
                'file' => null, // Add file path if needed
            ]);
        }
    }
}
