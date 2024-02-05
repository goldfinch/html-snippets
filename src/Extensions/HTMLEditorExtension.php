<?php

namespace Goldfinch\HTMLComponents\Extensions;

use SilverStripe\Core\Extension;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Manifest\ModuleLoader;

class HTMLEditorExtension extends Extension
{
    public function onBeforeRenderHolder($field): void
    {
        $basedOnClass = $field
            ->getForm()
            ->getRecord()
            ->getClassName();

        $config = Config::inst()->get($basedOnClass);

        $field->setAttribute('data-based-on-class', $basedOnClass);

        if (isset($config['allowed_html_components'])) {
            $allowed_html_components = $config['allowed_html_components'];

            if (isset($allowed_html_components[$field->getName()])) {
                // ? $fieldComponents could be used for initial load (window1)
                $fieldComponents = $allowed_html_components[$field->getName()];

                $enabledPlugins = $field->getEditorConfig()->getPlugins();

                if (!array_key_exists('htmlcomponents', $enabledPlugins)) {
                    $goldfinch_components = ModuleLoader::inst()
                        ->getManifest()
                        ->getModule('goldfinch/html-components');

                    $cfg = $field->getEditorConfig();

                    $cfg->enablePlugins([
                        'htmlcomponents' => $goldfinch_components->getResource(
                            'client/dist/content-component.js',
                        ),
                    ]);
                    $cfg->addButtonsToLine(1, ['htmlcomponents']);
                }
            }
        }
    }
}
