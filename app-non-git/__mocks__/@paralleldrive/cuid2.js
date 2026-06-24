// Jest manual mock for @paralleldrive/cuid2
module.exports = {
  createId: function() {
    return 'id_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },
  init: function() {
    return;
  },
  getConstants: function() {
    return {};
  },
  isCuid: function() {
    return true;
  }
};
