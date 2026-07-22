<?php
namespace Database\Seeders;
use App\Models\ContentItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('QRS_ADMIN_EMAIL'); $password = env('QRS_ADMIN_PASSWORD');
        if ($email && $password && strlen($password) >= 12) {
            User::updateOrCreate(['email'=>mb_strtolower(trim($email))], ['name'=>env('QRS_ADMIN_NAME','Quanta Reach Admin'), 'password'=>Hash::make($password), 'role'=>'super-admin']);
        }
        ContentItem::firstOrCreate(['type'=>'website-settings','content_key'=>'global'], ['status'=>'Published','data'=>[
            'siteName'=>'Quanta Reach Solutions', 'email'=>'hello@quantareach.solutions', 'phone'=>'+880 1712-345678', 'defaultLanguage'=>'en'
        ]]);
    }
}
