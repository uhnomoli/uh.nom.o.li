---
layout: post.html
title: 'Is it time for the 80 character line limit to go?'
tags: ['Programming', 'Thoughts']
---

Ah the 80 character line limit. It's the first thing in nearly any styleguide and [it came to be][history] largely because of the width of the IBM punched card from the '20s. Nearly a century later and it's as common as ever. Is it time for a change?

I think one of the main reasons the limit is still so prevalent is because people feel it somehow helps deter less experienced programmers from writing poor code. Long lines _can_ indicate a handful of different problems with the two biggest offenders being overly complex code and indentation hell.

However, my issue with this thought process is someone who isn't aware of these issues isn't going to magically start writing better code because of a line limit. In the end all that will change is formatting and the programmer will have learned nothing in the process. They'll just shrug it off as tradition.

Rather than asking contributors to check if a line is too long, they should rather be checking if a line is detrimental to the maintainability or readability of the codebase. Common sense, no? As a bonus, you might even catch those short lines that aren't so hot instead of giving them a free pass.


## But the split windows! Won't somebody please think of the split windows?

One of the big differences between a standard aspect ratio and a widescreen aspect ratio is that vertical screen real estate becomes much more valuable than horizontal screen real estate. Poor code aside, as poor code hurts the codebase no matter how long the lines are, lines are often identifiable by their first 80 characters. The only time you need to scroll horizontally is when you're working with a specific long line.

But, when you start chopping at lines that happen to be over some arbitrary limit, what you're trading is vertical real estate for horizontal real estate. You're trading gold for copper. Regardless of the line limit, you're spending the majority of your time traversing files vertically, not horizontally.

Anecdotal evidence being anecdotal, the most common desktop resolution I've encountered in my programmer centric web presence is by far 1920 by 1080. Nearly every programmer I've worked with or talked to has more than one monitor. I even know one that is experimenting with a portrait dual screen setup.

In short, an 80 character line limit is in no way necessary to ensure effective window splitting when you're dealing with a workspace that's 3840 pixels wide. A workspace that's 1920 pixels wide can still be comfortably split in half.


## So where does that leave us?

At this point I really don't feel the character line limit serves a purpose. To a certain degree I feel it's more harmful than beneficial. I'd really like to see projects start taking a common sense approach when it comes to line length.

Lastly, please stop using this convention when writing emails. On a desktop they'll take up a quarter of the screen and they're an absolute mess on phones. My eyes and sanity thanks you.


[history]: http://programmers.stackexchange.com/questions/148677/why-is-80-characters-the-standard-limit-for-code-width
