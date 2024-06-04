<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'item_name' => fake()->name(),
            // 'thumbnail' => fake()->image(null, 360, 360, 'animals', true, true, 'cats', true, 'jpg'),
            'thumbnail' => '',
            'price' => fake()->randomNumber(5, true),
            'quantity' => fake()->randomDigitNot(0)
        ];
    }
}
