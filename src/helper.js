import moment from 'moment';

const Helper = {
  install(Vue, options) {

    Vue.getReadableSize = function(size) {
      var i = Math.floor(Math.log(size) / Math.log(1024));
      return (size / Math.pow(1024, i)).toFixed(2) * 1 + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    Vue.makeSizeString = function(propertyConfig, data) {
      switch(propertyConfig['type']) {
        case 'raw':
          var ret = data + ' ' + 'byte(s)'; break;
        case 'readable':
          var ret = Vue.getReadableSize(data); break;
        case 'both':
          var ret = Vue.getReadableSize(data) + ' ' + '(' + data + ' ' + 'byte(s)' + ')'; break;
      }
      return ret;
    }

    Vue.getReadableDate = function(time) {
      var d = new Date(time);
      return d.getFullYear() + '/' + (+d.getMonth()+1) + '/' + d.getDate() + ' ' + d.toLocaleTimeString();
    }

    Vue.getMomentDate = function(time) {
      var m = moment(new Date(time));
      return (time && m.isValid())? m.fromNow() : null;
    }

    Vue.makeDateString = function(propertyConfig, data) {
      switch(propertyConfig['type']) {
        case 'raw':
          var ret = Vue.getReadableDate(data); break;
        case 'moment':
          var ret = Vue.getMomentDate(data); break;
        case 'both':
          var ret = Vue.getReadableDate(data) + ' ' + '(' + Vue.getMomentDate(data) + ')'; break;
      }
      return ret;
    }

    Vue.showProperty = function(propertyName, propertyConfig, property) {
        if(typeof property[propertyName] == 'undefined')
          return;

        switch(propertyName) {
          case 'size':
            var ret = Vue.makeSizeString(propertyConfig, property['size']); break;
          case 'date':
            var ret = Vue.makeDateString(propertyConfig, property['date']); break;
          default:
            var ret = ''; break;
        }

        return ret.length ? ret + ' - ' : '';
    }

  }
};

export default Helper;

