<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app'     => config('app.name'),
        'status'  => 'running',
        'api'     => url('/api'),
        'version' => '1.0.0',
    ]);
});
