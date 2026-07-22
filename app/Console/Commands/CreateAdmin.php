<?php
namespace App\Console\Commands;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
class CreateAdmin extends Command
{
    protected $signature = 'qrs:create-admin {--email=} {--name=} {--password=}';
    protected $description = 'Create or update the Quanta Reach super admin account';
    public function handle(): int
    {
        $email = $this->option('email') ?: $this->ask('Admin email', env('QRS_ADMIN_EMAIL', 'admin@quantareach.solutions'));
        $name = $this->option('name') ?: $this->ask('Admin name', env('QRS_ADMIN_NAME', 'Quanta Reach Admin'));
        $password = $this->option('password') ?: $this->secret('Admin password (minimum 12 characters)');
        if (!is_string($password) || strlen($password) < 12) { $this->error('Password must contain at least 12 characters.'); return self::FAILURE; }
        $user = User::updateOrCreate(['email'=>mb_strtolower(trim($email))], ['name'=>$name, 'password'=>Hash::make($password), 'role'=>'super-admin']);
        $this->info('Super admin ready: '.$user->email);
        return self::SUCCESS;
    }
}
