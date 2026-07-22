<?php
namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
class AuthController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json(['data' => $user ? $user->toFrontend() : null]);
    }
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate(['email' => ['required','email'], 'password' => ['required','string','max:255']]);
        if (!Auth::attempt(['email' => mb_strtolower(trim($credentials['email'])), 'password' => $credentials['password']], true)) {
            throw ValidationException::withMessages(['email' => ['The provided credentials are invalid.']]);
        }
        $request->session()->regenerate();
        return response()->json(['message' => 'Authenticated successfully.', 'data' => $request->user()->toFrontend()]);
    }
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Signed out successfully.']);
    }
    public function forgotPassword(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required','email']]);
        Password::sendResetLink(['email' => mb_strtolower(trim($data['email']))]);
        return response()->json(['message' => 'If that account exists, a password reset link has been sent.']);
    }
}
