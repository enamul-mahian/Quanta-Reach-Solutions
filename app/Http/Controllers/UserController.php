<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
class UserController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => User::latest()->get()->map->toFrontend()->values()]);
    }
    public function updateRole(Request $request, User $user): JsonResponse
    {
        abort_if($request->user()->is($user), 422, 'You cannot change your own role.');
        $data = $request->validate(['role' => ['required', Rule::in(['super-admin','admin','editor','client','user'])]]);
        $user->update($data);
        return response()->json(['data' => $user->fresh()->toFrontend()]);
    }
}
