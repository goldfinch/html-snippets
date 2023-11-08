<?php

namespace Goldfinch\HTMLComponents\Commands;

use Goldfinch\Taz\Console\GeneratorCommand;
use Goldfinch\Taz\Services\InputOutput;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;

#[AsCommand(name: 'make:html-component')]
class MakeHTMLComponentCommand extends GeneratorCommand
{
    protected static $defaultName = 'make:html-component';

    protected $description = 'Create new HTML Component';

    protected $path = 'app/src/HTMLComponents';

    protected $type = 'html-component';

    protected $stub = './stubs/html-component.stub';

    protected $prefix = 'HTMLComponent';

    protected function execute($input, $output): int
    {
        parent::execute($input, $output);

        $nameInput = $this->getAttrName($input);

        // Nest template

        $command = $this->getApplication()->find('make:html-component-template');

        $arguments = [
            'name' => $nameInput,
        ];

        $greetInput = new ArrayInput($arguments);
        $returnCode = $command->run($greetInput, $output);

        return Command::SUCCESS;
    }
}
