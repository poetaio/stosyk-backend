class EmailHTMLs {
    createConfirmationHTML(verificationCode){
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
            }

            .row-1 .column-1 .block-9.paragraph_block td.pad {
                padding: 10px !important;
            }
        }
    </style>
</head>
<body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;"
       width="100%">
    <tbody>
    <tr>
        <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation"
                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fffef3;" width="100%">
                <tbody>
                <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack"
                               role="presentation"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 480px;"
                               width="480">
                            <tbody>
                            <tr>
                                <td class="column column-1"
                                    style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                    width="100%">
                                    <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-2"
                                           role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                           width="100%">
                                        <tr>
                                            <td class="pad"
                                                style="vertical-align: middle; color: #242424; font-family: inherit; font-size: 14px; text-align: center; padding-top: 15px;">
                                                <table align="center" cellpadding="0" cellspacing="0" class="alignment"
                                                       role="presentation"
                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                    <tr>
                                                        <td style="vertical-align: middle; text-align: center; padding-top: 15px; padding-bottom: 15px; padding-left: 15px; padding-right: 15px;">
                                                            <a href="https://www.stosyk.app/"
                                                               style="text-decoration: none;" target="_self"><img
                                                                    align="center" alt="Logo" class="icon" height="32"
                                                                    src="https://i.ibb.co/34M3BX2/logoicon.png"
                                                                    style="display: block; height: auto; margin: 0 auto; border: 0;"
                                                                    width="39"/></a></td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="spacer_block" style="height:15px;line-height:15px;font-size:1px;"> 
                                    </div>
                                    <table border="0" cellpadding="15" cellspacing="0"
                                           class="image_block mobile_hide block-4" role="presentation"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                        <tr>
                                            <td class="pad">
                                                <div align="center" class="alignment" style="line-height:10px"><img
                                                        class="big" src="https://i.ibb.co/fXWXjnf/text-desktop.png"
                                                        alt="Desktop Text"
                                                        style="display: block; height: auto; border: 0; width: 450px; max-width: 100%;"
                                                        width="450"/></div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           class="image_block block-5 desktop_hide" role="presentation"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; mso-hide: all; display: none; max-height: 0; overflow: hidden;"
                                           width="100%">
                                        <tr>
                                            <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                <div align="center" class="alignment" style="line-height:10px"><img
                                                        src="https://i.ibb.co/bF8jt2b/text-mobile.png"
                                                        alt="Mobile text"
                                                        style="display: block; height: auto; border: 0; width: 192px; max-width: 100%;"
                                                        width="192"/></div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" class="image_block block-7"
                                           role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                           width="100%">
                                        <tr>
                                            <td class="pad"
                                                style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:30px;width:100%;">
                                                <div align="center" class="alignment" style="line-height:10px"><img
                                                        src="https://i.ibb.co/bKnHMCs/image.png"
                                                        alt="Image"
                                                        style="display: block; height: auto; border: 0; width: 240px; max-width: 100%;"
                                                        width="240"/></div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="15" cellspacing="0" class="paragraph_block block-8"
                                           role="presentation"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                           width="100%">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#242424;direction:ltr;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;font-size:17px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:center;mso-line-height-alt:30.6px;">
                                                    <p style="margin: 0;"><strong>Дякуємо, що приєдналися до
                                                        Stosyk!</strong></p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="15" cellspacing="0" class="paragraph_block block-9"
                                           role="presentation"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                           width="100%">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#242424;direction:ltr;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:22.5px;">
                                                    <p style="margin: 0;">Щоб завершити реєстрацію та почати
                                                        використовувати свій обліковий запис, підтвердіть свою
                                                        електронну адресу.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" class="image_block block-11"
                                           role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                           width="100%">
                                        <tr>
                                            <td class="pad"
                                                style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:30px;width:100%;">
                                                <div align="center" class="alignment" style="line-height:10px"><a
                                                        href="https://www.stosyk.app/confirm/${verificationCode}" style="outline:none"
                                                        tabindex="-1" target="_blank"><img src="https://i.ibb.co/SdxHp4s/Button.png" alt="Button"
                                                                                           style="display: block; height: auto; border: 0; width: 288px; max-width: 100%;"
                                                                                           width="288"/></a></div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="15" cellspacing="0" class="paragraph_block block-12"
                                           role="presentation"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                           width="100%">
                                        <tr>
                                            <td class="pad">
                                                <div style="color:#242424;direction:ltr;font-family:Roboto, Tahoma, Verdana, Segoe, sans-serif;font-size:11px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:13.2px;">
                                                    <p style="margin: 0;">Якщо Ви вважаєте цей лист помилкою, ігноруйте
                                                        його.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="15" cellspacing="0" class="divider_block block-13"
                                           role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                           width="100%">
                                        <tr>
                                            <td class="pad">
                                                <div align="center" class="alignment">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           role="presentation"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                           width="100%">
                                                        <tr>
                                                            <td class="divider_inner"
                                                                style="font-size: 1px; line-height: 1px; border-top: 2px solid #242424;">
                                                                <span> </span></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <table border="0" cellpadding="0" cellspacing="0" class="social_block block-14"
                                           role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                           width="100%">
                                        <tr>
                                            <td class="pad"
                                                style="padding-bottom:30px;padding-left:15px;padding-right:15px;padding-top:15px;text-align:center;">
                                                <div class="alignment" style="text-align:center;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           class="social-table" role="presentation"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;"
                                                           width="108px">
                                                        <tr>
                                                            <td style="padding:0 2px 0 2px;"><a
                                                                    href="https://instagram.com/stosyk.app?igshid=NTlmMWMyMzg="
                                                                    target="_blank"><img alt="Instagram" height="32"
                                                                                         src="https://i.ibb.co/RNNqfnC/instagram2x.png"
                                                                                         style="display: block; height: auto; border: 0;"
                                                                                         title="instagram" width="32"/></a>
                                                            </td>
                                                            <td style="padding:0 2px 0 2px;"><a
                                                                    href="https://www.facebook.com/stosyk"
                                                                    target="_blank"><img alt="Facebook" height="32"
                                                                                         src="https://i.ibb.co/MGk00fv/facebook2x.png"
                                                                                         style="display: block; height: auto; border: 0;"
                                                                                         title="facebook"
                                                                                         width="32"/></a></td>
                                                            <td style="padding:0 2px 0 2px;"><a
                                                                    href="https://www.linkedin.com/company/stosyk/"
                                                                    target="_blank"><img alt="Linkedin" height="32"
                                                                                         src="https://i.ibb.co/2Wd1pqY/linkedin2x.png"
                                                                                         style="display: block; height: auto; border: 0;"
                                                                                         title="linkedin"
                                                                                         width="32"/></a></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table><!-- End -->
</body>`
    }

    createInviteStudentHTML = (schoolName, inviteToken) => `
            <div>
                Hey! You've been invited to ${schoolName}
                To accept invitation please follow the link:
            </div>
            <a href=https://www.stosyk.app/accept-invite/${inviteToken}> Click here</a>
    `
}

module.exports = new EmailHTMLs();
