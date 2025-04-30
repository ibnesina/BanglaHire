<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWithdrawRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
         // Only allow if balance > 1000
         return $this->user()->balance >= 1;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount'           => 'required|numeric|min:0.01|max:'.$this->user()->balance,
            'gateway'          => 'required|in:stripe,sslcommerz,bkash',
            'payment_details'  => 'required|array',
            // e.g. if bKash: ['account_no' => 'string']
        ];
    }
}
