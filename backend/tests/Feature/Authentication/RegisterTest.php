<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\CustomVerifyEmail;
use function Pest\Laravel\postJson;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

const REGISTER_API_ENDPOINT = '/api/register';

test('registers a user and sends verification email', function () {
    Notification::fake();

    $payload = [
        'name'                  => 'Test User',
        'email'                 => 'test@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'type'                  => 'Freelancer',
    ];

    $response = postJson(REGISTER_API_ENDPOINT, $payload);

    $response->assertStatus(201)
             ->assertJsonStructure([
                'user'  => ['id','name','email','type'],
                'token',
                'message'
             ]);

    $user = User::first();
    expect($user->name)->toBe('Test User')
      ->and($user->type)->toBe('Freelancer');

    Notification::assertSentTo($user, CustomVerifyEmail::class);
});

test('registration fails with invalid payload', function () {
    postJson(REGISTER_API_ENDPOINT, [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name','email','password','type']);
});
