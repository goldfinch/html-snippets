<?php

namespace Goldfinch\HTMLSnippets\Models;

use Illuminate\Support\Str;
use SilverStripe\ORM\DataObject;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DropdownField;

class HTMLSnippet extends DataObject
{
    private static $table_name = 'HTMLSnippet';
    private static $singular_name = 'HTML Snippet';
    private static $plural_name = 'HTML Snippets';

    private static $db = [
        'Component_Name' => 'Varchar',
        'Component_Visibility' => 'Boolean',
    ];

    private static $summary_fields = [
        'Component_Name' => 'Component',
        'ComponentType' => 'Type',
    ];

    private static $defaults = [
        'Component_Visibility' => 1,
    ];

    private static $belongs_to = [
        'Component' => HTMLSnippet::class . '.Component',
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields()->initFielder($this);

        $fielder = $fields->getFielder();

        $fielder->required(['Component_Name']);

        $fielder->toTab('Root.Settings', [
            $fielder->string('Component_Name', 'Component name'),
            $fielder->checkbox('Component_Visibility', 'Visibility')
        ]);

        // $fields->removeByName('Root_Main');

        // $fields->removeByName([
        //   'Root_Main'
        // ]);
        // $fields->addFieldsToTab(
        //   'Root.Main',
        //     $main->getChildren()
        // );

        if (!$this->ID) {
            $fielder->remove('Main');

            $fielder->required('ClassName');

            $classes = ClassInfo::getValidSubClasses($this->ClassName);
            $list = array_fill_keys($classes, '');

            foreach ($classes as $class) {
                $list[$class] = Str::of(class_basename($class))->headline();
            }

            unset($list[$this->ClassName]);

            if (empty($list)) {
                $fielder->addError('You need to create and register snippet first, please run <strong>php taz make:html-snippet</strong>', 'warning');
            } else {
                $fielder->insertAfter(
                    'Component_Name', $fielder->dropdown('ClassName', 'Component type', array_reverse($list))
                );
            }
        }

        if ($this->ID) {
            // $componentFields = $this->ComponentOf()->getCMSFields()->setValues($this->ComponentOf()->toMap());

            // foreach ($componentFields->fieldByName('Root')->Tabs()->reverse() as $tab)
            // {
            //     if ($tab->getName() != 'Components')
            //     {
            //         $fields->fieldByName('Root')->unshift($tab);
            //         // $fields->push($tab);
            //     }
            // }
        }
        // $fields->fieldByName('Root')->push();

        // dd($componentFields->fieldByName('Root')->Tabs());
        // dd($fields->fieldByName('Root')->Tabs());
        // dd($componentFields->fieldByName('Root')->Tabs());
        // $fields->fieldByName('Root')->setTabs($componentFields->fieldByName('Root')->Tabs());
        // $fields->items = $componentFields->items;

        // $fields = $componentFields;

        // foreach ($mainFields as $main)
        // {
        //     dd($main);
        // }
        // exit;

        // foreach($mainFields->items as $tabSet)
        // {
        //     foreach($tabSet->children as $key => $tab)
        //     {
        //         if ($tab->getName() != 'Components')
        //         {
        //             // dd($tab);
        //             $fields->findTab('Root')->setTabSet($tab);
        //         }

        //         // if ($key == 0)
        //         // {
        //         //     $fields->addFieldsToTab(
        //         //       'Root.Component',
        //         //       $tab->Fields()->items
        //         //     );
        //         // }
        //     }
        // }

        return $fields;
    }

    public function ComponentType()
    {
        return Str::headline(last(explode('\\', $this->ClassName)));
    }
}
