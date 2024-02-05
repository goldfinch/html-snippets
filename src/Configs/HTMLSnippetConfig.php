<?php

namespace Goldfinch\HTMLSnippets\Configs;

use JonoM\SomeConfig\SomeConfig;
use SilverStripe\ORM\DataObject;
use SilverStripe\View\TemplateGlobalProvider;

class HTMLSnippetConfig extends DataObject implements TemplateGlobalProvider
{
    use SomeConfig;

    private static $table_name = 'HTMLSnippetConfig';

    private static $db = [];
}
