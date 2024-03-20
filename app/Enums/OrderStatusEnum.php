<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum OrderStatusEnum: string implements HasColor, HasLabel
{
    case WAITING_PAYMENT = "waiting_payment";
    case WAITING_CONFIRMATION_PAYMENT = "waiting_confirmation_payment";
    case ONPROGRESS = "on_progress";
    case DELIVERY = "delivery";
    case DONE = "done";
    case CANCELED = "canceled";
    case EXPIRED = "expired";

    public function getLabel(): ?string
    {
        return match ($this) {
            self::WAITING_PAYMENT => 'Menunggu Pembayaran',
            self::WAITING_CONFIRMATION_PAYMENT => 'Menuggu Konfirmasi Pembayaran',
            self::ONPROGRESS => 'Sedang Diproses',
            self::DELIVERY => 'Dalam Pengiriman',
            self::DONE => 'Selesai',
            self::CANCELED => 'Dibatalkan',
            self::EXPIRED => 'Kadaluarsa',
        };
    }

    public function getColor(): string | array | null
    {
        return match ($this) {

            self::WAITING_PAYMENT => 'warning',
            self::WAITING_CONFIRMATION_PAYMENT => 'warning',
            self::ONPROGRESS => 'primary',
            self::DELIVERY => 'success',
            self::DONE => 'gray',
            self::CANCELED => 'danger',
            self::EXPIRED => 'danger',
        };
    }
}
