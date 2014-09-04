Colors = new Meteor.Collection('colors');
ColorsThemes = new Meteor.Collection('colorsthemes');

if (Meteor.isClient) {

  // Session.setDefault("selectedColorScheme", ["#C0392B", "#019875"])
  Session.setDefault("selectedColor", "")
  Session.setDefault("selectedColorScheme", "analogous")


  UI.registerHelper("themeColorFor", function(type, colorValue, options){
        if (!_.contains(["text", "border", "background"], type)) {
         console.log('%c Error, Theme helper type uknown:',  'background: #C0392B; color: white; padding: 1px 15px 1px 5px;', type);
         console.log('%c Valid options: "text", "background", "border" ',  'background: #019875; color: white; padding: 1px 15px 1px 5px;');
         return;
        };
        var themeColor = "";
        if (colorValue.indexOf('#') === -1) {
          themeColor = Colors.findOne({ location: colorValue });
          if (themeColor)
            themeColor = themeColor.colorValue;
        } else {
          themeColor = colorValue;
        }

        if (themeColor) {
           var color = Color(themeColor);
           var params = _.pairs(options.hash);
           for (var i = params.length - 1; i >= 0; i--) {
             color[params[i][0]](params[i][1])
           };
            return type !== 'text' ? type + "-color: " + color.rgbString() + ";" : "color: " + color.rgbString() + ";";
        };
       return;
  });


  Template.colorEditing.helpers({
    colorItem : function () {
     return Colors.findOne({_id: Session.get("selectedColor")}) || false;
    }
  });

  Template.colorEditing.events({
    'click .js-lightenColor' : function (e, t) {
      var color = Color(this.colorValue);

      Colors.update({ _id: this._id }, { $set: { colorValue: color.lighten(0.05).hexString() } }); 
    },
    'click .js-darkenColor' : function (e, t) {
      var color = Color(this.colorValue);

      Colors.update({ _id: this._id }, { $set: { colorValue: color.darken(0.05).hexString() } }); 
    },
    'click .js-saturateColor' : function (e, t) {
      var color = Color(this.colorValue);

      Colors.update({ _id: this._id }, { $set: { colorValue: color.saturate(0.08).hexString() } }); 
    },
    'click .js-desaturateColor' : function (e, t) {
      var color = Color(this.colorValue);

      Colors.update({ _id: this._id }, { $set: { colorValue: color.desaturate(0.08).hexString() } }); 
    }
    // ,
    // 'click .js-whitenColor' : function (e, t) {
    //   var color = Color(this.colorValue);

    //   Colors.update({ _id: this._id }, { $set: { colorValue: color.whiten(0.1).hexString() } }); 
    // },
    // 'click .js-blackenColor' : function (e, t) {
    //   var color = Color(this.colorValue);

    //   Colors.update({ _id: this._id }, { $set: { colorValue: color.blacken(0.1).hexString() } }); 
    // }
  });

  Template.colorComplement.helpers({
    complement : function () {
     return Colors.find({_id: Session.get("selectedColor")}, {fields: {colorValue: 1}}).count() > 0 ? tinycolor(Colors.findOne({_id: Session.get("selectedColor")}, {fields: {colorValue: 1}}).colorValue).complement().toRgbString() : {};
    }
  });

  Template.colorComplement.events({
    'click .js-insertColorToPallet': function () {
      if (Colors.find({colorValue: this.valueOf()}).count() > 0) {
      alert('This color is already added to the color pallete')
      } else {
        Colors.insert({colorValue: this.valueOf()})
      }
    }
  })

  Template.colorList.helpers({
    colors : function () {
     return Colors.find({});
    }
  });

Template.colorItem.helpers({
  selected: function () {
    return Session.equals('selectedColor', this._id) ? 'is-selected' : '';
  }
})

  Template.colorItem.events({
    'click .js-selectColor' : function (e, t) {
        Session.set("selectedColor", this._id)
    }
  });

  // Template.colorEditingItem.events({
  //   'click .js-showColorPicker' : function (e, t) {
  //     console.log('%c this.colorValue   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', this.colorValue);
  //     $('#editSwatch').colpickSetColor(this.colorValue)
  //   }
  // });


Template.newColorControls.events({
  'click .js-createNewColor': function () {
    var randomColor = Please.make_color();
    if (!Colors.findOne({colorValue: randomColor}))
        Colors.insert({ colorValue: randomColor })
  //       $(el).colpickHide();
  }
})

  Template.colorEditingItem.rendered = function () {
    var self = this.data;
    var id = '#editSwatch';
    console.log('%c self   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', self);
    if(self) {
      $(id).colpick({
        colorScheme:'light',
        color: self.colorValue,
        submitText: 'Set',
        onSubmit:function(hsb,hex,rgb,el,bySetColor) {
          Colors.update({ _id: Session.get('selectedColor') }, { $set: { colorValue: '#' + hex } } );
          $(el).colpickHide();
        },
        onBeforeShow: function() {
          var selectedColor = Colors.findOne({_id: Session.get("selectedColor")});
          if (selectedColor && selectedColor.colorValue)
            $('#editSwatch').colpickSetColor(selectedColor.colorValue);
        }
      });
    }
  };

// []

Template.colorSchemeControls.events({
  'click .js-setSchemeAnalogous': function (e, t) {
    Session.set('selectedColorScheme', 'analogous')
  },
  'click .js-setSchemeMonochromatic': function (e, t) {
    Session.set('selectedColorScheme', 'monochromatic')
  },
  'click .js-setSchemeTriad': function (e, t) {
    Session.set('selectedColorScheme', 'triad')
  },
  'click .js-setSchemeSplit': function (e, t) {
    Session.set('selectedColorScheme', 'splitcomplement')
  },
  'click .js-setSchemeTetrad': function (e, t) {
    Session.set('selectedColorScheme', 'tetrad')
  }
})


Template.colorScheme.helpers({
  schemeColors: function () {
      if (Session.get('selectedColor') && Session.get('selectedColorScheme')) {
        var color = Colors.findOne({_id: Session.get("selectedColor")}, {fields: {colorValue: 1}});
        if (color && color.colorValue) {
          console.log('%c color   ',  'background: #B3CC57; color: white; padding: 1px 15px 1px 5px;', color);
          var colors = tinycolor(color.colorValue)[Session.get('selectedColorScheme')](8);
          return colors.map(function(t) { return t.toRgbString(); }); 
        } else 
          return [];
      } else 
        return [];
  }
})

Template.colorScheme.events({
  'click .js-insertColorToPallet': function () {
    if (Colors.find({colorValue: this.valueOf()}).count() > 0) {
      alert('This color is already added to the color pallete')
    } else {
      Colors.insert({colorValue: this.valueOf()})
    }
  }
})

Template.newColorControls.rendered = function () {
  $("#addNewColor").colpick({
    colorScheme:'light',
    color: "#ffffff",
    submitText: 'Add',
    onSubmit:function(hsb,hex,rgb,el,bySetColor) {
      Colors.insert({ colorValue: '#' + hex });
      $(el).colpickHide();
    }
  });
};

  // Template.colorComplement.complement = function () {
  //   return Colors.find({_id: Session.get("selectedColor")}, {fields: {colorValue: 1}}).count() > 0 ? tinycolor(Colors.findOne({_id: Session.get("selectedColor")}, {fields: {colorValue: 1}}).colorValue).complement().toRgbString() : {};

  //   var selectedColor = Colors.findOne({_id: Session.get("selectedColor")}, {fields: {colorValue: 1}});
  //   return selectedColor && selectedColor.colorValue ? tinycolor(selectedColor.colorValue).complement().toRgbString() : {};
  // };

  // Template.colorItem.rendered = function () {
  //   var self = this.data;
  //   var id = '#' + self._id;
  //   $(id).colpick({
  //     colorScheme:'light',
  //     color: self.colorValue,
  //     submitText: 'Set',
  //     onSubmit:function(hsb,hex,rgb,el,bySetColor) {
  //       console.log('%c hex   ',  'background: #FF9900; color: white; padding: 1px 15px 1px 5px;', hex);
  //       var colors = tinycolor(hex).monochromatic(6);
  //       var colors2 = tinycolor(hex).analogous(6, 30);
        
  //       var mono = colors.map(function(t) { return t.toRgbString(); });
  //       var ana = colors2.map(function(t) { return t.toRgbString(); })
  //       console.log( mono);
  //       console.log( ana );
  //       Session.set("selectedColorScheme", ana);
  //       Session.set("selectedColor", '#' + hex);

  //       Colors.update({ _id: self._id }, { $set: { colorValue: '#' + hex } } );
  //       // Random
  //       var randomColor = Please.make_color();
  //       Colors.insert({ colorValue: randomColor, location: "1" })
  //       $(el).colpickHide();
  //     }
  //   });
  // };

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Colors.remove({})
    // code to run on server at startup
      if (Colors.find().count() === 0) {

        ColorsThemes.insert({
          themeName: 'Default',
          thmeType: 'static',
          locationGroup: 'MultiApp',
          themeVersion: '0.1.0',
          active: true,
          projectId: Random.id(),
          location: {
            menu_main_top: '',
            menu_action_right: ''

          }
        })

        var colors = ["#1ABC9C",
                     "#2ECC71",
                     "#16A085",
                     "#27AE60",
                     "#2980B9",
                     "#8E44AD",
                     "#2C3E50",
                     "#3498DB",
                     "#9B59B6",
                     "#34495E"];
        for (var i = 0; i < colors.length; i++)
          Colors.insert({
            colorValue: colors[i],
            colorName: '',
            location: i + "",
            locationName: [],
            colorTheme: '',
            createdAt: new Date()
          });
      }
    });
}
