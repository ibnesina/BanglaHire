<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    public function run()
    {
        // Inserting data into the categories table
        DB::table('categories')->insert([
            [
                'name' => 'Web Development',
                'skills' => json_encode(['PHP', 'JavaScript', 'HTML', 'CSS']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Data Science',
                'skills' => json_encode(['Python', 'R', 'SQL', 'Machine Learning']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Graphic Design',
                'skills' => json_encode(['Photoshop', 'Illustrator', 'InDesign']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Project Management',
                'skills' => json_encode(['Agile', 'Scrum', 'Leadership']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mobile App Development',
                'skills' => json_encode(['Java', 'Swift', 'Flutter', 'React Native']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cloud Computing',
                'skills' => json_encode(['AWS', 'Azure', 'Google Cloud', 'Docker']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cybersecurity',
                'skills' => json_encode(['Ethical Hacking', 'Network Security', 'Penetration Testing', 'Firewalls']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Digital Marketing',
                'skills' => json_encode(['SEO', 'PPC', 'Content Marketing', 'Google Analytics']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'DevOps',
                'skills' => json_encode(['Jenkins', 'Kubernetes', 'CI/CD', 'Terraform']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Machine Learning',
                'skills' => json_encode(['TensorFlow', 'Keras', 'PyTorch', 'Scikit-learn']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Video Production',
                'skills' => json_encode(['Final Cut Pro', 'Adobe Premiere', 'After Effects', 'Cinematography']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Content Writing',
                'skills' => json_encode(['Copywriting', 'SEO Writing', 'Technical Writing', 'Creative Writing']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Photography',
                'skills' => json_encode(['Portrait Photography', 'Landscape Photography', 'Photo Editing', 'Lighting Techniques']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cooking',
                'skills' => json_encode(['Baking', 'Grilling', 'Sous-Vide', 'Pastry Making', 'Garnishing']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
