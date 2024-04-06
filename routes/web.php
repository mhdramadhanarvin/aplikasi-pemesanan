<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect()->route('login');
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/create-order', [OrderController::class, 'create'])->name('order.create');
    Route::post('/create-order', [OrderController::class, 'store'])->name('order.post');

    Route::get('/history-order/{id?}', [OrderController::class, 'index'])->name('history.order');
    Route::post('/payment-order/{order}', [OrderController::class, 'payment'])->name('order.payment');
});

Route::get('/droppoint/{order}', [OrderController::class, 'dropPoint'])->name('order.droppoint');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
