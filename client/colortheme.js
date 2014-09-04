function parseColorTheme (data) {
  var jsonText = JSON.stringify(data,undefined, 3)
  console.log('%c jsonText   ',  'background: #B3CC57; color: white; padding: 1px 15px 1px 5px;', jsonText);


// '\r\n';
}

Template.colorsThemeList.helpers({
  colorsThemes: function () {
    return ColorThemes.find()
  },
  getLocationArray: function (obj) {
    return Object.keys(obj)
  },
  getLocationColor: function () {
    return UI._parentData(1).location[this]
  }
})

Template.colorsThemeList.events({
  'click .js-makeActiveTheme': function () {
    Session.set('active_ColorsTheme', this._id)
  }
});

Template.importThemes.events({
  'click .js-exportTheme': function () {
    // var themeData = ColorThemes.findOne({},{fields: {location: 1, themeName: 1, themeType: 1, locationGroup: 1, themeVersion: 1}})
    var themeData = ColorThemes.findOne({},{fields: {_id: 0, active: 0}})
    parseColorTheme(themeData) 
    // var textToWrite = document.getElementById("inputTextToSave").value;
    // var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    // var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;

    // var downloadLink = document.createElement("a");
    // downloadLink.download = fileNameToSaveAs;
    // downloadLink.innerHTML = "Download File";
    // if (window.webkitURL != null)
    // {
    //   // Chrome allows the link to be clicked
    //   // without actually adding it to the DOM.
    //   downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    // }
    // else
    // {
    //   // Firefox requires the link to be added to the DOM
    //   // before it can be clicked.
    //   downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    //   downloadLink.onclick = destroyClickedElement;
    //   downloadLink.style.display = "none";
    //   document.body.appendChild(downloadLink);
    // }

    // downloadLink.click();
  }
})