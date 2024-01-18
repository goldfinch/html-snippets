// (function() {
tinymce.PluginManager.add('customplugin', (editor, url) => {
  // add plugin code here

  // editor.ui.registry.addButton('customInsertButton', {
  //   text: 'My Button',
  //   onAction: (_) => editor.insertContent(`&nbsp;<strong>It's my button!</strong>&nbsp;`)
  // });

  // const toTimeHtml = (date) => `<time datetime="${date.toString()}">${date.toDateString()}</time>`;

  // editor.ui.registry.addButton('customDateButton', {
  //   icon: 'insert-time',
  //   tooltip: 'Insert Current Date',
  //   enabled: false,
  //   onAction: (_) => editor.insertContent(toTimeHtml(new Date())),
  //   onSetup: (buttonApi) => {
  //     const editorEventCallback = (eventApi) => {
  //       buttonApi.setEnabled(eventApi.element.nodeName.toLowerCase() !== 'time');
  //     };
  //     editor.on('NodeChange', editorEventCallback);

  //     /* onSetup should always return the unbind handlers */
  //     return () => editor.off('NodeChange', editorEventCallback);
  //   }
  // });
  let toggleState = false;

  editor.ui.registry.addMenuButton('customDropdown', {
    // icon: 'more-drawer',
    // icon: 'preferences',
    icon: 'sharpen',
    // text: 'My button',
    fetch(callback) {
      const items = [
        {
          type: 'menuitem',
          text: 'Menu item 1',
          onAction() {
            editor.insertContent('&nbsp;<em>You clicked menu item 1!</em>');
          },
        },
        {
          type: 'nestedmenuitem',
          text: 'Menu item 2',
          icon: 'user',
          getSubmenuItems() {
            return [
              {
                type: 'menuitem',
                text: 'Sub menu item 1',
                icon: 'unlock',
                onAction() {
                  editor.insertContent('&nbsp;<em>You clicked Sub menu item 1!</em>');
                },
              },
              {
                type: 'menuitem',
                text: 'Sub menu item 2',
                icon: 'lock',
                onAction() {
                  editor.insertContent('&nbsp;<em>You clicked Sub menu item 2!</em>');
                },
              },
            ];
          },
        },
        {
          type: 'togglemenuitem',
          text: 'Toggle menu item',
          onAction() {
            toggleState = !toggleState;
            editor.insertContent(`&nbsp;<em>You toggled a menuitem ${toggleState ? 'on' : 'off'}</em>`);
          },
          onSetup(api) {
            api.setActive(toggleState);
            return function () {};
          },
        },
      ];
      callback(items);
    },
  });

  // return {
  //   getMetadata: () => ({
  //     name: 'Custom plugin',
  //     url: 'https://example.com/docs/customplugin'
  //   })
  // }
});
// })();

// (function() {
//   tinymce.PluginManager.add('myplugin', function(editor, url) {

//       editor.addButton('myplugin', {
//         text: 'Add button',
//         icon: false,
//         onclick: function() {

//           editor.windowManager.open({
//             title: 'Add button',
//             body: [

//               {
//                   type: 'textbox',
//                   name: 'text',
//                   label: 'Text',
//               },

//               {
//                   type: 'textbox',
//                   name: 'link',
//                   label: 'Link',
//               },

//             ],
//             buttons: [
//               {
//                 text: "Set",
//                 subtype: "primary",
//                 onclick: 'submit'
//               },
//               {
//                 text: "Cancel",
//                 onclick: function() {
//                   editor.windowManager.close();
//                 }
//               }
//             ],
//             onsubmit: function(e) {

//               editor.insertContent('<a class="btn btn--custom btn--blue btn--adown btn--mleft" href="' + e.data.link + '">' + e.data.text + '</a>');

//             }
//           });
//         }
//       });

//   });
// })();
