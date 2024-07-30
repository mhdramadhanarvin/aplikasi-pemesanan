<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatusEnum;
use App\Filament\Resources\OrderResource\Pages;
use App\Http\Controllers\OrderController;
use App\Models\Order;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Form;
use Filament\Infolists\Components\Actions;
use Filament\Infolists\Components\Actions\Action as ActionInfolist;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\ViewEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')->label('Tanggal Pemesanan')->dateTime("d M Y H:i"),
                TextColumn::make('address_order.name')->label('Nama Pemesanan'),
                TextColumn::make('item_orders_count')->label('Jumlah Pesanan')->counts('item_orders')->suffix(" Item"),
                TextColumn::make('total_price')->label('Total Harga')
                    ->money('IDR', locale: 'id'),
                TextColumn::make('status')->badge(),
            ])
            ->filters([
                Filter::make('created_at')
                    ->form([
                        DatePicker::make('created_from')->label('Tanggal Awal'),
                        DatePicker::make('created_until')->label('Tanggal Akhir'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
                SelectFilter::make('status')
                    ->options(OrderStatusEnum::class)
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                // Tables\Actions\EditAction::make(),
                // Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                // Tables\Actions\BulkActionGroup::make([
                //     Tables\Actions\DeleteBulkAction::make(),
                // ]),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->columns(1)
            ->schema([
                Grid::make()->columns(2)->schema([
                    TextEntry::make('status')->badge(),
                ]),
                Grid::make()->columns(2)->schema([
                    TextEntry::make('address_order.name')->label('Nama Pemesan'),
                    TextEntry::make('address_order.phone_number')->label('Nomor Whatsapp Pemesan'),
                    TextEntry::make('address_order.address')->label('Alamat Pengantaran'),
                    TextEntry::make('address_order.fee_shipping')->label('Biaya Pengiriman')->money('IDR', locale: 'id'),
                    ViewEntry::make('proof_of_payment')
                        ->label('Bukti Pembayaran')
                        ->view('filament.infolists.entries.proof_of_payment')
                ]),
                RepeatableEntry::make('item_orders')->label('Produk')
                    ->columns(4)
                    ->schema([
                        ImageEntry::make('product.thumbnail')->label('')->height(50)->width(50),
                        TextEntry::make('product.item_name')->label(''),
                        TextEntry::make('price')->label('')->money('IDR', locale: 'id'),
                        TextEntry::make('quantity')->label('')->prefix('x '),
                    ]),
                Grid::make()->label('Ringkasan Pembayaran')->columns(1)->schema([
                    TextEntry::make('')->label('Harga')
                        ->state(function (Order $record): float {
                            return $record->total_price - $record->address_order->fee_shipping;
                        })->money('IDR', locale: 'id'),
                    TextEntry::make('address_order.fee_shipping')->label('Biaya Pengiriman')->money('IDR', locale: 'id'),
                    TextEntry::make('total_price')->label('Total Pembayaran')->money('IDR', locale: 'id')->weight(FontWeight::Bold),
                ]),
                Actions::make([
                    ActionInfolist::make('approve')->label('Konfirmasi Pembayaran')
                        ->icon('heroicon-c-check')
                        ->color('success')
                        ->visible(fn($record) => $record->status == OrderStatusEnum::WAITING_CONFIRMATION_PAYMENT)
                        ->action(fn(Order $record) => (new OrderController)->approvePayment($record))
                        ->requiresConfirmation(),
                    ActionInfolist::make('reject')->label("Tolak Pembayaran")
                        ->icon('heroicon-c-x-mark')
                        ->color('danger')
                        ->visible(fn($record) => $record->status == OrderStatusEnum::WAITING_CONFIRMATION_PAYMENT)
                        ->action(fn(Order $record) => (new OrderController)->rejectPayment($record))
                        ->requiresConfirmation(),
                    ActionInfolist::make('droppoint')
                        ->label('Lihat Titik Pengantaran')
                        ->url(fn($record) => route('order.droppoint', ['order' => $record]))
                        ->openUrlInNewTab(true),
                    ActionInfolist::make('delivery')
                        ->label('Antar Pesanan')
                        ->icon('gmdi-delivery-dining-o')
                        ->color('success')
                        ->visible(fn($record) => $record->status == OrderStatusEnum::ONPROGRESS)
                        ->action(fn(Order $record) => (new OrderController)->delivery($record))
                        ->requiresConfirmation(),
                    ActionInfolist::make('done')
                        ->label('Selesaikan Pesanan')
                        ->icon('heroicon-o-check-badge')
                        ->color('success')
                        ->visible(fn($record) => $record->status == OrderStatusEnum::DELIVERY)
                        ->action(fn(Order $record) => (new OrderController)->complete($record))
                        ->requiresConfirmation(),
                ])->fullWidth(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'view' => Pages\ViewOrder::route('/{record}'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
