<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AddressOrder extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'name', 'phone_number', 'address', 'origin', 'destination', 'fee_shipping', 'duration'];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
