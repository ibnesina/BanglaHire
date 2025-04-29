@extends('layouts.app')
@section('title', 'Add Balance')

@section('content')
{{-- Quick inline styles for this page --}}
<style>
  .card-wrapper {
    max-width: 480px;
    margin: 2rem auto;
  }
  .card-wrapper h2 {
    color: #4f46e5;
  }
  .btn-payment-method .btn-check:checked + .btn-outline-primary {
    background-color: #4f46e5;
    color: #fff;
  }
  .btn-grad {
    background: linear-gradient(90deg, #4f46e5, #3b82f6);
    border: none;
    color: #fff;
  }
  .btn-grad:hover {
    opacity: .9;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
</style>

<div class="card-wrapper card shadow-sm p-4">
  <h2 class="mb-4 text-center">Add Balance</h2>

  @if(session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
  @endif
  @if(session('error'))
    <div class="alert alert-danger">{{ session('error') }}</div>
  @endif

  <form action="{{ route('balance.process') }}" method="POST">
    @csrf
    <input type="hidden" name="user_id" value="{{ $user_id }}"/>

    <!-- Amount -->
    <div class="mb-4">
      <label for="amount" class="form-label">Amount (BDT)</label>
      <div class="input-group">
        <span class="input-group-text">BDT</span>
        <input
          type="number" name="amount" id="amount"
          class="form-control @error('amount') is-invalid @enderror"
          min="1" step="0.01" value="{{ old('amount') }}" required
        />
        @error('amount')
          <div class="invalid-feedback">{{ $message }}</div>
        @enderror
      </div>
    </div>

    <!-- Payment Method -->
    <div class="mb-4">
      <span class="form-label d-block mb-2">Payment Method</span>
      <fieldset class="btn-group btn-payment-method d-flex">
        <legend class="visually-hidden">Select Payment Method</legend>

        <input
          type="radio" class="btn-check" name="payment_method" id="ssl"
          value="sslcommerz" autocomplete="off" checked
        >
        <label class="btn btn-outline-primary flex-fill" for="ssl">
          SSLCOMMERZ
        </label>

        <input
          type="radio" class="btn-check" name="payment_method" id="stripe"
          value="stripe" autocomplete="off"
        >
        <label class="btn btn-outline-primary flex-fill" for="stripe">
          Stripe
        </label>
      </fieldset>
      @error('payment_method')
        <div class="text-danger mt-1">{{ $message }}</div>
      @enderror
    </div>

    <button type="submit" class="btn btn-grad w-100 py-2">
      Continue to Payment
    </button>
  </form>
</div>
@endsection
