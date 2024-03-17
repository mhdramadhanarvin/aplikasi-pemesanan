<?php

namespace App\Http\Controllers;

use App\Models\WhatsappApiLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function index(Request $request)
    {
        try {
            $response = $request->entry[0]['changes'][0]['value']['messages'][0];
            $id = $response['context']['id'];
            $payload = $response['button']['payload'];

            $whatsappApiLog = WhatsappApiLog::where('response_id', $id)->first();
            if ($payload == "Konfirmasi Pesanan") {
                $whatsappApiLog->order->update(['status' => 'on_progress']);
            } else if ($payload == "Tolak Pesanan") {
                $whatsappApiLog->order->update(['status' => 'canceled']);
            }

            return response($request->hub_challenge, 200)
                ->header('Content-Type', 'text/plain');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
        }
    }
}
