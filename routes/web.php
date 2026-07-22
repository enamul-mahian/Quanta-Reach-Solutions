<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\MediaUploadController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
Route::prefix('api')->group(function (): void {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:8,1');
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth');

    Route::get('/settings', [SettingsController::class, 'show']);
    Route::get('/content/{type}', [ContentController::class, 'index']);
    Route::get('/content/{type}/{idOrSlug}', [ContentController::class, 'show']);
    Route::post('/public/{type}', [ContentController::class, 'publicStore'])->middleware('throttle:10,1');
    Route::post('/media/upload', [MediaUploadController::class, 'store'])->middleware('throttle:10,1');

    Route::middleware('auth')->group(function (): void {
        Route::post('/content/{type}', [ContentController::class, 'store']);
        Route::patch('/content/{type}/{id}', [ContentController::class, 'update']);
        Route::delete('/content/{type}/{id}', [ContentController::class, 'destroy']);
        Route::post('/tickets/{id}/replies', [ContentController::class, 'addReply']);
        Route::put('/settings', [SettingsController::class, 'update'])->middleware('role:super-admin,admin,editor');
        Route::get('/users', [UserController::class, 'index'])->middleware('role:super-admin,admin');
        Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->middleware('role:super-admin');
    });
});
Route::view('/{path?}', 'app')->where('path', '^(?!api|uploads|assets|src|storage|up).*$');
