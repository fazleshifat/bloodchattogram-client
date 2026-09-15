import { useEffect } from 'react';

export default function ChannelTalk() {
    useEffect(() => {
        const channelIO = () => {
            (function () {
                var w = window;
                if (w.ChannelIO) return w.console.error("ChannelIO script included twice.");
                var ch = function () { ch.c(arguments); };
                ch.q = [];
                ch.c = function (args) { ch.q.push(args); };
                w.ChannelIO = ch;

                function l() {
                    if (w.ChannelIOInitialized) return;
                    w.ChannelIOInitialized = true;
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    s.async = true;
                    s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
                    var x = document.getElementsByTagName("script")[0];
                    if (x.parentNode) x.parentNode.insertBefore(s, x);
                }

                if (document.readyState === "complete") l();
                else {
                    w.addEventListener("DOMContentLoaded", l);
                    w.addEventListener("load", l);
                }
            })();

            window.ChannelIO('boot', {
                // pluginKey: "56a00be9-a621-4c5a-a9f5-2c5c8bd4bfca"
                pluginKey: "d69dc840-288e-4ed3-a1fa-d64ee3a54725"
            });
        };

        channelIO();

        return () => {
            if (window.ChannelIO) {
                window.ChannelIO('shutdown');
            }
        };
    }, []);

    return null;
}