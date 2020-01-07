(function (window) {
    class Zarinak {
        constructor() {
            this.authority = '';
            this.body = document.body;
            this.targetUrl = 'https://www.zarinpal.com/pg/StartPay/';
            this.iframeId = 'Zarinak';
            this.zarinGate = 'ZarinGate';
            this.callBack = null;

            if (window.addEventListener) {
                addEventListener('message', this.receiveMessage, false);
            } else {
                attachEvent('onmessage', this.receiveMessage);
            }
        }

        setAuthority(input) {
            this.authority = input;
        }

        setCallBack(callback) {
            this.callBack = callback;
        }

        open() {
            if (this.authority === '' || this.authority === null || this.authority === undefined) {
                console.log('Authority is empty');
                return false;
            }

//             if (isNaN(this.authority)) {
//                 console.log('Authority is invalid');
//                 return false;
//             }

            let isMobile = {
                /**
                 * @return {boolean}
                 */
                Windows() {
                    return /IEMobile/i.test(navigator.userAgent);
                },
                /**
                 * @return {boolean}
                 */
                Android() {
                    return /Android/i.test(navigator.userAgent);
                },
                /**
                 * @return {boolean}
                 */
                BlackBerry() {
                    return /BlackBerry/i.test(navigator.userAgent);
                },
                /**
                 * @return {boolean}
                 */
                iOS() {
                    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
                },
                /**
                 * @return {boolean}
                 */
                any() {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
                }
            };

            let isOldAndroid = (
                (
                    navigator.userAgent.indexOf('Mozilla/5.0') > -1
                    && navigator.userAgent.indexOf('Android 4.3') > -1
                    && navigator.userAgent.indexOf('AppleWebKit') > -1
                )
                && !(navigator.userAgent.indexOf('Chrome') > -1)
            );

            if (isMobile.any()) {
                window.location.href = this.targetUrl + this.authority + '/' + this.iframeId;
            } else if (isOldAndroid) {
                window.location.href = this.targetUrl + this.authority + '/' + this.zarinGate;
            } else {
                let iframe = document.createElement('iframe');
                iframe.src = this.targetUrl + this.authority + '/' + this.iframeId;
                iframe.id = this.iframeId;
                iframe.name = this.iframeId;
                iframe.frameBorder = "0";
                iframe.allowTransparency = "true";
                iframe.style.backgroundColor = 'transparent';
                iframe.style.zIndex = '99999999';
                iframe.style.display = 'block';
                iframe.style.border = '0px none transparent';
                iframe.style.overflowX = 'hidden';
                iframe.style.overflowY = 'auto';
                iframe.style.visibility = 'visible';
                iframe.style.margin = '0 0 0 0';
                iframe.style.padding = '0 0 0 0';
                iframe.style.webkitTapHighlightColor = 'transparent';
                iframe.style.position = 'fixed';
                iframe.style.left = '0px';
                iframe.style.top = '0px';
                iframe.style.width = '100%';
                iframe.style.height = '100%';

                //console.log(urlParams, urlParams.join('/'), body);
                this.body.insertBefore(iframe, this.body.firstChild);
            }
        };

        close(href) {
            let iframe = document.getElementById(this.iframeId);
            iframe.parentElement.removeChild(iframe);

            if (this.callBack !== null) {
                let parsed = this.parseURL(href);
                this.callBack(parsed.searchObject['Authority'], parsed.searchObject['Status']);

                return;
            }

            if (href !== null) {
                window.location = href;
            }
        }

        receiveMessage(event) {
            if (event.data.action === 'Close') {
                window.Zarinak.close(event.data.href);
            }
        }

        parseURL(url) {
            var parser = document.createElement('a'),
                searchObject = {},
                queries, split, i;
            // Let the browser do the work
            parser.href = url;
            // Convert query string to object
            queries = parser.search.replace(/^\?/, '').split('&');
            for (i = 0; i < queries.length; i++) {
                split = queries[i].split('=');
                searchObject[split[0]] = split[1];
            }
            return {
                protocol: parser.protocol,
                host: parser.host,
                hostname: parser.hostname,
                port: parser.port,
                pathname: parser.pathname,
                search: parser.search,
                searchObject: searchObject,
                hash: parser.hash
            };
        }
    }

    if (typeof window.Zarinak === 'undefined') {
        window.Zarinak = new Zarinak();
        let checkout = document.getElementById('zarinak-checkout');
        if (checkout !== null) {
            let authority = checkout.getAttribute('data-authority');
            if (authority !== null) {
                window.Zarinak.setAuthority(authority);
                window.Zarinak.open();
            }
        }
    }

})(window);

