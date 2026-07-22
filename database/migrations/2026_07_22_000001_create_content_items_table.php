<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('content_items', function (Blueprint $table) {
            $table->id(); $table->string('type', 60)->index(); $table->string('content_key', 120)->nullable(); $table->string('slug', 190)->nullable();
            $table->string('status', 40)->nullable()->index(); $table->integer('sort_order')->default(0)->index(); $table->boolean('is_featured')->default(false)->index();
            $table->json('data'); $table->timestamps(); $table->unique(['type','content_key']); $table->index(['type','slug']);
        });
    }
    public function down(): void { Schema::dropIfExists('content_items'); }
};
