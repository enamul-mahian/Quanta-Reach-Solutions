<?php
namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class MediaUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $file = $request->validate(['file' => ['required','file','max:51200','mimetypes:image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/mpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain']])['file'];
        $folder = 'uploads/'.now()->format('Y/m');
        $destination = public_path($folder);
        if (!is_dir($destination)) mkdir($destination, 0755, true);
        $name = Str::uuid().'.'.strtolower($file->getClientOriginalExtension());
        $file->move($destination, $name);
        $mime = $file->getClientMimeType() ?: 'application/octet-stream';
        $resource = str_starts_with($mime, 'image/') ? 'image' : (str_starts_with($mime, 'video/') ? 'video' : 'raw');
        return response()->json(['data' => [
            'url' => asset($folder.'/'.$name),
            'publicId' => $folder.'/'.$name,
            'resourceType' => $resource,
            'bytes' => filesize($destination.'/'.$name),
            'format' => strtolower(pathinfo($name, PATHINFO_EXTENSION)),
        ]], 201);
    }
}
