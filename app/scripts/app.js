/*
 Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function (document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function () {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    document.querySelector('#caching-complete').show();
  };
  app.selected = 0;

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function () {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function () {
    // imports are loaded and elements have been registered
  });

  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function (e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1 - maxMiddleScale)) + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function () {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function () {
    document.getElementById('mainContainer').scrollTop = 0;
  };

  // return all gsx$_*
  app.getPropertyByRegex = function (obj) {
    var re = new RegExp('^(gsx\\$_)'), key, data = [];
    for (key in obj) {
      if (re.test(key)) {
        data.push(obj[key]);
      }
    }
    return data; // put your default "not found" return value here
  };
  // filter buttons for toolbar
  app.onlyButton = function (item) {
    item.dataForRepeat = app.getPropertyByRegex(item);
    item['paper-menu-button'] = (item.dataForRepeat.length > 1);
    return item.gsx$showintoolbar.$t === 'TRUE';
  };
  // filter for stock
  app.onlyStock = function (item) {
    item.dataForRepeat = app.getPropertyByRegex(item);
    return item.title.$t === 'Акция';
  };
  //action in toolbar for one button
  app.onTapAction = function (item) {
    window.location = item.model.item.gsx$httpaction.$t + item.model.item.dataForRepeat[0].$t;
  };
  //action in toolbar for menu button
  app.onTapActionMenu = function (item) {
    window.location = item.model.item.gsx$httpaction.$t + item.model.data.$t;
  };
  // var to markdown h3
  app.mdeH3 = function (item) {
    return '### ' + item + ' ###';
  };
  app.mdePoint = function (item) {
    return '* ' + item;
  };
})(document);
