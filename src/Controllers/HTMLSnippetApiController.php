<?php

namespace Goldfinch\HTMLSnippets\Controllers;

use Illuminate\Support\Str;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Config;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Security\SecurityToken;

class HTMLSnippetApiController extends Controller
{
    private static $url_handlers = [
        'POST types' => 'types',
        'POST objects' => 'objects',
    ];

    private static $allowed_actions = ['types', 'objects'];

    public function objects(HTTPRequest $request)
    {
        $this->authorized($request);

        // validation

        $data = $request->postVars();

        if ($components = $this->getComponents($data)) {
            if (in_array($data['component'], $components)) {
                $records = $data['component']::get();

                $list = [['text' => '-', 'value' => '']];

                foreach ($records as $record) {
                    if (!$record->Component_Visibility) {
                        continue;
                    }

                    $list[] = [
                        'text' => $record->Component_Name,
                        'value' => strval($record->ID),
                    ];
                }

                return json_encode($list);
            }
        }

        return $this->httpError(401, 'Unauthorized');
    }

    public function types(HTTPRequest $request)
    {
        $this->authorized($request);

        // validation

        $data = $request->postVars();

        if ($components = $this->getComponents($data)) {
            $list = [['text' => '-', 'value' => '']];

            foreach ($components as $component) {
                $list[] = [
                    'text' => Str::of(class_basename($component))->headline(),
                    'value' => $component,
                ];
            }

            return json_encode($list);
        }

        return $this->httpError(401, 'Unauthorized');
    }

    protected function getComponents($data)
    {
        $cfg = Config::inst()->get($data['class']);

        if (isset($cfg['allowed_html_snippets'])) {
            $allowed_html_snippets = $cfg['allowed_html_snippets'];

            if (isset($allowed_html_snippets[$data['name']])) {
                $components = $allowed_html_snippets[$data['name']];

                if (count($components)) {
                    return $components;
                } else {
                    // return all components that exist?
                }
            }
        }

        return false;
    }

    protected function authorized(HTTPRequest $request)
    {
        if (!$request->isPOST()) {
            return $this->httpError(403, 'This action is unauthorized');
        } elseif (
            $request->getHeader('X-CSRF-TOKEN') !=
            SecurityToken::getSecurityID()
        ) {
            return $this->httpError(401, 'Unauthorized');
        }
    }
}
