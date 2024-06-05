<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StoreResource\Pages;
// use App\Filament\Resources\StoreResource\RelationManagers;
use App\Models\Store;
// use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
// use Illuminate\Database\Eloquent\Builder;
// use Illuminate\Database\Eloquent\SoftDeletingScope;

class StoreResource extends Resource
{
    protected static ?string $model = Store::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function getPluralLabel(): string
    {
        return __('Pengaturan Toko');
    }

    public static function getModelLabel(): string
    {
        return __('Pengaturan Toko');
    }
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TimePicker::make('open_hour')
                    ->label("Jam Buka")
                    ->format('H:i')
                    ->closeOnDateSelection()
                    ->required(),
                TimePicker::make('close_hour')
                    ->label("Jam Tutup")
                    ->format('H:i')
                    ->closeOnDateSelection()
                    ->required(),
                DateTimePicker::make('temporary_close_until')
                    ->label("Tutup Sementara Sampai")
                    ->closeOnDateSelection()
                    ->timezone("Asia/Jakarta")
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (Set $set) {
                        $set('is_open', false);
                    }),
                Toggle::make('is_open')
                    ->label("Buka Toko")
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (Set $set, $state) {
                        if ($state == true) $set('temporary_close_until', null);
                    })
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('open_hour')->label('Jam Buka Toko'),
                TextColumn::make('close_hour')->label('Jam Tutup Toko'),
                TextColumn::make('temporary_close_until')
                    ->label('Tutup Sementara Hingga'),
                ToggleColumn::make('is_open')->label('Buka Toko')->disabled(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                // Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                // Tables\Actions\BulkActionGroup::make([
                //     Tables\Actions\DeleteBulkAction::make(),
                // ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageStores::route('/'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }
}
