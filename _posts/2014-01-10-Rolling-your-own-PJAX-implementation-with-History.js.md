---
layout: post.html
title: 'Rolling your own PJAX implementation with History.js'
tags: ['Code', 'JavaScript', 'Web']
---

If you were like me, at some point you read somewhere about this cool new thing called [PJAX][pjax]. Essentially, instead of issuing normal HTTP requests when navigating a site, links are fetched and loaded via AJAX to avoid full page refreshes. The site feels much more responsive. This isn't without it's quirks however.

My issue with PJAX largely revolved around the inability to implement animations. First and foremost, the provided hooks weren't sufficient. It was possible to rig something up with CSS and class swapping, but not only did that feel gross it often broke down as soon as the back button entered the picture. Although PJAX felt slightly faster, without animations it was just as jarring as a full page refresh and so I didn't see a point.

As I was working on the redesign of this site, I decided to take another look to see what had changed. Unfortunately I discovered not much had. However, instead of moving on this time I decided to take a quick look for any alternative solutions. I pleasantly discovered [History.js][history.js].

After a little bit of fiddling, I had quickly rolled my own PJAX implementation powered by History.js. Thinking there may be a few people out there that are in the same spot I was, I figured I'd post a quick write up.

First we start off with your usual boilerplate.

```javascript
(function ($) {
    var $document = $(document);

    // our code ...
})(jQuery);
```

The next thing we need to do, and I wish more JavaScript developers kept graceful degradation in mind, is check whether or not the browser supports the HTML5 history API. History.js makes this easy for us.

```javascript
if (!History.enabled) {
    return false;
}
```

Now if we run into an unsupported browser our site doesn't cease to function. As an added bonus, there will be one less site out there that's shoving some snarky message in the user's face about how they need to upgrade to a _real_ browser so they can experience the greatness that is four different versions of jQuery being used to style some text.

Moving on, before we get to implementing anything, we have a bit more setup to do.

```javascript
var root = History.getRootUrl();

$.expr.filters.internal = function (elem) {
    return (elem.hostname == window.location.hostname && /(\/|\.html)$/i.test(elem.pathname)) || false;
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
        $content = $.trim(find_all($body, '#content').first().contents());

    return {
        'title': title,
        '$content': $content
    }
}
```

The first thing we're doing here is caching a value that we'll be using later. After that we're defining a custom jQuery pseudo selector so we can avoid littering our markup with `data-*` attributes. Lastly, we're defining a few helper functions to make our code easier to work with.

Although these helper functions are fairly straightforward, I'll quickly run through them. The first, `find_all`, simply grabs all occurrences of `selector` in the supplied chunk of HTML. Next, `parse_all` abstracts the process of turning a chunk of HTML into a jQuery object.

The last helper function is `parse_response` and it's a bit more significant compared to the rest. This is where we're parsing the AJAX response for the title and the chunk of the page that we're trying to load. Line 24 is worth singling out as you're likely going to want to change it to work with your site.

Now we're ready to start implementing PJAX.

```javascript
$document.ready(function () {
    $document.on('click', 'a:internal', function (event) {
        if (event.which == 2 || event.ctrlKey || event.metaKey) {
            return true;
        }

        History.pushState(null, null, $(this).attr('href'));
        event.preventDefault();

        return false;
    });
});
```

Depending on your use case you may wish to alter the above, but for basic usage it's likely sufficient. All we're doing here is changing our internal links to use the HTML5 history API.

The key thing here is actually the selector where we're using our custom pseudo selector from earlier. A link is considered internal if it's on the same domain and ends with either `/` or `.html`. Again, depending on your use case, you may want to change that.

All that's left now is the handling of our state changes.

```javascript
// This is the event that's triggered by the HTML5 history API.
$(window).on('statechange', function () {
    var
        url = History.getState().url,
        rel = url.replace(root, '/');

    // Here we're making our AJAX call.
    $.get(rel).done(function (date) {
        var response = parse_response(date);

        // First we need to check if the chunk we were looking for was found
        // in the response. If it wasn't we reject the link.
        if (!response.$content.length) {
            document.location.href = url;

            return false;
        }

        // This is our target container.
        var $content = $('#content');

        // Here we're updating the page title if one was found in the response.
        if (response.title.length) {
            $('title').last().html(response.title);
        }

        // Now we're loading the response.
        $content
            .slideUp(500)
            .promise()
            .done(function () {
                $content
                    .html(response.$content)
                    .slideDown(500);
            });
    // If the AJAX request failed, we're again rejecting the link.
    }).fail(function () {
        document.location.href = url;

        return false;
    });
});
```

I've gone ahead and annotated most of what's going on in the comments. The only things I'll bring up specifically are lines 20 and 28 to 35. As before, you're likely going to want to change the selector on line 20. You're also likely going to want to change how the response is loaded which would be lines 28 to 35.

The only thing left is to put it all together.

```javascript
(function ($) {
    var $document = $(document);

    if (!History.enabled) {
        return false;
    }

    var root = History.getRootUrl();

    $.expr.filters.internal = function (elem) {
        return (elem.hostname == window.location.hostname && /(\/|\.html)$/i.test(elem.pathname)) || false;
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

            History.pushState(null, null, $(this).attr('href'));
            event.preventDefault();

            return false;
        });
    });

    $(window).on('statechange', function () {
        var
            url = History.getState().url,
            rel = url.replace(root, '/');

        $.get(rel).done(function (date) {
            var response = parse_response(date);

            if (!response.$content.length) {
                document.location.href = url;

                return false;
            }

            var $content = $('#content');

            if (response.title.length) {
                $('title').last().html(response.title);
            }

            $content
                .slideUp(500)
                .promise()
                .done(function () {
                    $content
                        .html(response.$content)
                        .slideDown(500);
                });
        }).fail(function () {
            document.location.href = url;

            return false;
        });
    });
})(jQuery);
```

And there we have it. A simple, straightforward PJAX implementation that doesn't restrict us when it comes to how we want to handle loading our PJAX responses. It's by no means perfect or without flaws, but it's solid enough for basic usage and easily extensible for more complicated use cases.


[history.js]: https://github.com/browserstate/history.js/
[pjax]: https://pjax.herokuapp.com/

