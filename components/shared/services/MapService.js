app.service('Map', function() {

    function Map() {
        this.contents = {};
    }

    Map.prototype = {
        put: function(key, value) {
            this.contents[key] = value;
        },
        find: function(key) {
            if (this.contents.hasOwnProperty(key)) {
                return this.contents[key];
            } else {
                return false;
            }
        },
        remove: function(key) {
            var value = this.find(key);
            if (value != false) {
                delete this.contents[key];
            }
        },
        clear: function() {
            for (var key in this.contents) {
                delete this.contents[key];
            }
        }
    }

    return Map;

});
