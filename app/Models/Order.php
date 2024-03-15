<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ["user_id", "total_price", "pay_at", "proof_of_payment", "status", "payment_expired_at"];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function address_order(): HasOne
    {
        return $this->hasOne(AddressOrder::class);
    }

    public function item_orders(): HasMany
    {
        return $this->hasMany(ItemOrder::class);
    }

    public function whatsapp_api_logs(): HasMany
    {
        return $this->hasMany(WhatsappApiLog::class);
    }
}
