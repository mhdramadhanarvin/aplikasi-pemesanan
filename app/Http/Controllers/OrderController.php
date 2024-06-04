<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Requests\PaymentOrderRequest;
use App\Jobs\SendPaymentConfirmation;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id = null)
    {
        $payOrder = null;
        if ($id) {
            $payOrder = Order::withCount('item_orders')->with('item_orders', 'address_order')->where('user_id', auth()->user()->id)->where('status', 'waiting_payment')->find($id);
        }
        $orders = Order::withCount('item_orders')->with('item_orders', 'address_order', 'item_orders.product')->where('user_id', auth()->user()->id)->latest()->get();
        $orders->map(function ($order) {
            $order->format_created_at = Carbon::parse($order->created_at)->format('Y-m-d H:i');
            $order->address_order->origin = json_decode($order->address_order->origin);
            $order->address_order->destination = json_decode($order->address_order->destination);
            $order->item_orders->map(function ($item_order) {
                return $item_order->thumbnail = asset('storage/' . $item_order->product->thumbnail);
            });
        });
        return Inertia::render('HistoryOrder', [
            'orders' => $orders,
            'payOrder' => $payOrder
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::all();
        $products->map(function ($product) {
            $product->thumbnail = asset('storage/' . $product->thumbnail);
        });
        return Inertia::render('CreateOrder', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        DB::beginTransaction();
        try {
            $order = User::find(auth()->user()->id)->orders()->create([
                'total_price' => $request->totalPrice,
                'payment_expired_at' => now()->addDay(),
            ]);

            foreach ($request->products as $product) {
                $updateProduct = Product::find($product['id']);
                $updateProduct->quantity -= $product['quantity'];
                $updateProduct->save();
                $order->item_orders()->create([
                    'product_id' => $product['id'],
                    'quantity' => $product['quantity'],
                    'price' => $product['price'],
                    'total_price' => $product['price'] * $product['quantity']
                ]);
            }

            $order->address_order()->create([
                'name' => $request->dropPoint['name'],
                'phone_number' => $request->dropPoint['phone_number'],
                'address' => $request->dropPoint['address'],
                'origin' => json_encode($request->dropPoint['origin']),
                'destination' => json_encode($request->dropPoint['destination']),
                'fee_shipping' => $request->dropPoint['fee_shipping'],
                'duration' => $request->dropPoint['duration'],
            ]);
            DB::commit();
            return to_route('history.order', $order->id);
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }


    public function payment(PaymentOrderRequest $request, Order $order)
    {

        DB::beginTransaction();
        try {
            $file = $request->file('proof_of_payment');
            $path = $file->storeAs('public/proof_of_payment', md5(uniqid(rand(), true)) . "." . $file->getClientOriginalExtension());
            $order->proof_of_payment = $path;
            $order->pay_at = now();
            $order->status = 'waiting_confirmation_payment';
            $order->save();
            SendPaymentConfirmation::dispatch($order);
            DB::commit();
            return to_route('history.order');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("OrderController: " . $e->getMessage());
            return $e->getMessage();
        }
    }

    public function approvePayment(Order $order)
    {
        DB::beginTransaction();
        try {
            $order->status = OrderStatusEnum::ONPROGRESS;
            $order->save();
            DB::commit();
        } catch (Throwable $error) {
            DB::rollBack();
            return $error->getMessage();
        }
    }

    public function rejectPayment(Order $order)
    {
        DB::beginTransaction();
        try {
            $order->status = OrderStatusEnum::CANCELED;
            $order->save();
            DB::commit();
        } catch (Throwable $error) {
            DB::rollBack();
            return $error->getMessage();
        }
    }

    public function dropPoint(Order $order)
    {
        $order->origin = json_decode($order->address_order->origin);
        $order->destination = json_decode($order->address_order->destination);

        return Inertia::render('DropPointEmbed', [
            'dropPoint' => $order,
        ]);
    }

    public function delivery(Order $order)
    {
        DB::beginTransaction();
        try {
            $order->status = OrderStatusEnum::DELIVERY;
            $order->save();
            DB::commit();
        } catch (Throwable $error) {
            DB::rollBack();
            return $error->getMessage();
        }
    }

    public function complete(Order $order)
    {
        DB::beginTransaction();
        try {
            $order->status = OrderStatusEnum::DONE;
            $order->save();
            DB::commit();
        } catch (Throwable $error) {
            DB::rollBack();
            return $error->getMessage();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
