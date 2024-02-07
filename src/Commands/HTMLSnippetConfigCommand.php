<?php

namespace Goldfinch\HTMLSnippets\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;

#[AsCommand(name: 'vendor:html-snippets:config')]
class HTMLSnippetConfigCommand extends GeneratorCommand
{
    protected static $defaultName = 'vendor:html-snippets:config';

    protected $description = 'Create HTML snippets YML config';

    protected $path = 'app/_config';

    protected $type = 'config';

    protected $stub = './stubs/config.stub';

    protected $extension = '.yml';
}
