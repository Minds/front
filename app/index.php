<html>
  <head>

    <base href="/" />
    <link rel="icon" type="image/png" href="/assets/icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">

    <?php
      $meta = Minds\Core\SEO\Manager::get();
      foreach($meta as $name => $content){
        $name = strip_tags($name);
        $content = strip_tags($content);
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


    <link rel="stylesheet" href="https://storage.googleapis.com/code.getmdl.io/1.0.5/material.blue_grey-amber.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:400,700'>
    <script src="//storage.googleapis.com/code.getmdl.io/1.0.5/material.min.js"></script>
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


    <!-- The app component created in app.ts -->
    <minds-app  class="">
      <div class="mdl-progress mdl-progress__indeterminate initial-loading is-upgraded">
        <div class="progressbar bar bar1" style="width: 0%;"></div>
        <div class="bufferbar bar bar2" style="width: 100%;"></div>
        <div class="auxbar bar bar3" style="width: 0%;"></div>
      </div>
    </minds-app>

    <!-- shims:js -->
  	<!-- endinject -->

     <script>System.config(<%= JSON.stringify(SYSTEM_CONFIG) %>)</script>

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
    <script src="//tinymce.cachefly.net/4.2/tinymce.min.js"></script>

    <script>
      <?php
          $minds = array(
              "LoggedIn" => Minds\Core\Session::isLoggedIn() ? true : false,
              "Admin" => Minds\Core\Session::isAdmin() ? true : false,
              "cdn_url" => Minds\Core\Config::_()->get('cdn_url') ?: Minds\Core\Config::_()->cdn_url,
              "site_url" => Minds\Core\Config::_()->get('site_url') ?: Minds\Core\Config::_()->site_url,
              "socket_server" => Minds\Core\Config::_()->get('sockets-server-uri') ?: 'ha-socket-io-us-east-1.minds.com:3030',
              "navigation" => Minds\Core\Navigation\Manager::export()
            );
          if(Minds\Core\Session::isLoggedIn()){
              $minds['user'] = Minds\Core\Session::getLoggedinUser()->export();
              $minds['user']['chat'] = (bool) elgg_get_plugin_user_setting('option', Minds\Core\Session::getLoggedinUser()->guid, 'gatherings') == 1 ? true : false;
              $minds['wallet'] = array('balance' => Minds\Helpers\Counters::get(Minds\Core\Session::getLoggedinUser()->guid, 'points', false));
          }
      ?>
      window.Minds = <?= json_encode($minds) ?>;

      System.import('<%= BOOTSTRAP_MODULE %>')
        .catch(function(){console.error(e,'Report this error at https://github.com/minds/front')});

    </script>

    <!-- inject:js -->
  	<!-- endinject -->

  </body>
</html>
