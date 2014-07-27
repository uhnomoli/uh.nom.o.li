//
// LiteBox
//
(function ($) {
    var
        $window = $(window),
        $document = $(document);
    
    
    //
    // LiteBox
    //
    var $litebox = $('<div id="litebox"/>');
    
    function illuminate(image) {
        var
            width = Math.round($window.width() * 0.9),
            height = Math.round($window.height() * 0.9),
            
            iwidth = image.width,
            iheight = image.height,
            wh = iwidth / iheight,
            hw = iheight / iwidth;
        
        if (iwidth > width) {
            iwidth = width;
            iheight = Math.round(width * hw);
        }
        
        if (iheight > height) {
            iwidth = Math.round(height * wh);
            iheight = height;
        }
        
        image.width = iwidth;
        image.height = iheight;
        
        $litebox.html(image);
        
        var 
            $image = $litebox.find('img').first(),
            
            top_margin = Math.round($image.outerHeight() / 2),
            left_margin = Math.round($image.outerWidth() / 2);
        
        $image.css({
            'position': 'absolute',
            'top': '50%',
            'left': '50%',
            
            'margin-top': '-' + top_margin.toString() + 'px',
            'margin-left': '-' + left_margin.toString() + 'px'
        })
        
        $litebox.fadeIn();
        
        $document.on('keyup.litebox', function (event) {
            if (event.keyCode == 27) {
                $document.off('keyup.litebox');
                $litebox.fadeOut();
            }
        });
    }
    
    $litebox.on('click.litebox', function (event) {
        if (event.target == this) {
            $document.off('keyup.litebox');
            $litebox.fadeOut();
        }
    });
    
    $.fn.litebox = function () {
        if (!$('#litebox').length) {
            $('body').prepend($litebox);
        }
        
        return this.each(function () {
            var $this = $(this);
            
            $this.on('click.litebox', function (event) {
                if (event.which == 2 || event.ctrlKey || event.metaKey) {
                    return true;
                }
                
                event.preventDefault();
                
                $('<img>').on('load', function () {
                    illuminate(this);
                }).attr('src', $this.attr('href'));
            });
        });
    };
    
    
    //
    // Preserve vertical rhythm
    //
    function reflow() {
        var baseline = 9;
        
        $('.words img, div.code').each(function () {
            var
                $this = $(this),
                $target = $this,
                $anchor = $this.parent('a'),
                
                margin_top = parseInt($this.css('margin-top'), 10),
                margin_bottom = parseInt($this.css('margin-bottom'), 10),
                
                height = $this.outerHeight(),
                remainder = height % baseline;
            
            if ($anchor.length) {
                margin_bottom += 1;
                
                $anchor.css('border-bottom-width', '0px');
                $target.css('margin-bottom', margin_bottom);
            }
            
            if (remainder) {
                var
                    $figure = $this.parents('figure'),
                    
                    difference = baseline - remainder;
                
                if ($figure.length) {
                    $target = $figure;
                }
                
                $target.css('margin-top', margin_top + Math.ceil(difference / 2));
                $target.css('margin-bottom', margin_bottom + Math.floor(difference / 2));
            }
        });
    }
    
    $window.on('load', function () {
        reflow();
    });
    
    
    //
    // Painless-JAX
    //
    if (!History.enabled) {
        return false;
    }
    
    var root = History.getRootUrl();
    
    $.expr.filters.internal = function (elem) {
        return (elem.hostname == window.location.hostname && /(\/|\.html)$/i.test(elem.pathname) && !elem.hash) || false;
    };
    
    function find_all($html, selector) {
        return $html.filter(selector).add($html.find(selector));
    }
    
    function parse_html(html) {
        return $($.parseHTML(html, document, true));
    }
    
    function parse_response(html) {
        var
            head = /<head[^>]*>([\s\S]+)<\/head>/.exec(html),
            body = /<body[^>]*>([\s\S]+)<\/body>/.exec(html),
            
            $head = head ? parse_html(head[1]) : $(),
            $body = body ? parse_html(body[1]) : $(),
            
            title = $.trim(find_all($head, 'title').last().html()),
            $content = $.trim(find_all($body, '#content').first().html());
        
        return {
            'title': title,
            '$content': $content
        }
    }
    
    $document.ready(function () {
        $document.on('click', 'a:internal', function (event) {
            if (event.which == 2 || event.ctrlKey || event.metaKey) {
                return true;
            }
            
            event.preventDefault();
            History.pushState(null, null, $(this).attr('href'));
        });
        
        $('a:has(img)').litebox();
    });
    
    $window.on('statechange', function () {
        var
            url = History.getState().url,
            rel = url.replace(root, '/');
        
        $.get(rel).done(function (date) {
            var response = parse_response(date);
            
            if (!response.$content.length) {
                document.location.href = url;
                
                return false;
            }
            
            if (response.title.length) {
                $('title').last().html(response.title);
            }
            
            $('#litebox')
                .trigger('click.litebox')
                .end()
                .promise()
                .done(function () {
                    var $content = $('#content');
                    
                    $content
                        .slideUp(500)
                        .promise()
                        .done(function () {
                            $content
                                .html(response.$content)
                                .slideDown(500)
                                .promise()
                                .done(function () {
                                    reflow();
                                    $content.find('a:has(img)').litebox();
                                });
                        });
                });
        }).fail(function () {
            document.location.href = url;
            
            return false;
        });
    });
})(jQuery);
