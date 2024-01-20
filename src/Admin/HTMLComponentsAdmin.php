<?php

namespace Goldfinch\HTMLComponents\Admin;

use SilverStripe\Admin\ModelAdmin;
use JonoM\SomeConfig\SomeConfigAdmin;
use Goldfinch\HTMLComponents\Models\HTMLComponent;
use Goldfinch\HTMLComponents\Configs\HTMLComponentConfig;

class HTMLComponentsAdmin extends ModelAdmin
{
    use SomeConfigAdmin;

    private static $url_segment = 'html-components';
    private static $menu_title = 'HTML Components';
    private static $menu_icon_class = 'goldfinch-component-icon';
    // private static $menu_priority = -0.5;

    private static $managed_models = [
        HTMLComponent::class => [
            'title' => 'Segments',
        ],
        HTMLComponentConfig::class => [
            'title' => 'Settings',
        ],
    ];

    public function getManagedModels()
    {
        $models = parent::getManagedModels();

        $cfg = HTMLComponentConfig::current_config();

        if (empty($cfg->config('db')->db)) {
            unset($models[HTMLComponentConfig::class]);
        }

        return $models;
    }
}
