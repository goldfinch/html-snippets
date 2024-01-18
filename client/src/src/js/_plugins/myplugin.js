// (function() {
tinymce.PluginManager.add('myplugin', (editor, url) => {
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

  editor.ui.registry.addButton('customDropdown', {
    type: 'listbox',
    text: 'My listbox',
    icon: false,
    onselect(e) {
      editor.insertContent(this.value());
    },
    values: [
      { text: 'Menu item 1', value: '&nbsp;<strong>Some bold text!</strong>' },
      { text: 'Menu item 2', value: '&nbsp;<em>Some italic text!</em>' },
      { text: 'Menu item 3', value: '&nbsp;Some plain text ...' },
    ],
    onPostRender() {
      // Select the second item by default
      this.value('&nbsp;<em>Some italic text!</em>');
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
