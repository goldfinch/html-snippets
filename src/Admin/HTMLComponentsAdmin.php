<?php

namespace Goldfinch\HTMLComponents\Admin;

use SilverStripe\Admin\ModelAdmin;
use SilverStripe\Forms\GridField\GridFieldConfig;
use Goldfinch\HTMLComponents\Models\HTMLComponent;
use Goldfinch\HTMLComponents\Config\HTMLComponentConfig;

class HTMLComponentsAdmin extends ModelAdmin
{
    private static $url_segment = 'html-components';
    private static $menu_title = 'HTML Components';
    private static $menu_icon_class = 'goldfinch-component-icon';
    // private static $menu_priority = -0.5;

    private static $managed_models = [
        HTMLComponent::class => [
            'title'=> 'Segments',
        ],
        HTMLComponentConfig::class => [
            'title'=> 'Settings',
        ],
    ];

    // public $showImportForm = true;
    // public $showSearchForm = true;
    // private static $page_length = 30;

    public function getList()
    {
        $list = parent::getList();

        // ..

        return $list;
    }

    protected function getGridFieldConfig(): GridFieldConfig
    {
        $config = parent::getGridFieldConfig();

        // ..

        return $config;
    }

    public function getSearchContext()
    {
        $context = parent::getSearchContext();

        // ..

        return $context;
    }

    public function getEditForm($id = null, $fields = null)
    {
        $form = parent::getEditForm($id, $fields);

        // ..

        return $form;
    }

    // public function getExportFields()
    // {
    //     return [
    //         // 'Name' => 'Name',
    //         // 'Category.Title' => 'Category'
    //     ];
    // }
}
