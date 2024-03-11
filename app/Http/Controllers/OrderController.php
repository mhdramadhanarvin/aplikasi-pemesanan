<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
// use App\Models\Order;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('HistoryOrder');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('CreateOrder', [
            'products' => Product::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        // dd($request->all());
        DB::beginTransaction();
        try {
            $order = User::find(auth()->user()->id)->orders()->create([
                'total_price' => $request->totalPrice,
                'payment_expired_at' => now()->addHour(),
            ]);

            foreach ($request->products as $product) {
                $updateProduct = Product::find($product['id']);
                $updateProduct->quantity -= $product['quantity'];
                $updateProduct->save();
                $order->item_order()->create([
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
                'origin' => json_encode($request->dropPoint['origin'][0], $request->dropPoint['origin'][1]),
                'destination' => json_encode($request->dropPoint['destination'][0], $request->dropPoint['destination'][1]),
                'fee_shipping' => $request->dropPoint['fee_shipping'],
            ]);
            DB::commit();
            return to_route('history.order');
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
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
