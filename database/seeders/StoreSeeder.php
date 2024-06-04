<?php

namespace Database\Seeders;

// use Database\Factories\ProductFactory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Store;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Store::create([
            "open_hour" => "09:00",
            "close_hour" => "22:00",
            "is_open" => true
        ]);
    }
}
