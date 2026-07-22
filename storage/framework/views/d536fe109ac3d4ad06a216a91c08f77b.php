<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    >

    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <meta name="theme-color" content="#071426">

    <meta
        name="description"
        content="Quanta Reach Solutions builds websites, software, mobile products, design systems, cloud solutions, and measurable digital growth experiences."
    >

    <meta
        name="application-name"
        content="Quanta Reach Solutions"
    >

    <title>
        Quanta Reach Solutions | Digital Solutions for Global Growth
    </title>

    
    <link
        rel="icon"
        href="<?php echo e(asset('assets/favicon.ico')); ?>"
        sizes="any"
    >

    <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="<?php echo e(asset('assets/favicon-32x32.png')); ?>"
    >

    <link
        rel="apple-touch-icon"
        href="<?php echo e(asset('assets/apple-touch-icon.png')); ?>"
    >

    <link
        rel="manifest"
        href="<?php echo e(asset('site.webmanifest')); ?>"
    >

    
    <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
    >

    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
    >

    
    <link
        rel="stylesheet"
        href="<?php echo e(asset('assets/app.css')); ?>"
    >

    <style>
        html,
        body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            background: #071426;
            font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
            overflow-x: hidden;
        }

        #root {
            min-height: 100vh;
        }

        .qrs-loading-error {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            color: #ffffff;
            background: #071426;
            text-align: center;
            box-sizing: border-box;
        }

        .qrs-loading-error h1 {
            margin: 0;
            font-family: 'Inter', sans-serif;
            font-size: 28px;
            font-weight: 800;
        }

        .qrs-loading-error p {
            max-width: 560px;
            margin: 12px auto 0;
            color: #9aa6b6;
            line-height: 1.7;
        }

        .qrs-loading-error button {
            margin-top: 20px;
            border: 0;
            border-radius: 999px;
            padding: 12px 22px;
            background: #168bff;
            color: #071426;
            font-weight: 800;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <noscript>
        <main class="qrs-loading-error">
            <div>
                <h1>JavaScript Required</h1>

                <p>
                    Quanta Reach Solutions চালানোর জন্য browser-এ
                    JavaScript enable করতে হবে।
                </p>
            </div>
        </main>
    </noscript>

    <div id="root"></div>

    <script>
        globalThis.__QRS_ENV__ = {
            API_BASE: <?php echo json_encode(url('/api'), 15, 512) ?>,
            SITE_URL: <?php echo json_encode(url('/'), 15, 512) ?>,
            LARAVEL_BACKEND: true
        };

        globalThis.__QRS_APP_LOADED__ = false;

        globalThis.__showQrsLoadingError = function (message) {
            const root = document.getElementById('root');

            if (!root || root.hasChildNodes()) {
                return;
            }

            const wrapper = document.createElement('main');
            wrapper.className = 'qrs-loading-error';

            const content = document.createElement('div');

            const heading = document.createElement('h1');
            heading.textContent = 'Quanta Reach Solutions';

            const paragraph = document.createElement('p');
            paragraph.textContent =
                message ||
                'The application could not finish loading. Please reload the page.';

            const reloadButton = document.createElement('button');
            reloadButton.type = 'button';
            reloadButton.textContent = 'Reload';
            reloadButton.addEventListener('click', function () {
                window.location.reload();
            });

            content.appendChild(heading);
            content.appendChild(paragraph);
            content.appendChild(reloadButton);
            wrapper.appendChild(content);
            root.appendChild(wrapper);
        };
    </script>

    
    <script type="module">
        const applicationUrl = <?php echo json_encode(asset('build/app.js'), 15, 512) ?>;

        import(applicationUrl)
            .then(function () {
                globalThis.__QRS_APP_LOADED__ = true;
            })
            .catch(function (error) {
                console.error(
                    'Quanta Reach Solutions application failed to load:',
                    error
                );

                globalThis.__showQrsLoadingError(
                    'The application could not finish loading. Open the browser console to view the technical error.'
                );
            });
    </script>

    <script>
        window.setTimeout(function () {
            const root = document.getElementById('root');

            if (
                !globalThis.__QRS_APP_LOADED__ &&
                root &&
                !root.hasChildNodes()
            ) {
                globalThis.__showQrsLoadingError(
                    'The application took too long to start. Please reload the page.'
                );
            }
        }, 15000);
    </script>
</body>
</html><?php /**PATH C:\Users\Arnab\Quanta Reach Solutions\resources\views/app.blade.php ENDPATH**/ ?>