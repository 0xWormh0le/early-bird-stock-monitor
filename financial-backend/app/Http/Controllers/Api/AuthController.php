<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\Controller;
use App\User;
use App\Http\Resources\User as UserResource;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('name', 'email', 'password');

        $validator = Validator::make($request->all(), [
            'email' => ['required'],
            'password' => ['required']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid request',
                'errors' => $validator->errors()
            ], 400);
        }

        if (!auth()->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credential'
            ], 401);
        }

        $user = auth()->user();
        $user->tokens()->delete();
        $token = $user->createToken($user->email);

        return response()->json([
            'message' => 'Login success',
            'token' => $token->plainTextToken,
            'profile' => new UserResource($user)
        ]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required'],
            'email' => ['required', 'unique:users'],
            'password' => ['required']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid request',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->password = Hash::make($request->input('password'));
        $user->save();

        $user->tokens()->delete();
        $token = $user->createToken($user->email);
        
        return response()->json([
            'message' => 'Signup success',
            'token' => $token->plainTextToken,
            'profile' => new UserResource($user)
        ]);
    }

    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'message' => 'Logout success'
        ]);
    }
}
