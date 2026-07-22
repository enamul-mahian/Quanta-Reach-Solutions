<?php
namespace App\Http\Controllers;
use App\Models\ContentItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
class ContentController extends Controller
{
    private const TYPES = [
        'blog-posts','inquiries','legal-pages','tickets','testimonials','portfolios',
        'pricing-packages','targets','team-members','services','meetings','media'
    ];
    private function assertType(string $type): void { abort_unless(in_array($type, self::TYPES, true), 404); }
    private function baseQuery(string $type): Builder { $this->assertType($type); return ContentItem::query()->where('type', $type); }
    public function index(Request $request, string $type): JsonResponse
    {
        $query = $this->baseQuery($type);
        $isPrivileged = $request->user()?->isRole(['super-admin','admin','editor']) ?? false;
        $includeAll = $isPrivileged && $request->boolean('include_all');
        if (!$includeAll) {
            if ($type === 'pricing-packages') $query->where('status', 'Active');
            elseif ($type === 'team-members') $query->where('status', 'Active');
            elseif (in_array($type, ['blog-posts','testimonials','portfolios','services'], true)) $query->where('status', 'Published');
            elseif (in_array($type, ['inquiries','meetings','media','targets'], true) && !$isPrivileged) abort(403);
            elseif ($type === 'tickets' && !$isPrivileged) {
                abort_unless($request->user(), 401);
                $query->where('data->clientUid', (string) $request->user()->getKey());
            }
        }
        if ($request->filled('status')) $query->where('status', $request->string('status')->toString());
        if ($request->boolean('featured')) $query->where('is_featured', true);
        if ($request->filled('slug')) $query->where('slug', $request->string('slug')->toString());
        $items = $query->orderBy('sort_order')->orderByDesc('created_at')->get()->map->toFrontend()->values();
        return response()->json(['data' => $items]);
    }
    public function show(Request $request, string $type, string $idOrSlug): JsonResponse
    {
        $item = $this->baseQuery($type)->where(fn($q) => $q->whereKey($idOrSlug)->orWhere('slug', $idOrSlug)->orWhere('content_key', $idOrSlug))->firstOrFail();
        $isPrivileged = $request->user()?->isRole(['super-admin','admin','editor']) ?? false;
        if (!$isPrivileged) {
            if (in_array($type, ['blog-posts','testimonials','portfolios','services'], true) && $item->status !== 'Published') abort(404);
            if ($type === 'pricing-packages' && $item->status !== 'Active') abort(404);
            if ($type === 'team-members' && $item->status !== 'Active') abort(404);
            if (in_array($type, ['inquiries','meetings','media','targets'], true)) abort(403);
            if ($type === 'tickets' && (string)($item->data['clientUid'] ?? '') !== (string)$request->user()?->getKey()) abort(403);
        }
        return response()->json(['data' => $item->toFrontend()]);
    }
    public function store(Request $request, string $type): JsonResponse
    {
        $this->assertType($type);
        if (!$request->user()->isRole(['super-admin','admin','editor']) && $type !== 'tickets') abort(403);
        $payload = $request->validate(['data' => ['required','array']])['data'];
        $payload = $this->clean($payload);
        if ($type === 'tickets') {
            $payload['clientUid'] = (string) $request->user()->getKey();
            $payload['clientName'] = $payload['clientName'] ?? $request->user()->name;
            $payload['status'] = $payload['status'] ?? 'Open';
            $payload['replies'] = $payload['replies'] ?? [];
        }
        $item = ContentItem::create($this->columns($type, $payload));
        return response()->json(['data' => $item->fresh()->toFrontend()], 201);
    }
    public function publicStore(Request $request, string $type): JsonResponse
    {
        abort_unless(in_array($type, ['inquiries','meetings'], true), 404);
        $payload = $request->validate(['data' => ['required','array']])['data'];
        $payload = $this->clean($payload);
        if ($type === 'inquiries') {
            validator($payload, ['fullName' => ['required','string','max:150'], 'email' => ['required','email','max:190'], 'projectDescription' => ['required','string','max:10000']])->validate();
            $payload['status'] = 'New'; $payload['priority'] = $payload['priority'] ?? 'Medium';
        } else {
            validator($payload, ['fullName' => ['nullable','string','max:150'], 'email' => ['required','email','max:190']])->validate();
            $payload['status'] = 'Pending';
        }
        $item = ContentItem::create($this->columns($type, $payload));
        return response()->json(['data' => ['id' => (string)$item->id], 'message' => 'Submitted successfully.'], 201);
    }
    public function update(Request $request, string $type, string $id): JsonResponse
    {
        $item = $this->baseQuery($type)->findOrFail($id);
        if (!$request->user()->isRole(['super-admin','admin','editor']) && $type !== 'tickets') abort(403);
        if ($type === 'tickets' && !$request->user()->isRole(['super-admin','admin','editor']) && (string)($item->data['clientUid'] ?? '') !== (string)$request->user()->getKey()) abort(403);
        $updates = $this->clean($request->validate(['data' => ['required','array']])['data']);
        $merged = array_replace_recursive($item->data ?? [], $updates);
        $item->update($this->columns($type, $merged));
        return response()->json(['data' => $item->fresh()->toFrontend()]);
    }
    public function destroy(Request $request, string $type, string $id): JsonResponse
    {
        $item = $this->baseQuery($type)->findOrFail($id);
        if (!$request->user()->isRole(['super-admin','admin','editor'])) abort(403);
        $item->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
    public function addReply(Request $request, string $id): JsonResponse
    {
        $item = $this->baseQuery('tickets')->findOrFail($id);
        $user = $request->user();
        if (!$user->isRole(['super-admin','admin','editor']) && (string)($item->data['clientUid'] ?? '') !== (string)$user->getKey()) abort(403);
        $reply = $request->validate(['reply' => ['required','array']])['reply'];
        $reply['createdAt'] = now()->toISOString();
        $data = $item->data ?? []; $data['replies'] = array_values(array_merge($data['replies'] ?? [], [$reply]));
        $item->update($this->columns('tickets', $data));
        return response()->json(['data' => $item->fresh()->toFrontend()]);
    }
    private function columns(string $type, array $payload): array
    {
        return [
            'type' => $type,
            'content_key' => $payload['type'] ?? $payload['key'] ?? null,
            'slug' => isset($payload['slug']) ? trim((string)$payload['slug']) : null,
            'status' => isset($payload['status']) ? trim((string)$payload['status']) : null,
            'sort_order' => (int)($payload['sortOrder'] ?? 0),
            'is_featured' => (bool)($payload['isFeatured'] ?? false),
            'data' => $payload,
        ];
    }
    private function clean(array $payload): array
    {
        unset($payload['id'], $payload['createdAt'], $payload['updatedAt']);
        return $payload;
    }
}
