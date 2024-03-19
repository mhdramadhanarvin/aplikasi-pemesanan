<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CancelOrderExpired extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cancel-order-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $this->info('Starting...');

        DB::beginTransaction();
        try {

            $orders = Order::where('status', 'waiting_payment')->where('proof_of_payment', null)->where('pay_at', null)->where('payment_expired_at', '<', now())->get();
            foreach ($orders as $order) {
                $order->status = "expired";
                $order->save();
                foreach ($order->item_orders as $item_order) {
                    $item_order->product->quantity += $item_order->quantity;
                    $item_order->product->save();
                    $this->info("Re-stock quantity product " . $item_order->product->id);
                }
                $this->info("Canceled order ID : " . $order->id);
            }
            DB::commit();
            $this->info("DONE");
        } catch (\Exception $e) {
            DB::rollback();
            $this->error($e->getMessage());
        }
    }
}
