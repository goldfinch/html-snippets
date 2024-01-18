<?php

namespace Goldfinch\HTMLComponents\Config;

use JonoM\SomeConfig\SomeConfig;
use SilverStripe\ORM\DataObject;
use SilverStripe\View\TemplateGlobalProvider;

class HTMLComponentConfig extends DataObject implements TemplateGlobalProvider
{
    use SomeConfig;

    private static $table_name = 'HTMLComponentConfig';

    private static $db = [];
}
