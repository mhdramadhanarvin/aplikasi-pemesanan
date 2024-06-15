<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\WhatsappAPI;
use Error;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SendPaymentConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Order $order)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(WhatsappAPI $whatsappAPI): void
    {
        DB::beginTransaction();
        try {
            $whatsappAPI->setTo(env('WHATSAPP_NUMBER'));
            $whatsappAPI->setTemplateName("neworder2");
            $order = Order::withCount('item_orders')->with('item_orders', 'address_order')->find($this->order->id);
            $orderAddress = $order->address_order;
            $image = Str::remove('public/', asset('storage/' . $order->proof_of_payment));
            $whatsappAPI->setTemplateComponent($image, $orderAddress->name, $orderAddress->phone_number, $orderAddress->address, $order->item_orders_count, $order->total_price);
            $response = $whatsappAPI->sendMessage();
            if (isset($response['messages'])) {
                $order->whatsapp_api_logs()->create([
                    'response_id' => $response['messages'][0]['id']
                ]);
                DB::commit();
            } else {
                throw new Error($response['error']['message']);
                DB::rollBack();
            }
        } catch (\Throwable $e) {
            Log::error("SendPaymentConfirmation :" . $e->getMessage());
        }
    }
}
