<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'type' => 'Freelancer',
        ]);

        $response->assertCreated()
                 ->assertJsonStructure([
                     'user',
                     'token',
                     'message',
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'type' => 'Freelancer',
        ]);
    }

    /** @test */
    public function user_cannot_register_with_existing_email()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/register', [
            'name' => 'Another User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'type' => 'Client',
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
                 ->assertJsonStructure([
                     'message',
                     'user',
                     'token',
                 ]);
    }

    /** @test */
    public function unverified_user_cannot_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => null,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
                 ->assertJson([
                     'message' => 'Please verify your email address before logging in.'
                 ]);
    }

    /** @test */
    public function user_can_request_password_reset_link()
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertOk()
                 ->assertJson([
                     'message' => 'Password reset link sent!',
                 ]);
    }

    /** @test */
    public function user_can_reset_password()
    {
        $user = User::factory()->create(['email' => 'test@example.com']);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/password-change', [
            'email' => 'test@example.com',
            'token' => $token,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk()
                 ->assertJson([
                     'message' => 'Password reset successful',
                 ]);
    }

    /** @test */
    public function user_can_update_password_with_old_password()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword'),
        ]);

        $this->actingAs($user);

        $response = $this->postJson('/api/reset-password', [
            'email' => 'test@example.com',
            'old_password' => 'oldpassword',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk()
                 ->assertJson([
                     'message' => 'Password updated successfully',
                 ]);
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/logout');

        $response->assertOk()
                 ->assertJson([
                     'message' => 'Successfully logged out',
                 ]);
    }

}
