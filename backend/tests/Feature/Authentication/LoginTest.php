<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use function Pest\Laravel\postJson;


uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature/Authentication');

const LOGIN_URL = '/api/login';

beforeEach(function () {
    $this->user = User::factory()->create([
        'email'             => 'user@pest.test',
        'password'          => Hash::make('mypassword'),
        'email_verified_at' => now(),
    ]);
});

test('a verified user can login', function () {
    $response = postJson(LOGIN_URL, [
        'email'    => $this->user->email,
        'password' => 'mypassword',
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure([
                 'message',
                 'user' => ['id','name','email','type'],
                 'token',
             ]);
});

test('login fails with incorrect credentials', function () {
    postJson(LOGIN_URL, [
        'email'    => $this->user->email,
        'password' => 'wrong',
    ])->assertStatus(422)
      ->assertJsonValidationErrors(['email']);
});

test('unverified user cannot login', function () {
    $this->user->forceFill(['email_verified_at' => null])->save();

    postJson(LOGIN_URL, [
        'email'    => $this->user->email,
        'password' => 'mypassword',
    ])->assertStatus(403)
      ->assertJson(['message' => 'Please verify your email address before logging in.']);
});

