function parseColorTheme (data) {
  var jsonText = JSON.stringify(data,undefined, 3)
  console.log('%c jsonText   ',  'background: #B3CC57; color: white; padding: 1px 15px 1px 5px;', jsonText);


// '\r\n';
}

// Template.colorsThemeList.helpers({
//   colorsThemes: function () {
//     return ColorThemes.find()
//   },
//   getLocationArray: function (obj) {
//     return Object.keys(obj)
//   },
//   getLocationColor: function () {
//     return UI._parentData(1).locations[this]
//   }
// })

// Template.colorsThemeList.events({
//   'click .js-makeActiveTheme': function () {
//     Session.set('active_ColorsTheme', this._id)
//   }
// });

Template.importThemes.events({
  'click .js-exportTheme': function () {
    // var themeData = ColorThemes.findOne({},{fields: {location: 1, themeName: 1, themeType: 1, locationGroup: 1, themeVersion: 1}})
    var themeData = ColorThemes.findOne({},{fields: {_id: 0, active: 0}})
    var textToWrite = JSON.stringify(themeData, undefined, 3)
    var fileNameToSaveAs = 'theme.txt'
    var browserName = navigator.appName;

    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    
    saveAs(textFileAsBlob, fileNameToSaveAs);

  }
})