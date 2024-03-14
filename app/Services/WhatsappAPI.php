<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WhatsappAPI
{
    protected $version = "v19.0";
    protected $phone_number_id = 271955262661911;
    protected $template_name;
    protected $token;
    protected $baseUrl;
    protected $to;

    public function __construct()
    {
        $this->baseUrl = "https://graph.facebook.com/" . $this->version . "/" . $this->phone_number_id;
        $this->template_name = "hello-world";
        $this->token = env('META_GRAPH_API_ACCESS_TOKEN');
    }

    public function setToken($token)
    {
        $this->token = $token;
    }

    public function setTo($to)
    {
        $this->to = $to;
    }

    public function setTemplateName($templateName)
    {
        $this->template_name = $templateName;
    }

    public function sendMessage()
    {
        $this->baseUrl .= "/messages";
        $request = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->post($this->baseUrl, [
            "messaging_product" => "whatsapp",
            "to" => $this->to,
            "type" => "template",
            "template" => [
                "name" => $this->template_name,
                "language" => [
                    "code" => "en_US",
                ],
            ]
        ]);

        return $request->json();
    }
}
