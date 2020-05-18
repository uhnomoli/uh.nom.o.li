---
layout: project.html
name: DotShare
description: 'A socially driven website for sharing dot files.'
site: http://dotshare.it/
scrots:
    -
        filename: feed
        width: 227
        height: 108
        title: Activity Feed
    -
        filename: browse
        width: 227
        height: 108
        title: Browse Page
    -
        filename: lightbox
        width: 227
        height: 108
        title: Lightbox
    -
        filename: dot
        width: 227
        height: 108
        title: Viewing a Dot
    -
        filename: file
        width: 227
        height: 108
        title: Viewing a Dot File
    -
        filename: profile
        width: 227
        height: 108
        title: Viewing a Profile
---

_As a short preface, in the *nix world config files are often referred to as dot files (dots for short). This is because on *nix systems config files are usually hidden files which are denoted by their names beginning with a period (dot). Hence the name DotShare._

DotShare was a project with the goal of solving a problem that I and many others often ran into in the world of *nix customization.


# The problem

More often then not dot files could be found in 2 places:

+ *nix distribution's forums.
+ GitHub _(or similar)_ repos.

The problem with the first item on that list was that every distribution has it's own forum with a separate thread for every app. So when you multiply the number of popular distributions by the number of apps you're interested in, this quickly turns into a nightmare when trying to find interesting new ways of toying with your desktop.

Not only is it a pain to keep track of all these threads, spanning numerous forums, it was becoming commonplace to start hosting all of your dot files on sites like GitHub in your own personal dots repo. The problem with this was that searching for a specific app's configs on such sites was only slightly more convenient than looking for a needle in a haystack.


# The solution

With the fractured state everything was in, the obvious first step was creating a central location for the sole purpose of sharing dot files. Once everything was located in one place, the main focus was on usability and discovery as these were the major hurdles with the current systems.

The core parts of accomplishing this were user requested _(not created)_ categories and a simple _"likes"_ system to make the exceptional rise to the top. To enhance usability, the ability to easily preview listings of dots was enabled by a JavaScript lightbox. Lastly _(but certainly not least)_, to enhance discovery was the ability to follow users and get a stream of their activity on the site.


# Development

DotShare was coded over the period of 3 months, over which I learned Python and coded it from the ground up on the [Flask][flask] microframework. I also handled deployment once the codebase was ready to be launched.


[flask]: https://flask.palletsprojects.com/

