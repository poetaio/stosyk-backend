class EmailHTMLs {
    createConfirmationHTML(verificationCode) {
        //todo: move html to different file
        return `<head>
    <title></title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <!--[if mso]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            <o:AllowPNG/>
        </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/>
    <!--<![endif]-->
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
        }

        #MessageViewBody a {
            color: inherit;
            text-decoration: none;
        }

        p {
            line-height: inherit
        }

        .desktop_hide,
        .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
        }

        @media (max-width: 500px) {
            .social_block.desktop_hide .social-table {
                display: inline-block !important;
            }

            .image_block img.big,
            .row-content {
                width: 100% !important;
            }

            .mobile_hide {
                display: none;
            }

            .stack .column {
                width: 100%;
                display: block;
            }

            .mobile_hide {
                min-height: 0;
                max-height: 0;
                max-width: 0;
                overflow: hidden;
                font-size: 0px;
            }

            .desktop_hide,
            .desktop_hide table {
                display: table !important;
                max-height: none !important;
            }

            .row-1 .column-1 .block-12.paragraph_block td.pad > div {
                font-size: 10px !important;
            }

            .row-1 .column-1 .block-12.paragraph_block td.pad,
            .row-1 .column-1 .block-8.paragraph_block td.pad {
                padding: 15px !important;
            }

            .row-1 .column-1 .block-8.paragraph_block td.pad > div {
                font-size: 15px !important;
            }

            .row-1 .column-1 .block-9.paragraph_block td.pad > div {
                text-align: center !important;
                font-size: 13px !important;
            }`
    }

    createResetPassHTML(resetPassCode) {
        return `<h1>Reset password</h1>
        <p>To reset password click the following link:</p>
        <a href=https://www.stosyk.app/resetpass/${resetPassCode}> Click here</a>
        </div>`
    }
}

module.exports = new EmailHTMLs()