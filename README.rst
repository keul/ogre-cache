==========
Ogre Cache
==========

Quick start
===========

.. code-block:: javascript

    var ogre = require('ogre-cache');
    app.use(ogre.cache());

This will register Ogre default cache settings: a strong, one week, cache
headers for all resources like:

* JavaScript
* Images
* CSS
* CSS related contents (font, icon-font stuff)

