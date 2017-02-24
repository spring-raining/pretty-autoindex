import moment from 'moment';

const Helper = {
  install(Vue, options) {

    Vue.getReadableSize = function(size) {
      var i = Math.floor(Math.log(size) / Math.log(1024));
      return (size / Math.pow(1024, i)).toFixed(2) * 1 + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }
  
    Vue.getReadableDate = function(time) {
      var m = moment(new Date(time));
      return (time && m.isValid())? m.fromNow() : null;
    }

    Vue.showProperty = function(visibilityOption, data) {
        if(typeof data[visibilityOption] == 'undefined')
          return;

        switch(visibilityOption) {
          case 'size':
            var ret = Vue.getReadableSize(data['size']); break;
          case 'date':
            var ret = Vue.getReadableDate(data['date']); break;
          default:
            var ret = ''; break;
        }

        return ret.length ? ret + ' - ' : '';
    }

  }
};

export default Helper;

