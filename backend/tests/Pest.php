<?php

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

// bring Pest’s HTTP helpers into global scope
use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\putJson;
use function Pest\Laravel\deleteJson;

uses(TestCase::class, RefreshDatabase::class)
    ->in('Feature');
