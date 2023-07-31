<?php

namespace Goldfinch\Components\Extensions;

use SilverStripe\Core\Extension;
use SilverStripe\Core\Manifest\ModuleLoader;

class HTMLEditorExtension extends Extension
{
    public function onBeforeRenderHolder($field): void
    {
        $config = $this->owner->config();

        $basedOnClass = $field->getForm()->getRecord()->getClassName();

        $field->setAttribute('data-based-on-class', $basedOnClass);

        $allowed_components = $config->get('allowed_components');

        if (isset($allowed_components[$basedOnClass]))
        {
            $components = $allowed_components[$basedOnClass];

            if (isset($components[$field->getName()]))
            {
                $fieldComponents = $components[$field->getName()];

                $enabledPlugins = $field->getEditorConfig()->getPlugins();

                if (!array_key_exists('contentcomponent', $enabledPlugins))
                {
                    $goldfinch_components = ModuleLoader::inst()->getManifest()->getModule('goldfinch/components');

                    $cfg = $field->getEditorConfig();

                    $cfg->enablePlugins(['contentcomponent' => $goldfinch_components->getResource('client/dist/content-component.js')]);
                    $cfg->addButtonsToLine(1, ['contentcomponent']);
                }
            }
        }
    }
}

