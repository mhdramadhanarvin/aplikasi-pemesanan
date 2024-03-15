<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function index(Request $request)
    {
        Log::debug(json_encode($request->all()));
        return response($request->hub_challenge, 200)
            ->header('Content-Type', 'text/plain');
    }
}
