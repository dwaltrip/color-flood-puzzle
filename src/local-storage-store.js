
const PREFIX = 'color-flood-puzzle__';

export default {
  set: function(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  },

  get: function(key) {
    var val = localStorage.getItem(PREFIX + key);
    return val !== null ? JSON.parse(val) : null;
  }
};
