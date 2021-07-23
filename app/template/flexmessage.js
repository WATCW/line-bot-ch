var message_flex = {
    flexMessageTemplate: function () {
        return {
                "type": "bubble",
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": "NOTE",
                      "weight": "bold",
                      "color": "#1DB446",
                      "size": "sm"
                    },
                    {
                      "type": "text",
                      "text": "{data.topic}",
                      "weight": "bold",
                      "size": "xl",
                      "margin": "md"
                    },
                    {
                      "type": "separator",
                      "margin": "xl",
                      "color": "#cccccc"
                    },
                    {
                      "type": "text",
                      "text": "{data.message}",
                      "size": "xs",
                      "color": "#283747",
                      "wrap": true
                    },
                    {
                      "type": "separator",
                      "margin": "xxl"
                    },
                    {
                      "type": "box",
                      "layout": "horizontal",
                      "margin": "md",
                      "contents": [
                        {
                          "type": "text",
                          "text": "Category",
                          "size": "xs",
                          "color": "#aaaaaa",
                          "flex": 0
                        },
                        {
                          "type": "text",
                          "text": "#{data.footer}",
                          "color": "#aaaaaa",
                          "size": "xs",
                          "align": "end"
                        }
                      ]
                    }
                  ]
                },
                "styles": {
                  "footer": {
                    "separator": true
                  }
                }
              };
    }
}

module.exports = message_flex;