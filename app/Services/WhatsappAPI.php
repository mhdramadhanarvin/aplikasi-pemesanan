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
    protected $templateComponent;

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

    public function setTemplateComponent($headerImage, $name, $phoneNumber, $address, $totalItem, $totalPrice)
    {
        $this->templateComponent = [
            "messaging_product" => "whatsapp",
            "recipient_type" => "individual",
            "to" => $this->to,
            "type" => "template",
            "template" => [
                "name" => $this->template_name,
                "language" => [
                    "code" => "id"
                ],
                "components" => [
                    [
                        "type" => "header",
                        "parameters" => [
                            [
                                "type" => "image",
                                "image" => [
                                    "link" => $headerImage
                                ]
                            ]
                        ]
                    ],
                    [
                        "type" => "body",
                        "parameters" => [
                            [
                                "type" => "text",
                                "text" => $name
                            ],
                            [
                                "type" => "text",
                                "text" => $phoneNumber
                            ],
                            [
                                "type" => "text",
                                "text" => $address
                            ],
                            [
                                "type" => "text",
                                "text" => $totalItem
                            ],
                            [
                                "type" => "text",
                                "text" => $totalPrice
                            ]
                        ]
                    ]
                ]
            ]
        ];
    }

    public function sendMessage()
    {
        $this->baseUrl .= "/messages";
        $request = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->post($this->baseUrl, $this->templateComponent);

        return $request->json();
    }
}
