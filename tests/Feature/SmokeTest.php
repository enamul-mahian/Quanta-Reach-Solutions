<?php
namespace Tests\Feature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class SmokeTest extends TestCase
{
    use RefreshDatabase;
    public function test_home_page_loads(): void { $this->get('/')->assertOk()->assertSee('Quanta Reach Solutions'); }
    public function test_settings_api_loads(): void { $this->getJson('/api/settings')->assertOk()->assertJsonStructure(['data']); }
}
