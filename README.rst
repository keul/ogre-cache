==========
Ogre Cache
==========

|npmversion| |license| |downloads|

.. |npmversion| image:: https://img.shields.io/npm/v/ogre-cache.svg?style=flat-square
                :alt: NPM Version
                :target: https://npmjs.org/package/ogre-cache

.. |license| image:: http://img.shields.io/npm/l/ogre-cache.svg?style=flat-square
               :alt: License
               :target: LICENSE

.. |downloads| image:: http://img.shields.io/npm/dm/ogre-cache.svg?style=flat-square
               :alt: Downloads
               :target: https://npmjs.org/package/ogre-cache

.. contents::

Introduction
============

Add to `Express <http://expressjs.com/>`_ a simple and rude support to leverage
**browser cache**.

The framework already support caching with the ``maxAge`` option in the `express.static middleware <http://expressjs.com/api.html#express.static>`_ but this kind of cache is the weakest one.
Relying onto the HTTP 304 status code will not avoid the roundtrip of asking to the server if the resource is still "fresh".
Also, this only works well on static resources.

The *best* (while more difficult to be controlled) type of cache you can use is the long term **browser bcache**, by sending special headers to browser, driving them to keep the resource in cache for an amount of time.
This is done by sending the ``Cache-Control`` header.

How to use
==========

Quick start
-----------

.. code-block:: javascript

    var app = express();
    var ogre = require('ogre-cache');
    app.use(ogre.cache());

This will register Ogre default cache configuration: a strong, one week, cache headers for all resources like:

* JavaScript
* Images
* CSS
* CSS related contents (font, icon-font stuff)

Advanced use
------------

The ``cache`` function returns a middleware configured as you wish.
If no parameters are provided, the only **named configuration** available is used: this configuration is named "*default*" and it's stored inside the internal registry of the product.

You can easily use different named configurations:

.. code-block:: javascript

    router.use(ogre.cache("default", "bar"));

Order matter: latter provided configuration "wins" on formers ones.

Configuration
-------------

Ogre Cache is using the simplest possible approach: caching configuration are activated by inspecting the calling URL: you can register a cache behavior by testing regular expressions on URLs and provinding an expire age (in seconds).

.. code-block:: javascript

    app.use(new ogre.configuration.CacheConfiguration()
        .add('/settings', 600));

By simply looking at URL you can cache not only static contents but also every other registered routes.

There's facilitation while defining regex for file extensions:

.. code-block:: javascript

    app.use(new ogre.configuration.CacheConfiguration()
        .add('*.avi', 600));

Named configurations are only configurations you'll save for be reused:

.. code-block:: javascript

    ogre.register('files',
        new ogre.configuration.CacheConfiguration())
        .add(/.*\.(pdf|doc|odt)/gi, 86400);
    app.use(ogre.cache("files"));

Limitations and troubleshooting
===============================

First rule is to be sure on what you are chaching: never not put in the user's cache a resource you are not sure will not change, or do not use long-term expire period.

The cache registration must precede the route it's applied to.

Using URL to investigate if a resouce must be cached is a weak approach.
A badly configured regex could leave to unexpected results, like cache resources you don't want to cache.
Be aware.

