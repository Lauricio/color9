Session.setDefault('swatchPickerOpen', false);

Template.swatchPicker.helpers({
  openState: function () {
    return Session.equals('swatchPickerOpen', true) ? 'is-open' : '';
  }
});

Template.swatchPicker.events({
  'click .js-closeSelectModal' : function (e, t) {
      Session.set('swatchPickerOpen', false);
  }
});

Template.swatchItem.events({
  'click .js-openSwatchPicker' : function (e, t) {
    Session.set('swatchPickerOpen', true);
    }
});