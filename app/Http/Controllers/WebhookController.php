<?php

namespace App\Http\Controllers;

use App\Models\WhatsappApiLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function index(Request $request)
    {
        DB::beginTransaction();
        try {
            if ($request->entry) {
                $response = $request->entry[0]['changes'][0]['value']['messages'][0];
                $id = $response['context']['id'];
                $payload = $response['button']['payload'];

                $whatsappApiLog = WhatsappApiLog::where('response_id', $id)->first();
                if ($payload == "Konfirmasi Pesanan") {
                    (new OrderController)->approvePayment($whatsappApiLog->order->id);
                } else if ($payload == "Tolak Pesanan") {
                    (new OrderController)->rejectPayment($whatsappApiLog->order->id);
                }

                DB::commit();
            } else {
                Log::debug($request->all());
                DB::rollBack();
            }
            return response($request->hub_challenge, 200)
                ->header('Content-Type', 'text/plain');
        } catch (\Throwable $error) {
            DB::rollBack();
            Log::error($error->getMessage());
        }
    }
}
