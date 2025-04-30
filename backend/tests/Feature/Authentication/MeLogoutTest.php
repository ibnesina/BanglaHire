<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature/Authentication');

const ME_URL     = '/api/me';
const LOGOUT_URL = '/api/logout';

test('authenticated user can fetch their profile', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    Sanctum::actingAs($user, ['*']);

    getJson(ME_URL)
        ->assertStatus(200)
        ->assertJson([
            'id'    => $user->id,
            'email' => $user->email,
        ]);
});

test('guest cannot fetch profile', function () {
    getJson(ME_URL)
        ->assertStatus(401)
        ->assertJson(['message' => 'Unauthenticated.']);
});

test('authenticated user can logout', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $token = $user->createToken('test')->plainTextToken;

    postJson(LOGOUT_URL, [], [
        'Authorization' => 'Bearer ' . $token,
    ])->assertStatus(200)
      ->assertJson(['message' => 'Successfully logged out']);

    expect($user->tokens()->count())->toBe(0);
});

test('guest cannot logout', function () {
    postJson(LOGOUT_URL)
        ->assertStatus(401)
        ->assertJson(['message' => 'Unauthenticated.']);
});
