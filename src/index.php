<?php
    /** @var \Minds\Core\Front\Index $index */
    $index = \Minds\Core\Di\Di::_()->get('Front\Index');
    $context = $index->getContext();
?>
<html>
<head>
    <base href="/"/>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1,user-scalable=no">

    <?php echo $index->getMetaHtml() ?>

    <title><?php echo $index->getTitle() ?></title>

    <script>
        var ua = window.navigator.userAgent;
        if (
            ua.indexOf("MSIE") > -1 ||
            (ua.indexOf("Android 4.3") > -1 && !(ua.indexOf('Chrome') > -1)) //android 4.3, but not chrome browser
        ) {
            window.location.href = '/not-supported';
        }
    </script>

    <!-- inject:css -->
    <!-- endinject -->

    <?php echo $index->getHeadHtml() ?>
</head>
<body>


<?php if ($context === 'embed'): ?>
    <!-- The embed component created in embed.ts -->
    <minds-embed></minds-embed>
<?php else: ?>
    <!-- The app component created in app.ts -->
    <m-app class="">
        <div class="mdl-progress mdl-progress__indeterminate initial-loading is-upgraded">
            <div class="progressbar bar bar1" style="width: 0%;"></div>
            <div class="bufferbar bar bar2" style="width: 100%;"></div>
            <div class="auxbar bar bar3" style="width: 0%;"></div>
        </div>

        <div class="m-initial-loading-centred" style="width:100%; text-align:center; margin: 100px auto;">
            <div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active is-upgraded"
                 style="width: 64px;height: 64px;" data-upgraded=",MaterialSpinner">
                <div class="mdl-spinner__layer mdl-spinner__layer-1">
                    <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                    <div class="mdl-spinner__gap-patch">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                    <div class="mdl-spinner__circle-clipper mdl-spinner__right">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                </div>
                <div class="mdl-spinner__layer mdl-spinner__layer-2">
                    <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                    <div class="mdl-spinner__gap-patch">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                    <div class="mdl-spinner__circle-clipper mdl-spinner__right">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                </div>
                <div class="mdl-spinner__layer mdl-spinner__layer-3">
                    <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                    <div class="mdl-spinner__gap-patch">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                    <div class="mdl-spinner__circle-clipper mdl-spinner__right">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                </div>
                <div class="mdl-spinner__layer mdl-spinner__layer-4">
                    <div class="mdl-spinner__circle-clipper mdl-spinner__left">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                    <div class="mdl-spinner__gap-patch">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                    <div class="mdl-spinner__circle-clipper mdl-spinner__right">
                        <div class="mdl-spinner__circle"></div>
                    </div>
                </div>
            </div>
        </div>
    </m-app>
<?php endif; ?>


<script>
    function module() {} // Fixes undefined module function in SystemJS bundle
</script>

<!-- shims:js -->
<!-- endinject -->

<!-- libs:js -->
<!-- endinject -->

<?php echo $index->getTailHtml() ?>

</body>
</html>
