<?php

namespace Database\Seeders;

// use Database\Factories\ProductFactory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::factory()->count(1)->create([
            'item_name' => 'Bakso',
            'price' => 1000
        ]);
        Product::factory()->count(1)->create([
            'item_name' => 'Ceker',
            'price' => 2000
        ]);
        Product::factory()->count(1)->create([
            'item_name' => 'Sosis',
            'price' => 1000
        ]);
        Product::factory()->count(1)->create([
            'item_name' => 'Hati',
            'price' => 1000
        ]);
        Product::factory()->count(1)->create([
            'item_name' => 'Tahu',
            'price' => 1000
        ]);
    }
}
