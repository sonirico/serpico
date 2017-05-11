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
        sortAttribute: 'sort',
        filterAll: '_all',
        filterAttribute: 'filter',//TODO: filtering function as parameters
        filterSeparator: " ",
        onFilterGlobal: function (target) {

        },
        onFilterItem: function (item, action) { // TODO: Implement "none" action
            defaultOnFilterItem(item, action);
        },
        onSortGlobal: function (target, sortAttribute) {
            animatedSort(target, sortAttribute);
        },
        onSortItem: function () {

        }
    };

    function defaultOnFilterItem (item, action) {
        item.stop(true, true);

        switch (action) {
          case "hide":
            item.fadeOut('slow');
            break;
          case "show":
            item.fadeIn('slow');
            break;
          default:

        }

    }

    function animatedSort (parent, sortAttribute) {
        var promises = [];

        var originalItems = parent.find('.item');
        var originalPositions = [];
        parent.css('height', parent.height() + 'px');

        var sortedItems = originalItems.toArray().sort(function (a, b) {

            return $(a).data(sortAttribute) > $(b).data(sortAttribute);

        });

        originalItems.each(function () {

            originalPositions.push($(this).position());

        }).each(function (originalIndex, v) {
            var $originalItem = $(this);
            var sortedItemIndex = sortedItems.indexOf(this);

            if (originalIndex === sortedItemIndex) {
              return;
            }

            sortedItems[sortedItemIndex] = $originalItem.clone();
            sortedItems[sortedItemIndex].data($originalItem.data());

            $originalItem.css({
                'position': 'absolute',
                'top': originalPositions[originalIndex].top + 'px',
                'left': originalPositions[originalIndex].left + 'px'
            });

            var promise = $originalItem.animate({
                'top': originalPositions[sortedItemIndex].top + 'px',
                'left': originalPositions[sortedItemIndex].left + 'px'
            }).promise();

            promises.push(promise);
        });

        Promise.all(promises).then(function () {
            originalItems.each(function(index) {
                $sorted = sortedItems[index];

                $(this).replaceWith($sorted);
            });

            // Restore parent height
            parent.css('height', 'auto');
        });
    }

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

                target.find('.item').each(function () {
                    config.onFilterItem($(this), 'show');
                });

            } else {

                target.find('.item').each(function () {
                    var filters = $(this).data('filter')
                        .trim()
                        .split(config.filterSeparator);

                    if (keyword.indexOf(filters) < 0) {
                        config.onFilterItem($(this), 'hide');
                    } else {
                        config.onFilterItem($(this), 'show');
                    }
                });

            }
        }

        me.sort = function (dataAttribute) {

            var dataAttribute = dataAttribute || config.sortAttribute;

            config.onSortGlobal(target, dataAttribute);
            // target.find('.item').sort(function (a, b) {
            //
            //     return $(a).data(config.sortField) - $(b).data(config.sortField);
            //
            // }).appendTo(target);
        };

        me.init();
    }


})(jQuery);
