<?php

namespace Goldfinch\HTMLSnippets\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;
use Symfony\Component\Console\Command\Command;

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

    protected function execute($input, $output): int
    {
        parent::execute($input, $output);

        return Command::SUCCESS;
    }
}
