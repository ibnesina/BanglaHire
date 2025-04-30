<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\Sanctum;

use function Pest\Laravel\postJson;

uses(Tests\TestCase::class, Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature/Authentication');

const FORGOT_URL     = '/api/forgot-password';
const CHANGE_URL     = '/api/password/change';
const RESET_URL      = '/api/reset-password';
const TEST_NEW   = 'BrandNew1!';

test('sends password reset link when email exists', function () {
    $user = User::factory()->create();

    Password::shouldReceive('sendResetLink')
        ->once()
        ->andReturn(Password::RESET_LINK_SENT);

    postJson(FORGOT_URL, ['email' => $user->email])
        ->assertStatus(200)
        ->assertJson(['message' => 'Password reset link sent!']);
});

test('password reset link validation errors', function () {
    postJson(FORGOT_URL, ['email' => ''])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('resets password via token endpoint', function () {
    $user  = User::factory()->create(['password' => Hash::make('oldpass')]);
    $token = Password::createToken($user);

    postJson(CHANGE_URL, [
        'token'                 => $token,
        'email'                 => $user->email,
        'password'              => TEST_NEW,
        'password_confirmation' => TEST_NEW,
    ])->assertStatus(200)
      ->assertJson(['message' => 'Password reset successful']);

    expect(Hash::check(TEST_NEW, $user->fresh()->password))->toBeTrue();
});

test('reset password validation errors', function () {
    postJson(CHANGE_URL, [
        'email' => 'invalid',
        'token' => '',
    ])->assertStatus(422)
      ->assertJsonValidationErrors(['email','password']);
});

test('changes password with old password', function () {
    $user = User::factory()->create([
        'password'          => Hash::make('mypwd'),
        'email_verified_at' => now(),
    ]);

    Sanctum::actingAs($user);

    postJson(RESET_URL, [
        'email'                 => $user->email,
        'old_password'          => 'mypwd',
        'password'              => TEST_NEW,
        'password_confirmation' => TEST_NEW,
    ])->assertStatus(200)
      ->assertJson(['message' => 'Password updated successfully']);

    expect(Hash::check(TEST_NEW, $user->fresh()->password))->toBeTrue();
});
