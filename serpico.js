function oddOrNot (n) {
    return n % 2 == 0 ? 'even' : 'odd';
};

(function ($) {

    $.fn.serpico = function (options) {
        var opts = $.extend({}, $.fn.serpico.defaults, options);
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
          {src: 'img1', sort: 1, filter: oddOrNot(1)},
          {src: 'img2', sort: 3, filter: oddOrNot(3)},
          {src: 'img3', sort: 2, filter: oddOrNot(2)},
        ],
        minHeight: '100px',
        sortField: 'sort',
        filterAll: '_all',
        filterAttribute: 'filter',//TODO: filter function as parameters
        filterSeparator: " ",
        onFilterGlobal: function (target) {

        },
        onFilterItem: function (item) {

        },
        onSortGlobal: function (target) {

        },
        onSortItem: function () {

        }
    };

    function Gallery (target, config) {
        var me = this;

        // Private functions
        var append = function (data) {
            var w = (100 / config.columns) + '%';

            data.forEach(function (item, index) {
              
                target.append(
                    $('<div>')
                      .addClass('item')
                      .css({
                          'width': w
                      })
                      .data(item)
                      .html(
                          JSON.stringify(item, null, 2)
                      )
                );
            });
        }

        me.init = function () {
            target.addClass(config.namespace);
            target.css({
              'min-height': config.minHeight
            });

            append(config.data);
        };

        me.add = function (newData) {
            append(newData);
        };

        me.filter = function (keyword) {
            if (keyword === config.filterAll) {

                target.find('.item').show();

            } else {

                target.find('.item').each(function () {
                    var filters = $(this).data('filter')
                        .trim()
                        .split(config.filterSeparator);

                    if (keyword.indexOf(filters) < 0) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });

            }
        }

        me.sort = function (dataAttribute) {
            target.find('.item').sort(function (a, b) {

                return $(a).data(config.sortField) - $(b).data(config.sortField);

            }).appendTo(target);
        };

        me.init();
    }


})(jQuery);
