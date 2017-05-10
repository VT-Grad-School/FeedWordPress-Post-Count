javascript: (function() {

    function download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }
    var el = document.createElement('div'),
        b = document.getElementsByTagName('body')[0],
        otherlib = true,
        msg = '';
    el.style.position = 'fixed';
    el.style.height = '32px';
    el.style.width = '220px';
    el.style.marginLeft = '-110px';
    el.style.top = '0';
    el.style.left = '50%';
    el.style.padding = '5px 10px';
    el.style.zIndex = 1001;
    el.style.fontSize = '12px';
    el.style.color = '#222';
    el.style.backgroundColor = '#f99';

    function getScript(url, success) {
        var script = document.createElement('script');
        script.src = url;
        var head = document.getElementsByTagName('head')[0],
            done = false;
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    }
    getScript('https://code.jquery.com/jquery.min.js', function() {
        if (typeof jQuery == 'undefined') {
            msg = 'Sorry, but jQuery wasn\'t able to load';
        } else {
            msg = 'This page is now jQuerified with v' + jQuery.fn.jquery;
            if (otherlib) { msg += ' and noConflict(). Use $jq(), not $().'; }
        }
        return showMsg();
    });

    function showMsg() {
        el.innerHTML = msg;
        b.appendChild(el);
        window.setTimeout(function() {
            if (typeof jQuery == 'undefined') {
                b.removeChild(el);
            } else {
                jQuery(el).fadeOut('slow', function() {
                    jQuery(this).remove();
                });
                if (otherlib) {
                    $jq = jQuery.noConflict();
                    var output = 'url,count\n';
                    $jq('#syndicated-links tbody tr').each(function(_, row) {
                        var anchor = $jq(row).find('td:nth-child(3) a').attr('href');
                        var count = $jq(row).find('td:nth-child(4) div:nth-child(2)');
                        var re = /(\d+) item/;
                        var matches = count.text().match(re);
                        if (matches && matches.length) {
                            output += anchor + ',' + matches[1] + '\n';
                        } else {
                            output += anchor + ',' + '???' + '\n';;
                        }
                    });
                    download('blogcount.csv', output);
                }
            }
        }, 2500);
    }
})();
