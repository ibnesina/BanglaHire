<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;
use App\Models\Freelancer;
use App\Models\Category;
use App\Models\User;

class FreelancersSeeder extends Seeder
{
    public function run(): void
    {
        // Load all categories and check if skills are already an array
        $categories = Category::all()->keyBy('name')->map(function($cat) {
            return [
                'id'     => $cat->id,
                'skills' => is_string($cat->skills) ? json_decode($cat->skills, true) : $cat->skills,
            ];
        });

        // Grab the UUIDs of the first 10 freelancer users you seeded earlier
        $freelancerUuids = User::where('type', 'Freelancer')
                               ->pluck('id')
                               ->take(10)
                               ->values()
                               ->all();

        // 10 sample definitions with some categories repeated but different skill subsets
        $samples = [
            [
                'bio'           => 'Experienced web developer with a passion for coding.',
                'category'      => 'Web Development',
                'skills'        => ['PHP', 'JavaScript', 'HTML', 'CSS'],
                'experiences'   => '5+ years in full‑stack web development.',
                'hourly_rate'   => 50.00,
                'certifications'=> ['https://example.com/cert1', 'https://example.com/cert2'],
                'portfolio_link'=> 'https://example.com/portfolio1',
            ],
            [
                'bio'           => 'Frontend specialist focusing on user interfaces.',
                'category'      => 'Web Development',
                'skills'        => ['JavaScript', 'CSS'],
                'experiences'   => '3+ years building responsive UIs.',
                'hourly_rate'   => 45.00,
                'certifications'=> ['https://example.com/cert3'],
                'portfolio_link'=> 'https://example.com/portfolio2',
            ],
            [
                'bio'           => 'Data scientist building ML pipelines and insights.',
                'category'      => 'Data Science',
                'skills'        => ['Python', 'Machine Learning'],
                'experiences'   => 'Led end‑to‑end ML projects.',
                'hourly_rate'   => 70.00,
                'certifications'=> ['https://example.com/cert4'],
                'portfolio_link'=> 'https://example.com/portfolio3',
            ],
            [
                'bio'           => 'Statistics expert with strong SQL skills.',
                'category'      => 'Data Science',
                'skills'        => ['R', 'SQL'],
                'experiences'   => 'Performed complex data analyses.',
                'hourly_rate'   => 65.00,
                'certifications'=> ['https://example.com/cert5'],
                'portfolio_link'=> 'https://example.com/portfolio4',
            ],
            [
                'bio'           => 'DevOps engineer automating cloud deployments.',
                'category'      => 'DevOps',
                'skills'        => ['Jenkins', 'CI/CD'],
                'experiences'   => 'Implemented pipelines for multiple teams.',
                'hourly_rate'   => 80.00,
                'certifications'=> ['https://example.com/cert6'],
                'portfolio_link'=> 'https://example.com/portfolio5',
            ],
            [
                'bio'           => 'Kubernetes and Terraform specialist.',
                'category'      => 'DevOps',
                'skills'        => ['Kubernetes', 'Terraform'],
                'experiences'   => 'Managed scalable containerized infrastructure.',
                'hourly_rate'   => 85.00,
                'certifications'=> ['https://example.com/cert7'],
                'portfolio_link'=> 'https://example.com/portfolio6',
            ],
            [
                'bio'           => 'Professional content writer with SEO expertise.',
                'category'      => 'Content Writing',
                'skills'        => ['SEO Writing', 'Technical Writing'],
                'experiences'   => 'Writing for tech blogs and whitepapers.',
                'hourly_rate'   => 30.00,
                'certifications'=> ['https://example.com/cert8'],
                'portfolio_link'=> 'https://example.com/portfolio7',
            ],
            [
                'bio'           => 'Creative copywriter and social media strategist.',
                'category'      => 'Content Writing',
                'skills'        => ['Copywriting', 'Creative Writing'],
                'experiences'   => 'Developed engaging marketing content.',
                'hourly_rate'   => 35.00,
                'certifications'=> ['https://example.com/cert9'],
                'portfolio_link'=> 'https://example.com/portfolio8',
            ],
            [
                'bio'           => 'Cross‑platform mobile dev with React Native & Flutter.',
                'category'      => 'Mobile App Development',
                'skills'        => ['React Native', 'Flutter'],
                'experiences'   => 'Delivered apps on both iOS and Android.',
                'hourly_rate'   => 55.00,
                'certifications'=> ['https://example.com/cert10'],
                'portfolio_link'=> 'https://example.com/portfolio9',
            ],
            [
                'bio'           => 'iOS app expert with Swift knowledge.',
                'category'      => 'Mobile App Development',
                'skills'        => ['Swift'],
                'experiences'   => 'Built high‑performance iOS apps.',
                'hourly_rate'   => 60.00,
                'certifications'=> ['https://example.com/cert11'],
                'portfolio_link'=> 'https://example.com/portfolio10',
            ],
        ];

        foreach ($freelancerUuids as $index => $uuid) {
            $sample = $samples[$index];

            // Look up category
            if (!isset($categories[$sample['category']])) {
                Log::error("Category '{$sample['category']}' not found for sample #{$index}");
                continue;
            }
            $cat = $categories[$sample['category']];

            // Validate skills
            $invalid = array_diff($sample['skills'], $cat['skills']);
            if ($invalid) {
                Log::error("Invalid skills for '{$sample['category']}': " . implode(', ', $invalid));
                continue;
            }

            // Create or update via Freelancer model directly
            Freelancer::updateOrCreate(
                ['freelancer_id' => $uuid],
                [
                    'bio'            => $sample['bio'],
                    'category_id'    => $cat['id'],
                    'skills'         => json_encode($sample['skills']),
                    'experiences'    => $sample['experiences'],
                    'hourly_rate'    => $sample['hourly_rate'],
                    'certifications' => json_encode($sample['certifications']),
                    'portfolio_link' => $sample['portfolio_link'],
                ]
            );
        }
    }
}
