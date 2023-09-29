<?php

namespace Goldfinch\Components\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;
use Goldfinch\Taz\Services\InputOutput;
use Symfony\Component\Console\Command\Command;

#[AsCommand(name: 'make:component-template')]
class MakeComponentTemplateCommand extends GeneratorCommand
{
    protected static $defaultName = 'make:component-template';

    protected $description = 'Create new component template';

    protected $path = 'themes/main/templates/Components';

    protected $type = 'componenttemplate';

    protected $stub = './stubs/componenttemplate.stub';

    protected $prefix = 'Component';

    protected function execute($input, $output): int
    {
        parent::execute($input, $output);

        return Command::SUCCESS;
    }
}
