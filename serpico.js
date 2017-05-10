(function ($) {


    $.fn.serpico = function (options) {
        var opts = $.extend({}, $.fn.serpico.defaults, options);
console.log(opts);
        var galleries = [];

        this.each(function () {
            var $target = $(this);

            galleries.push(new Gallery ($target, opts));
        });

        return galleries.length === 1 ? galleries[0] : galleries;
    };

    $.fn.serpico.defaults = {
        namespace: 'serpico',
        columns: 3,
        data: [
          {src: 'img1', sort: 1},
          {src: 'img2', sort: 3},
          {src: 'img3', sort: 2},
        ],
        minHeight: '100px'
    };

    function Gallery (target, config) {
        var me = this;

        me.init = function () {
            target.addClass(config.namespace);
            target.css({
              'min-height': config.minHeight
            });

            var w = (100 / config.columns) + '%';

            config.data.forEach(function (item, index) {
                target.append(
                    $('<div>')
                      .addClass('item')
                      .css({
                          'width': w
                      })
                      .data(item)
                      .text(item.src)
                );
            });
        };

        me.init();
    }

    Gallery.prototype.add = function (moreData) {
      console.log(this);
console.log(moreData);
    };

    Gallery.prototype.sort = function () {

    };



})(jQuery);
