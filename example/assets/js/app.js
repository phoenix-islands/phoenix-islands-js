/* eslint-disable @typescript-eslint/no-unused-vars */
// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"
import 'phoenix_html';

import { registerDataIslands } from '@phoenix-islands/data';
import { ProxyIsland } from '@phoenix-islands/proxy';
import { registerReactIslands } from '@phoenix-islands/react';
import { Socket } from 'phoenix';
import { LiveSocket } from 'phoenix_live_view';

import topbar from '../vendor/topbar';
import { ReactCounter } from './react/ReactCounter';
import { ReactSharedCounter } from './react/ReactSharedCounter';
import { ReactProxyCounter } from './react/ReactProxyCounter';

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
// Establish Phoenix Socket and LiveView configuration.

const csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");

const proxy = new ProxyIsland("#continent");


const liveSocket = new LiveSocket("/live", Socket, {
  params: { _csrf_token: csrfToken },
  hooks: {
    ...registerReactIslands({ ReactCounter, ReactSharedCounter, ReactProxyCounter }),
    ...registerDataIslands({
      Logger: {
        subscribe(store, globalStore) {
          // return globalStore.subscribe((data) => {
          //   console.log(data);
          // });
        },
      },
    }, { tunnel: true }),
  },
});

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => topbar.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => topbar.hide());

// connect if there are any LiveViews on the page
liveSocket.connect();
// liveSocket.enableDebug();
// liveSocket.enableProfiling();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;
