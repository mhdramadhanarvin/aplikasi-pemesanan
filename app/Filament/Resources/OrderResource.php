<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Support\Enums\Alignment;
use Filament\Support\Enums\FontWeight;
use Filament\Support\RawJs;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

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
                TextColumn::make('created_at')->label('Tanggal Pemesanan'),
                TextColumn::make('item_orders_count')->label('Jumlah Pesanan')->counts('item_orders')->suffix(" Item"),
                TextColumn::make('total_price')->label('Total Harga')
                    ->money('IDR', locale: 'id'),
                TextColumn::make('status')->badge(),
            ])
            ->filters([
                //
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
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageOrders::route('/'),
        ];
    }
}
