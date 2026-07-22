<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ContentItem extends Model
{
    protected $fillable = ['type','content_key','slug','status','sort_order','is_featured','data'];
    protected function casts(): array { return ['data' => 'array', 'is_featured' => 'boolean', 'sort_order' => 'integer']; }
    public function toFrontend(): array {
        $data = is_array($this->data) ? $this->data : [];
        return array_merge($data, [
            'id' => (string) $this->getKey(),
            'createdAt' => optional($this->created_at)->toISOString(),
            'updatedAt' => optional($this->updated_at)->toISOString(),
        ]);
    }
}
