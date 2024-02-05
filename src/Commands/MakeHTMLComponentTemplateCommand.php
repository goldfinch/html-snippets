<?php

namespace Goldfinch\HTMLComponents\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;
use Symfony\Component\Console\Command\Command;

#[AsCommand(name: 'make:html-component-template')]
class MakeHTMLComponentTemplateCommand extends GeneratorCommand
{
    protected static $defaultName = 'make:html-component-template';

    protected $description = 'Create new HTML Component template';

    protected $path = 'themes/[theme]/templates/Components/HTML';

    protected $type = 'html-component-template';

    protected $stub = './stubs/html-component-template.stub';

    protected $prefix = 'Component';

    protected $extension = '.ss';

    protected function execute($input, $output): int
    {
        parent::execute($input, $output);

        return Command::SUCCESS;
    }
}
