const fs = require('fs')
const os = require('os')
const EOL = os.EOL || '\n';

const icons = fs.readFileSync('./larry-icon.css').toString().split('\n').reduce((previousValue, currentValue) => {
    if (currentValue.includes('.larry-') === true) {
        previousValue.unshift({
            iconName: currentValue.split('.')[1].split(':')[0]
        })
    } else if (currentValue.includes('content: "') === true) {
        previousValue[0]['iconCode'] = currentValue.split(': "')[1].split('"')[0]
    }
    return previousValue;
}, []);

// console.log(EOL)

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./larry-icon.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vant@2.10/lib/index.css" />
    <title>iconfont</title>
    <style>
      [v-cloak] { display: none }
	  </style>
  </head>
  <body style="min-width: 1160px">
    <div id="app" v-cloak>
      <van-grid column-num="7">
        <van-grid-item v-for="temp in icons" :key="temp.iconName" text="文字">
          <i class="larry-icon" :class="temp.iconName" style="font-size:25px"></i>
          <div style="margin:10px 0">{{temp.iconName}}</div>
          <div>{{temp.iconCode}}</div>
        </van-grid-item>
      </van-grid>
    </div>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vant@2.10/lib/vant.min.js"></script>
    <script src="https://unpkg.com/element-ui/lib/index.js"></script>
    <script>
      new Vue({
        el: "#app",
        data: function () {
          return {
            icons: ${JSON.stringify(icons)},
          };
        },
      });
    </script>
  </body>
</html>
`

fs.writeFileSync('./iconfont2.html', html)
