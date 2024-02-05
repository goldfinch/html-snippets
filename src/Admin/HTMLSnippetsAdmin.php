<?php

namespace Goldfinch\HTMLSnippets\Admin;

use SilverStripe\Admin\ModelAdmin;
use JonoM\SomeConfig\SomeConfigAdmin;
use Goldfinch\HTMLSnippets\Models\HTMLSnippet;
use Goldfinch\HTMLSnippets\Configs\HTMLSnippetConfig;

class HTMLSnippetsAdmin extends ModelAdmin
{
    use SomeConfigAdmin;

    private static $url_segment = 'html-snippets';
    private static $menu_title = 'HTML Snippets';
    private static $menu_icon_class = 'goldfinch-component-icon';
    // private static $menu_priority = -0.5;

    private static $managed_models = [
        HTMLSnippet::class => [
            'title' => 'Segments',
        ],
        HTMLSnippetConfig::class => [
            'title' => 'Settings',
        ],
    ];

    public function getManagedModels()
    {
        $models = parent::getManagedModels();

        $cfg = HTMLSnippetConfig::current_config();

        if (empty($cfg->config('db')->db)) {
            unset($models[HTMLSnippetConfig::class]);
        }

        return $models;
    }
}
