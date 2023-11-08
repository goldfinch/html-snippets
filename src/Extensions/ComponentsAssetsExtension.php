<?php

namespace Goldfinch\Components\Extensions;

use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

class ComponentsAssetsExtension extends Extension
{
    public function init()
    {
        Requirements::block('goldfinch/components: client/dist/component.css');
    }
}
