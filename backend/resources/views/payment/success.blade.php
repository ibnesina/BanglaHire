@extends('layouts.app')
@section('title','Payment Successful')

@section('content')
{{-- Page‑specific styles --}}
<style>
  .card-wrapper {
    max-width: 480px;
    margin: 4rem auto;
  }
  .card-wrapper .success-icon {
    font-size: 3rem;
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
    background: #10b981;
    color: #fff;
    margin: 0 auto 1rem;
  }
  .btn-grad {
    background: linear-gradient(90deg, #4f46e5, #3b82f6);
    border: none;
    color: #fff;
  }
  .btn-grad:hover {
    opacity: .9;
  }
</style>

<div class="card-wrapper card shadow-sm p-4 text-center">
  <div class="success-icon mb-3">✓</div>
  <h1 class="h3 text-success mb-2">🎉 Payment Successful!</h1>
  <p class="lead mb-4">
    You’ve topped up <strong>{{ $currency }} {{ number_format($amount, 2) }}</strong>
  </p>
  <a href="{{ config('app.frontend_url') }}"
     class="btn btn-grad btn-lg px-4">
    Go to Dashboard
  </a>
</div>
@endsection
