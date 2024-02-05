<?php

namespace Goldfinch\HTMLComponents\Commands;

use Symfony\Component\Finder\Finder;
use Goldfinch\Taz\Services\InputOutput;
use Goldfinch\Taz\Console\GeneratorCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;

#[AsCommand(name: 'make:html-component')]
class MakeHTMLComponentCommand extends GeneratorCommand
{
    protected static $defaultName = 'make:html-component';

    protected $description = 'Create new HTML Component';

    protected $path = 'app/src/Components';

    protected $type = 'html-component';

    protected $stub = './stubs/html-component.stub';

    protected $prefix = 'Component';

    protected function execute($input, $output): int
    {
        parent::execute($input, $output);

        $io = new InputOutput($input, $output);

        $className = $io->question('Class name that will use this component (eg Page, App/Models/ProjectItem)', null, function ($answer) use ($io) {

            if (!is_string($answer) || $answer === null) {
                throw new \RuntimeException(
                    'Invalid name'
                );
            } else if (strlen($answer) < 2) {
                throw new \RuntimeException(
                    'Too short name'
                );
            } else if(!preg_match('/^([A-z0-9\_]+)$/', $answer)) {
                throw new \RuntimeException(
                    'Name can contains letter, numbers and underscore'
                );
            }

            return $answer;
        });

        $fieldName = $io->question('Field name (HTMLText) that will use this component (eg Content, Text)', null, function ($answer) use ($io) {

            if (!is_string($answer) || $answer === null) {
                throw new \RuntimeException(
                    'Invalid name'
                );
            } else if (strlen($answer) < 2) {
                throw new \RuntimeException(
                    'Too short name'
                );
            } else if(!preg_match('/^([A-z0-9\_]+)$/', $answer)) {
                throw new \RuntimeException(
                    'Name can contains letter, numbers and underscore'
                );
            }

            return $answer;
        });

        $namespaceClass = '{{namespace_class}}';
        $this->buildStr($namespaceClass, $input->getArgument('name'));

        $nameInput = $this->getAttrName($input);

        $command = $this->getApplication()->find(
            'make:html-component-template',
        );

        $arguments = [
            'name' => $nameInput,
        ];

        $greetInput = new ArrayInput($arguments);
        $returnCode = $command->run($greetInput, $output);

        // config

        if (!$this->setComponentInConfig($className, $fieldName, $namespaceClass)) {
            // create config

            $command = $this->getApplication()->find('vendor:html-components:config');

            $arguments = [
                'name' => 'html-components',
            ];

            $greetInput = new ArrayInput($arguments);
            $returnCode = $command->run($greetInput, $output);

            $this->setComponentInConfig($className, $fieldName, $namespaceClass);
        }

        return Command::SUCCESS;
    }

    private function setComponentInConfig($className, $fieldName, $componentName)
    {
        $rewritten = false;

        $htmlModelLine = 'Goldfinch\HTMLComponents\Models\HTMLComponent:';

        $finder = new Finder();
        $files = $finder->in(BASE_PATH . '/app/_config')->files()->contains([$htmlModelLine, 'html_component_model']);

        foreach ($files as $file) {

            // stop after first replacement
            if ($rewritten) {
                break;
            }

            $newContent = $this->updateYmal(
                $file->getContents(),
                [$className, 'allowed_html_components', $fieldName],
                $componentName
            );

            file_put_contents($file->getPathname(), $newContent);

            $rewritten = true;


            // if (strpos($file->getContents(), $className . ':') !== false) {

            //     if (strpos($file->getContents(), 'allowed_html_components:') !== false) {

            //         $classSubLines = $className . ':' . PHP_EOL . '  allowed_html_components:' . PHP_EOL;

            //         // $newContent = str_replace(
            //         //     $classSubLines,
            //         //     $classSubLines . '    '.$fieldName.':'.PHP_EOL.'      - '. $componentName . PHP_EOL,
            //         //     $file->getContents()
            //         // );

            //         $newContent = $this->replaceMultiLines(
            //             $file->getPathname(),
            //             [
            //                 $className . ':',
            //                 'allowed_html_components:',
            //                 $fieldName,
            //             ],
            //             $classSubLines . '    '.$fieldName.':'.PHP_EOL.'      - '. $componentName . PHP_EOL,
            //         );

            //         file_put_contents($file->getPathname(), $newContent);

            //         $rewritten = true;

            //     } else {
            //         // add new field to existed class
            //     }
            // } else {
            //     // add class
            //     $newContent = $this->addToLine(
            //         $file->getPathname(),
            //         $htmlModelLine, $htmlModelLine . PHP_EOL . '    '.$className.':'.PHP_EOL.'      '.$fieldName.':'.PHP_EOL.'      - '. $componentName . PHP_EOL . PHP_EOL,
            //     );

            //     file_put_contents($file->getPathname(), $newContent);

            //     $rewritten = true;
            // }
        }

        return $rewritten;
    }
}
