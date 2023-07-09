const mailHtml = (
  name,
  body,
  header,
  emailSentTo,
  buttonText,
  buttonLink,
  secondButtonText,
  secondButtonLink
) => {
  return `
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <title></title>

    <style type="text/css">
        @media only screen and (min-width: 620px) {
            .u-row {
                width: 600px !important;
            }

            .u-row .u-col {
                vertical-align: top;
            }

            .u-row .u-col-100 {
                width: 600px !important;
            }
        }

        @media (max-width: 620px) {
            .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
            }

            .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
            }

            .u-row {
                width: 100% !important;
            }

            .u-col {
                width: 100% !important;
            }

            .u-col>div {
                margin: 0 auto;
            }
        }

        body {
            margin: 0;
            padding: 0;
        }

        table,
        tr,
        td {
            vertical-align: top;
            border-collapse: collapse;
        }

        p {
            margin: 0;
        }

        .ie-container table,
        .mso-container table {
            table-layout: fixed;
        }

        * {
            line-height: inherit;
        }

        a[x-apple-data-detectors="true"] {
            color: inherit !important;
            text-decoration: none !important;
        }

        table,
        td {
            color: #000000;
        }

        #u_body a {
            color: #0000ee;
            text-decoration: underline;
        }
    </style>

    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css" />
    <!--<![endif]-->
</head>

<body class="clean-body u_body" style="
      margin: 0;
      padding-top: 30px;
      -webkit-text-size-adjust: 100%;
      background-color: #ffffff;
      color: #000000;
    ">
    <!--[if IE]><div class="ie-container"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table id="u_body" style="
        border-collapse: collapse;
        table-layout: fixed;
        border-spacing: 0;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        vertical-align: top;
        min-width: 320px;
        margin: 0 auto;
        background-color: #ffffff;
        width: 100%;
      " cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="
              word-break: break-word;
              border-collapse: collapse !important;
              vertical-align: top;
            ">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->

                    <div class="u-row-container" style="padding: 0px; background-color: transparent">
                        <div class="u-row" style="
                  margin: 0 auto;
                  min-width: 320px;
                  max-width: 600px;
                  overflow-wrap: break-word;
                  word-wrap: break-word;
                  word-break: break-word;
                  background-color: #ffffff;
                ">
                            <div style="
                    border-collapse: collapse;
                    display: table;
                    width: 100%;
                    height: 100%;
                    background-color: transparent;
                  ">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="598" style="background-color: #626ed4;width: 598px;padding: 0px;border-top: 1px solid #CCC;border-left: 1px solid #CCC;border-right: 1px solid #CCC;border-bottom: 1px solid #CCC;" valign="top"><![endif]-->
                                <div class="u-col u-col-100" style="
                      max-width: 320px;
                      min-width: 600px;
                      display: table-cell;
                      vertical-align: top;
                    ">
                                    <div style="
                        background-color: #626ed4;
                        height: 100%;
                        width: 100% !important;
                      ">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="
                          box-sizing: border-box;
                          height: 100%;
                          padding: 0px;
                          border-top: 1px solid #ccc;
                          border-left: 1px solid #ccc;
                          border-right: 1px solid #ccc;
                          border-bottom: 1px solid #ccc;
                        ">
                                            <!--<![endif]-->

                                            <table style="font-family: 'Cabin', sans-serif" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 10px;
                                  font-family: 'Cabin', sans-serif;
                                " align="left">
                                                            <table width="100%" cellpadding="0" cellspacing="0"
                                                                border="0">
                                                                <tr>
                                                                    <td style="
                                        padding-right: 0px;
                                        padding-left: 0px;
                                        margin-top: 40px;
                                    
                                      ">
                                      <img border="0" src="https://api.padashboard.ca/Logo.png" alt="" title=""
                                      style="
  
    outline: none;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
    clear: both;
    display: inline-block !important;
    border: none;
    height: 60px;
    float: none;
    width: 100%;
    margin: 50px 0px 10px 45px;
    max-width: 230px;
  " width="580" />
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table style="font-family: 'Cabin', sans-serif" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 10px;
                                  
                               
                                  font-family: 'Cabin', sans-serif;
                                ">
                                                            <h1 style="
                                                            
                                    margin: 0px 45px;
                                    color: #ffffff;
                                    line-height: 140%;
                                    text-align: left;
                                    word-wrap: break-word;
                                    font-size: 25px;
                                    font-weight: bold;
                                  ">
                                                                 ${header}
                                                            </h1>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table style="font-family: 'Cabin', sans-serif" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 5px;
                                  font-family: 'Cabin', sans-serif;
                                " align="left">
                                                            <table height="0px" border="0" cellpadding="0"
                                                                cellspacing="0" width="100%" style="
                                    border-collapse: collapse;
                                    table-layout: fixed;
                                    border-spacing: 0;
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    vertical-align: top;
                                    border-top: 2px solid #ffffff;
                                    -ms-text-size-adjust: 100%;
                                    -webkit-text-size-adjust: 100%;
                                    width: 300px;
                                    margin: 0px 50px 20px 50px;
                                  ">
                                                                <tbody>
                                                                    <tr style="vertical-align: top">
                                                                        <td style="
                                          word-break: break-word;
                                          border-collapse: collapse !important;
                                          vertical-align: top;
                                          font-size: 0px;
                                          line-height: 0px;
                                          mso-line-height-rule: exactly;
                                          -ms-text-size-adjust: 100%;
                                          -webkit-text-size-adjust: 100%;
                                        ">
                                                                            <span>&#160;</span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table style="font-family: 'Cabin', sans-serif" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 0px 55px;
                                  font-family: 'Cabin', sans-serif;
                                " align="left">
                                                            <div style="
                                    color: #ffffff;
                                    line-height: 160%;
                                
                                    word-wrap: break-word;
                                  ">
                                                                <p style="line-height: 160%">
                                                                <h3 style="
                                     
                                        line-height: 10.2px;
                                      ">Hello ${name},</h3>
                                                                </p>
                                                                <p style="line-height: 160%">
                                                                    ${body}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table style="font-family: 'Cabin', sans-serif" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 10px;
                                  font-family: 'Cabin', sans-serif;
                                " align="left">
                                                            <!--[if mso
                                  ]><style>
                                    .v-button {
                                      background: transparent !important;
                                    }
                                  </style><!
                                [endif]-->
                                                            <div style="margin-bottom: 30px;">
                                                                <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:44px; v-text-anchor:middle; width:180px;" arcsize="9%"  stroke="f" fillcolor="#ffffff"><w:anchorlock/><center style="color:#626ed4;font-family:'Cabin',sans-serif;"><![endif]-->
                                                                <a href=${buttonLink} target="_blank" class="v-button" style="
                                      box-sizing: border-box;
                                      display: inline-block;
                                      font-family: 'Cabin', sans-serif;
                                      text-decoration: none;
                                      -webkit-text-size-adjust: none;
                                      margin: 15px 45px 0px 45px;
                                      color: #626ed4;
                                      background-color: #ffffff;
                                      border-radius: 4px;
                                      -webkit-border-radius: 4px;
                                      -moz-border-radius: 4px;
                                      width: auto;
                                      max-width: 100%;
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      word-wrap: break-word;
                                      mso-border-alt: none;
                                      font-size: 14px;
                                    ">
                                                                    <span style="
                                        display: block;
                                        padding: 14px 44px 13px;
                                        line-height: 120%;
                                      ">${buttonText}</span>
                                                                </a>
                                                                <!--[if mso]></center></v:roundrect><![endif]-->
                                                            </div>
                                                        </td>
                                                        ${
                                                          secondButtonText
                                                            ? `                                                        <td style="
                                                            overflow-wrap: break-word;
                                                            word-break: break-word;
                                                            padding: 10px;
                                                            font-family: 'Cabin', sans-serif;
                                                          " align="left">
                                                                                      <!--[if mso
                                                            ]><style>
                                                              .v-button {
                                                                background: transparent !important;
                                                              }
                                                            </style><!
                                                          [endif]-->
                                                                                      <div style="margin-bottom: 30px;">
                                                                                          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:44px; v-text-anchor:middle; width:180px;" arcsize="9%"  stroke="f" fillcolor="#ffffff"><w:anchorlock/><center style="color:#626ed4;font-family:'Cabin',sans-serif;"><![endif]-->
                                                                                          <a href=${secondButtonLink} target="_blank" class="v-button" style="
                                                                box-sizing: border-box;
                                                                display: inline-block;
                                                                font-family: 'Cabin', sans-serif;
                                                                text-decoration: none;
                                                                -webkit-text-size-adjust: none;
                                                                margin: 15px 45px 0px 45px;
                                                                color: #626ed4;
                                                                background-color: #ffffff;
                                                                border-radius: 4px;
                                                                -webkit-border-radius: 4px;
                                                                -moz-border-radius: 4px;
                                                                width: auto;
                                                                max-width: 100%;
                                                                overflow-wrap: break-word;
                                                                word-break: break-word;
                                                                word-wrap: break-word;
                                                                mso-border-alt: none;
                                                                font-size: 14px;
                                                              ">
                                                                                              <span style="
                                                                  display: block;
                                                                  padding: 14px 44px 13px;
                                                                  line-height: 120%;
                                                                ">${secondButtonText}</span>
                                                                                          </a>
                                                                                          <!--[if mso]></center></v:roundrect><![endif]-->
                                                                                      </div>
                                                                                  </td>`
                                                            : `<div></div>`
                                                        }
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <table style="font-family: 'Cabin', sans-serif" role="presentation"
                                                cellpadding="0" cellspacing="0" width="100%" border="0">
                                                <tbody>
                                                    <tr>
                                                        <td style="
                                background-color: #ffffff;
                                  overflow-wrap: break-word;
                                  word-break: break-word;
                                  padding: 33px 55px 20px;
                                  font-family: 'Cabin', sans-serif;
                                " align="left">
                                                            <div style="
                                   font-size: 12px;
                                    line-height: 160%;
                                   
                                    word-wrap: break-word;
                                  ">
                                                                <p style="line-height: 160%">
                                                                    This email was sent to:
                                                                    ${emailSentTo}
                                                                </p>
                                                                <p style="line-height: 160%">
                                                                    You are receiving this email to inform you
                                                                    of important information regarding your
                                                                    PA account.
                                                                </p>
                                                                <p style="line-height: 160%">
                                                                    Too many emails? Manage your email
                                                                    notifications on your settings page.
                                                                </p>
                                                                <p style="line-height: 160%">
                                                                    Visit our Privacy Policy and Terms &amp;
                                                                    Conditions.
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <!-- ---------------------------------------------------------------------------------------------------------------------- -->



                                            <div class="u-row-container"
                                                style="padding: 0px;background-color: transparent">
                                                <div class="u-row"
                                                    style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                                                    <div
                                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #e5eaf5;"><![endif]-->

                                                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                                        <div class="u-col u-col-100"
                                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                            <div style="height: 100%;width: 100% !important;">
                                                                <!--[if (!mso)&(!IE)]><!-->
                                                                <div
                                                                    style="box-sizing: border-box; height: 100%; padding: 0px;    border-right: 1px solid #ccc;">
                                                                    <!--<![endif]-->

                                                                                            <!--[if (mso)|(IE)]></td><![endif]-->


                                                                                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                                                        </div>
                                                                                    </div>

                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                </div>
                                                                <!--<![endif]-->
                                                            </div>
                                                        </div>
                                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                    </div>
                                                </div>
                                            </div>



                                            <div class="u-row-container"
                                                style="padding: 0px;background-color: transparent">
                                                <div class="u-row"
                                                    style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #323547;">
                                                    <div
                                                        style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                                                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #003399;"><![endif]-->

                                                        <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                                                        <div class="u-col u-col-100"
                                                            style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                                                            <div style="height: 100%;width: 100% !important;">
                                                                <!--[if (!mso)&(!IE)]><!-->
                                                                <div
                                                                    style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                                                    <!--<![endif]-->

                                                                    <table style="font-family:'Cabin',sans-serif;"
                                                                        role="presentation" cellpadding="0"
                                                                        cellspacing="0" width="100%" border="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style="overflow-wrap:break-word;word-break:break-word; font-family:'Cabin',sans-serif; display: flex; justify-content: space-between; padding:10px 55px;"
                                                                                    align="left">

                                                                                    <div
                                                                                        style="color: #fafafa; line-height: 180%;   word-wrap: break-word;">
                                                                                        <p
                                                                                            style="font-size: 14px; line-height: 180%; ">
                                                                                            <span
                                                                                                style="font-size: 12px; line-height: 28.8px;">Copyrights
                                                                                                &copy; PA
                                                                                                Dashboard</span>
                                                                                        </p>
                                                                                    </div>
                                                                                    <div
                                                                                        style="color: #fafafa; line-height: 180%;  word-wrap: break-word;">
                                                                                        <p
                                                                                            style="font-size: 14px; line-height: 180%;">
                                                                                            <a
                                                                                                style="font-size: 12px; line-height: 28.8px; color: #fafafa; text-decoration: none;">
                                                                                                Privacy policy</a>
                                                                                        </p>
                                                                                    </div>

                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                    <!-- ---------------------------------------------------------------------------------------------------------------------- -->
                                                                    <!--[if (!mso)&(!IE)]><!-->
                                                                </div>
                                                                <!--<![endif]-->
                                                            </div>
                                                        </div>
                                                        <!--[if (mso)|(IE)]></td><![endif]-->
                                                        <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                                    </div>
                                                </div>
                                            </div>

                                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                </td>
            </tr>
        </tbody>
    </table>
    <!--[if mso]></div><![endif]-->
    <!--[if IE]></div><![endif]-->
</body>

</html>`
}

export default mailHtml
