<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $fillable = ['name','email','password','role','photo_url'];
    protected $hidden = ['password','remember_token'];
    protected function casts(): array { return ['email_verified_at' => 'datetime', 'password' => 'hashed']; }
    public function isRole(array|string $roles): bool { return in_array($this->role, (array) $roles, true); }
    public function toFrontend(): array {
        return [
            'uid' => (string) $this->getKey(),
            'id' => (string) $this->getKey(),
            'email' => $this->email,
            'displayName' => $this->name,
            'photoURL' => $this->photo_url,
            'role' => $this->role,
            'createdAt' => optional($this->created_at)->toISOString(),
            'updatedAt' => optional($this->updated_at)->toISOString(),
        ];
    }
}
