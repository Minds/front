<?php
    if (!defined('__MINDS_CONTEXT__')) {
        define('__MINDS_CONTEXT__', 'app');
    }
?>
<html>
  <head>

    <base href="/" />
    <link rel="icon" type="image/png" href="/assets/icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">

    <?php
      $meta = Minds\Core\SEO\Manager::get();
      foreach($meta as $name => $content){
        $name = strip_tags($name);
        $content = str_replace(['"'], '\'', $content);
        switch($name){
          case "title":
            echo "<title>$content | Minds</title>\n";
            break;
          case strpos($name, ":") !== FALSE:
            echo "<meta property=\"$name\" content=\"$content\">\n";
            break;
          default:
            echo "<meta name=\"$name\" content=\"$content\">\n";
        }
      }
    ?>


    <link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.1.2/material.blue_grey-amber.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:400,700'>
    <script src="//storage.googleapis.com/code.getmdl.io/1.1.2/material.min.js"></script>
    <!-- inject:css -->
    <!-- endinject -->

    <script>
      var ua = window.navigator.userAgent;
      if(ua.indexOf("MSIE") > -1 ||
        (ua.indexOf("Android 4.3") > -1 && !(ua.indexOf('Chrome') > -1)) //android 4.3, but not chrome browser
        ){
          window.location.href = window.location.href.replace('<?= Minds\Core\Config::_()->get('site_url') ?>', 'https://legacy.minds.com/');
      }
    </script>

  </head>
  <body>


    <?php if (__MINDS_CONTEXT__ === 'embed'): ?>
        <!-- The embed component created in embed.ts -->
        <minds-embed></minds-embed>
    <?php else: ?>
        <!-- The app component created in app.ts -->
        <minds-app class="">
          <div class="mdl-progress mdl-progress__indeterminate initial-loading is-upgraded">
            <div class="progressbar bar bar1" style="width: 0%;"></div>
            <div class="bufferbar bar bar2" style="width: 100%;"></div>
            <div class="auxbar bar bar3" style="width: 0%;"></div>
          </div>

          <div class="m-initial-loading-centred" style="width:100%; text-align:center; margin: auto;">
            <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active is-upgraded" style="width: 64px;height: 64px;" data-upgraded=",MaterialSpinner">
              <div class="mdl-spinner__layer mdl-spinner__layer-1">
                <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                  <div class="mdl-spinner__circle"></div>
                </div><div class="mdl-spinner__gap-patch"><div class="mdl-spinner__circle"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle"></div></div>
              </div>
              <div class="mdl-spinner__layer mdl-spinner__layer-2">
                <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                  <div class="mdl-spinner__circle"></div>
                </div><div class="mdl-spinner__gap-patch"><div class="mdl-spinner__circle"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle"></div></div>
              </div>
              <div class="mdl-spinner__layer mdl-spinner__layer-3">
                <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                  <div class="mdl-spinner__circle"></div>
                </div><div class="mdl-spinner__gap-patch"><div class="mdl-spinner__circle"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle"></div></div>
              </div>
              <div class="mdl-spinner__layer mdl-spinner__layer-4">
                <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                  <div class="mdl-spinner__circle"></div>
                </div><div class="mdl-spinner__gap-patch"><div class="mdl-spinner__circle"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle"></div></div>
              </div>
            </div>
          </div>
        </minds-app>
    <?php endif; ?>


    <script>
      // Fixes undefined module function in SystemJS bundle
      function module() {}
    </script>

    <!-- shims:js -->
  	<!-- endinject -->

    <!-- libs:js -->
  	<!-- endinject -->

    <!-- Google Analytics -->
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    </script>
    <!-- End Google Analytics -->
    <script src="https://cdn.tinymce.com/4/tinymce.min.js"></script>

    <script>
      <?php
          $minds = array(
              "MindsContext" => __MINDS_CONTEXT__,
              "LoggedIn" => Minds\Core\Session::isLoggedIn() ? true : false,
              "Admin" => Minds\Core\Session::isAdmin() ? true : false,
              "cdn_url" => Minds\Core\Config::_()->get('cdn_url') ?: Minds\Core\Config::_()->cdn_url,
              "site_url" => Minds\Core\Config::_()->get('site_url') ?: Minds\Core\Config::_()->site_url,
              "socket_server" => Minds\Core\Config::_()->get('sockets-server-uri') ?: 'ha-socket-io-us-east-1.minds.com:3030',
              "navigation" => Minds\Core\Navigation\Manager::export()
            );
          if(Minds\Core\Session::isLoggedIn()){
              $minds['user'] = Minds\Core\Session::getLoggedinUser()->export();
              $minds['wallet'] = array('balance' => Minds\Helpers\Counters::get(Minds\Core\Session::getLoggedinUser()->guid, 'points', false));
          }

          if (__MINDS_CONTEXT__ === 'embed') {
              $minds['MindsEmbed'] = $embedded_entity;
          }
      ?>
      window.Minds = <?= json_encode($minds) ?>;
    </script>

    <!-- inject:js -->
  	<!-- endinject -->

    <% if (ENV === 'dev') { %>
    <script>
      System.import('<%= BOOTSTRAP_MODULE %>')
        .catch(function(){console.error(e,'Report this error at https://github.com/minds/front')});
    </script>
    <% } %>

  </body>
</html>
