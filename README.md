# pretty-autoindex

Show nginx autoindex more pretty!

![demo.gif](https://raw.githubusercontent.com/spring-raining/pretty-autoindex/gh-pages/static/demo.gif)

## Installation

Download files to your server.

```sh-session
$ git clone https://github.com/spring-raining/pretty-autoindex.git
```

Before using it, you need to set some nginx configurations.
(In this expamle, The IP address and the port represent as `192.168.10.108:10080`
so you should replace them as necessary.)

```nginx
# pretty-autoindex try to access this address, and display indexes dynamically.
server {
    listen  10080;
    
    location / {
        root    /path/to/you/want/to/show;
        autoindex   on;
        autoindex_format    json;
        
        # Enable your browser to access here. 
        add_header  Access-Control-Allow-Origin "http://192.168.10.108";
        add_header  Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header  Access-Control-Allow-Headers "Origin, Authorization, Accept";
        add_header  Access-Control-Allow-Credentials true;
    }
}

# This is an actual page.
server {
    listen  80;
    
    location / {
        root    /path/to/pretty-autoindex/dist;
    }
}
```

And set a conf variable in index.html.

```sh-session
$ vim /path/to/pretty-autoindex/dist/config.js
```

```javascript
var conf = {
      name: 'A wonderful name that you want',
      address: 'http://192.168.10.108:10080',

      visibilityOptions: {
          size: {
              use: true,
              type: 'readable' //raw, readable, both
          },
          date: {
              use: true,
              type: 'moment' //raw, moment, both
          }
      }
};
```

Then, restart nginx and access `http://192.168.10.108`.

**CAUTION!**
If you intend to open your page in public network, beware your nginx configuration
and exclude files that you wouldn't like to expose from the directory.

## Development

To build pretty-autoindex,

1.  Install [Node.js](https://nodejs.org)

2.  Install dependent libraries

    ```sh-session
    $ npm install
    ```

3.  Run build

    ```sh-session
    $ npm run build
    ```

## License

MIT

## Author

[spring-raining](https://github.com/spring-raining)
