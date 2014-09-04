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
})