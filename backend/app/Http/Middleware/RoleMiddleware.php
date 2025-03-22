<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle($request, Closure $next, $role)
    {
        // Check if the user is authenticated and if the user type matches
        if (!$request->user() || $request->user()->type !== $role) {
            return response()->json(['message' => 'Access denied.'], Response::HTTP_FORBIDDEN);
        }
        return $next($request);
    }
}