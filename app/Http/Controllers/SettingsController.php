<?php
namespace App\Http\Controllers;
use App\Models\ContentItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $item = ContentItem::where('type','website-settings')->where('content_key','global')->first();
        return response()->json(['data' => $item?->data]);
    }
    public function update(Request $request): JsonResponse
    {
        $updates = $request->validate(['data' => ['required','array']])['data'];
        unset($updates['id'], $updates['createdAt'], $updates['updatedAt']);
        $item = ContentItem::firstOrNew(['type'=>'website-settings','content_key'=>'global']);
        $item->data = array_replace_recursive($item->data ?? [], $updates);
        $item->status = 'Published'; $item->save();
        return response()->json(['data' => $item->fresh()->data]);
    }
}
