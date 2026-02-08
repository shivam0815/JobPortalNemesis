<?php

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',

    'https://jobportalnemesis.onrender.com',
    ' https://nemesis-frontend-pearl.vercel.app/auth/register', 
    'https://www.nemesisgroup.in/'

],


    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    // IMPORTANT for Bearer-token Sanctum (NO cookies, NO CSRF)
    'supports_credentials' => false,

];
