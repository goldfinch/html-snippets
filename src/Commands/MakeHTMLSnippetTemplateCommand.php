<?php

namespace Goldfinch\HTMLSnippets\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;

#[AsCommand(name: 'make:html-snippet-template')]
class MakeHTMLSnippetTemplateCommand extends GeneratorCommand
{
    protected static $defaultName = 'make:html-snippet-template';

    protected $description = 'Create new HTML Snippet template';

    protected $path = 'themes/[theme]/templates/Components/HTML';

    protected $type = 'html-snippet-template';

    protected $stub = './stubs/html-snippet-template.stub';

    protected $prefix = 'Component';

    protected $extension = '.ss';
}
