<?php

namespace Goldfinch\Components\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;
use Goldfinch\Taz\Services\InputOutput;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;

#[AsCommand(name: 'make:component')]
class MakeComponentCommand extends GeneratorCommand
{
    protected static $defaultName = 'make:component';

    protected $description = 'Create new component';

    protected $path = 'app/src/Components';

    protected $type = 'component';

    protected $stub = './stubs/component.stub';

    protected $prefix = 'Component';

    protected function execute($input, $output): int
    {
        parent::execute($input, $output);

        $nameInput = $this->getAttrName($input);

        // Nest template

        $command = $this->getApplication()->find('make:component-template');

        $arguments = [
            'name' => $nameInput,
        ];

        $greetInput = new ArrayInput($arguments);
        $returnCode = $command->run($greetInput, $output);

        return Command::SUCCESS;
    }
}
