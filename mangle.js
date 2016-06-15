
var mangle = {
    render: function(target, data) {
        if (target === 'app') {
            target = mangle.config.appContainer;
        }
        document.getElementById(target).innerHTML = data();
    },
    addSpinner: function(){
      document.body.className+=' wait';
    },
    removeSpinner: function(){
      var rep = document.body.className.replace(/wait/g, '');
      document.body.className = rep;
    },
    dataMap: function(data,map) {
      data = data.map(map);
      data = data.join('');
      return data;
    },
    reduce: function(arr){
      let val = arr.reduce(function(a, b) {
        return a + b;
      });
      return val;
    },
    defaultRequestHeader: {},
    getData: function(source,cb) {
      mangle.addSpinner();
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          mangle.removeSpinner();
          var data;
          if (typeof xhttp.responseText === "string"){
            data = JSON.parse(xhttp.responseText);
          }
          else {
            data = xhttp.responseText;
          }
         cb(data);
        }
      };
      xhttp.open("GET", source, true);
      if(mangle.defaultRequestHeader.type){
        xhttp.setRequestHeader(mangle.defaultRequestHeader.type, mangle.defaultRequestHeader.value);
      }
      xhttp.send();
    },

    getCookie: function(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
      }
      return "";
    },
    postData: function(source,data,cb) {
      mangle.addSpinner();
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          mangle.removeSpinner();
          var data;
          if (typeof xhttp.responseText === "string"){
            data = JSON.parse(xhttp.responseText);
          }
          else {
            data = xhttp.responseText;
          }
         return cb(data);
        }
        if (xhttp.readyState == 4 && xhttp.status == 401) {
          mangle.removeSpinner();
          var data ={};
          if (typeof xhttp.responseText  === "string"){
            data = JSON.parse(xhttp.responseText);
          }
          else {
            data = xhttp.responseText;
          }
         return cb(data);
        }
      };
      xhttp.open("POST", source, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      if(mangle.defaultRequestHeader.type){
        xhttp.setRequestHeader(mangle.defaultRequestHeader.type, mangle.defaultRequestHeader.value);
      }
      xhttp.send(data);
    },
    get: function(source){
      return document.getElementById(source);
    },
    deleteData: function(source,cb) {
      mangle.addSpinner();
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          mangle.removeSpinner();
          var data;
          if (typeof xhttp.responseText === "string"){
            data = JSON.parse(xhttp.responseText);
          }
          else {
            data = xhttp.responseText;
          }
         cb(data);
        }
      };
      xhttp.open("DELETE", source, true);
      if(mangle.defaultRequestHeader.type){
        xhttp.setRequestHeader(mangle.defaultRequestHeader.type, mangle.defaultRequestHeader.value);
      }
      xhttp.send();
    },
    getHtml: function(source) {
      return document.getElementById(source).innerHTML;
    },
    clickEvent: function(source, cb) {
      if(source.substring(0,1)==='#'){
        source = source.substring(1,source.length);
        document.getElementById(source).onclick = function() {
            cb();
        };
      }
      if(source.substring(0,1)==='.'){
        source = source.substring(1,source.length);
        var elements = document.getElementsByClassName(source);
        for (var i=0; i < elements.length; i++) {
          elements[i].onclick = function(){
            cb(this);
          }
        }
      }
    },
    onSubmit: function(source, f){
      document.getElementById(source).onsubmit = function(e) {
        e.preventDefault();
        f();
      }
    },
    value: function(source,newValue){
      if (typeof newValue !== "undefined"){
        document.getElementById(source).value = newValue;
        return document.getElementById(source).value
      }
        return document.getElementById(source).value;
    },
    keyEvent: function(source, type, amt, cb) {
      source = source.substring(1,source.length);
        document.getElementById(source).addEventListener("keyup", function() {
          if(type==='>='){
            if(mangle.value(source).length >= amt){
              cb(mangle.value(source));
            }
          }
          if(type==='<='){
            if(mangle.value(source).length <= amt){
              cb(mangle.value(source));
            }
          }
          if(type==='==='){
            if(mangle.value(source).length === amt){
              cb(mangle.value(source));
            }
          }
          if(type==='<'){
            if(mangle.value(source).length < amt){
              cb(mangle.value(source));
            }
          }
          if(type==='>'){
            if(mangle.value(source).length > amt){
              cb(mangle.value(source));
            }
          }
        });
    },
    location: function(location) {
      window.location.assign(location);
    },
    routeProcess: function(cb) {
      cb();
    },

    state: {},

    data: {},

    config: {
        appContainer: '',
        defaultRoute: ''
    },

    routes: {},

    userFunctions: {},

    route: function(f) {
        mangle.data = {};
        mangle.state.currentRoute = f.name;
        f.action();
    },

    app: function(cb) {
        var routeList = [];
        var route = '';
        var routeListLoop = function(x) {
            if (x < Object.keys(mangle.routes).length) {
                route = (mangle.routes[Object.keys(mangle.routes)[x]]);
                routeList.push({
                    route: Object.keys(mangle.routes)[x],
                    path: route.path
                });
                x++;
                routeListLoop(x);
            }
        };
        var currentRoute = {};
        var verifyRoute = function(item, index) {
            if (item.path === window.location.hash.substring(1)) {
              //FIX THIS IT IS CURRENTLY SETTING THIS TO BE THE LAST ROUTE
                currentRoute = item.route
                    //mangle.route(mangle.routes[currentRoute.route]);
            }
        };
        var resolveRoute = function() {
          mangle.routeProcess(function(){
            if (Object.keys(currentRoute).length === 0) {
                return mangle.route(mangle.routes[mangle.config.defaultRoute]);
            }
            return mangle.route(mangle.routes[currentRoute]);
          })
        }
        routeListLoop(0);
        routeList.map(verifyRoute);
        resolveRoute();

        window.onhashchange = function() {
          currentRoute={};
          routeListLoop(0);
          routeList.map(verifyRoute);
          resolveRoute();
        }
    }
}
