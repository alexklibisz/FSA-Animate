app.service('Map', function() {

    function Map() {
        this.contents = {};

        this.put = function(key, value) {
            this.contents[key] = value;
        }

        this.find = function(key) {
            if (this.contents.hasOwnProperty(key)) {
                return this.contents[key];
            } else {
                return false;
            }
        }

        this.remove = function(key) {
            var value = this.find(key);
            if (value != false) {
                delete this.contents[key];
            }
        }

        this.clear = function() {
            for (var key in this.contents) {
                delete this.contents[key];
            }
        }

    }

    return Map;

});
