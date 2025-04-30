<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Client;
use App\Models\Freelancer;
use App\Models\Admin;
use App\Notifications\CustomVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_register_and_receive_verification_email()
    {
        Notification::fake();

        $payload = [
            'name'                  => 'Test User',
            'email'                 => 'test@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'type'                  => 'Freelancer',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure(['user' => ['id','email','type'], 'token','message']);

        $user = User::first();
        $this->assertEquals('Freelancer', $user->type);
        $this->assertDatabaseHas('freelancers', ['freelancer_id' => $user->id]);

        // assert your custom notification
        Notification::assertSentTo($user, CustomVerifyEmail::class);
    }

    /** @test */
    public function registration_validates_required_fields()
    {
        $this->postJson('/api/register', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['name','email','password','type']);
    }

    /** @test */
    public function unverified_user_cannot_login()
    {
        $user = User::factory()->create([
            'password'          => Hash::make('secret123'),
            'email_verified_at' => null,
        ]);

        $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'secret123',
        ])->assertStatus(403)
          ->assertJson(['message' => 'Please verify your email address before logging in.']);
    }

    /** @test */
    public function can_login_after_email_verified()
    {
        $user = User::factory()->create([
            'password'          => Hash::make('secret123'),
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email'    => $user->email,
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message','user'=>['id','email','type'],'token']);
    }

    /** @test */
    public function me_endpoint_returns_authenticated_user()
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        Sanctum::actingAs($user, ['*']);

        $this->getJson('/api/me')
             ->assertStatus(200)
             ->assertJson([
                 'id'    => $user->id,
                 'email' => $user->email,
             ]);
    }

    /** @test */
    public function can_request_password_reset_link()
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->postJson('/api/forgot-password', ['email' => $user->email])
             ->assertStatus(200)
             ->assertJson(['message' => 'Password reset link sent!']);

        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    /** @test */
    public function reset_password_via_token()
    {
        Notification::fake();

        $user = User::factory()->create([
            'password' => Hash::make('old-password'),
        ]);

        // 1) Send the reset link
        $this->postJson('/api/forgot-password', ['email' => $user->email])
            ->assertStatus(200);

        // 2) Grab the URL from your custom notification and parse out the token
        Notification::assertSentTo($user, ResetPasswordNotification::class, function ($notification) use (&$token) {
            // your notification should expose the full URL in $resetUrl
            $url = $notification->resetUrl;
            $query = parse_url($url, PHP_URL_QUERY);
            parse_str($query, $params);

            $token = $params['token'] ?? null;

            return ! is_null($token);
        });

        // 3) Hit the password-change endpoint with that token
        $new = 'new-password';
        $this->postJson('/api/password/change', [
            'token'                 => $token,
            'email'                 => $user->email,
            'password'              => $new,
            'password_confirmation' => $new,
        ])
            ->assertStatus(200)
            ->assertJson(['message' => 'Password reset successful']);

        $this->assertTrue(Hash::check($new, $user->fresh()->password));
    }


    /** @test */
    public function can_change_password_with_old_password()
    {
        $user = User::factory()->create([
            'password'          => Hash::make('oldpass'),
            'email_verified_at' => now(),
        ]);

        Sanctum::actingAs($user);

        $this->postJson('/api/reset-password', [
            'email'                 => $user->email,
            'old_password'          => 'oldpass',
            'password'              => 'brandnew',
            'password_confirmation' => 'brandnew',
        ])->assertStatus(200)
          ->assertJson(['message' => 'Password updated successfully']);

        $this->assertTrue(Hash::check('brandnew', $user->fresh()->password));
    }

    /** @test */
    public function logout_revokes_tokens()
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        Sanctum::actingAs($user);
        $user->createToken('another')->plainTextToken;

        $this->postJson('/api/logout')
             ->assertStatus(200)
             ->assertJson(['message' => 'Successfully logged out']);

        $this->assertCount(0, $user->tokens);
    }
}
