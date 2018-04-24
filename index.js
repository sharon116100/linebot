const linebot = require('linebot');
const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');

const aqiOpt = {
    uri: "http://opendata2.epa.gov.tw/AQI.json",
    json: true
}; 

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

function readAQI(repos,site_name){
    let data;
    for (i in repos) {
        if (repos[i].SiteName == site_name) {
            data = repos[i];
            break;
        }
    }

    return data;
}


const app = express();
app.set('view engine', 'ejs');

const linebotParser = bot.parser();

app.get('/',function(req,res){
    rp(aqiOpt)
    .then(function (repos) {
        
        res.render('index', {AQI:readAQI(repos,"西屯")});
    })
    .catch(function (err) {
		res.send("無法取得空氣品質資料～");
    });
});

app.post('/linewebhook', linebotParser);

bot.on('message', function (event) {
  switch (event.message.type) {
    case 'text':
      switch (event.message.text) {
        case 'Me':
          event.source.profile().then(function (profile) {
            return event.reply(['Hello ' + profile.displayName + ' ' + profile.userId,'還有什麼問題嗎?']);
          });
          break;
          case '我想了解你~':
              event.reply({
                  type: 'template',
                altText: 'this is a botton template',
                template: {
                    type: 'buttons',
                    "thumbnailImageUrl": "https://i.imgur.com/Y3xf0BU.jpg?1",
                    "imageAspectRatio": "rectangle",
                    "imageSize": "cover",
                    "imageBackgroundColor": "#FFFFFF",
                    text: '我叫吳奐萱,今年22歲,喜歡游泳運動,喜歡動物貓咪,喜歡笑:)',
                    actions: [{
                        type: 'postback',
                        label: '學校',
                        data: 'Location'
                    }, {
                        type: 'postback',
                        label: '自我介紹',
                        data: 'myself'
                    }, {
                        "type": "uri",
                        "label": "我的FB",
                        "uri": "https://www.facebook.com/profile.php?id=100002872849620"
                    }
                              ]
                }
              });
              break;
            case '來點生活照讓我看看!':
              event.reply({
                   type: 'template',
                altText: 'this is a botton template',
                template: {
                    type: 'buttons',
                    "thumbnailImageUrl": "https://i.imgur.com/ZgFAxai.jpg",
                    "imageAspectRatio": "rectangle",
                    "imageSize": "cover",
                    "imageBackgroundColor": "#FFFFFF",
                    text: '這是我人生中很重要的一些事',
                    actions: [{
                        type: 'postback',
                        label: '綠島打工換宿',
                        data: 'Green island'
                    }, {
                        type: 'postback',
                        label: '全國大專校院資訊應用服務創新競賽',
                        data: 'Fintech'
                    }, {
                        type: 'postback',
                        label: '資財營',
                        data: 'camp'
                    }
                              ]}
                  
              });
              break;
          case '來點作品吧':
                  event.reply({
                  type: 'template',
                altText: 'this is a botton2 template',
                template: {
                    type: 'buttons',
                    "thumbnailImageUrl": "https://i.imgur.com/cmKYh5o.jpg",
                    "imageAspectRatio": "rectangle",
                    "imageSize": "cover",
                    "imageBackgroundColor": "#FFFFFF",
                    text: '我參加的比賽們~',
                    actions: [{
                        type: 'postback',
                        label: '2016/11:資創',
                        data: '2016school'
                    }, {
                        type: 'postback',
                        label: '2017/11:資創第一組',
                        data: '2017school1'
                    }, {
                        type: 'postback',
                        label: '2017/11:資創第二組',
                        data: '2017school2'
                    }
                              ]}
                  });
              break;
            case '現在空氣狀況如何?':
              event.reply({
                  type: 'template',
                    altText: 'this is a confirm template',
                    template: {
                        type: 'buttons',
                        text: '歡迎來氣象站！\n目前暫時先提供這幾個地區而已唷~',
                        actions: [{
                            type: 'postback',
                            label: '台北市中山',
                            data: '中山'
                        }, {
                            type: 'postback',
                            label: '基隆市基隆',
                            data: '基隆'
                        },{
                            type: 'postback',
                            label: '台中市西屯',
                            data: '西屯'
                        },{
                            type: 'postback',
                            label: '台南市台南',
                            data: '臺南'
                        }]
                    }
              });
              break;
            case '我肚子餓餓~':
            event.reply({
              "type": "template",
              "altText": "this is a carousel template",
              "template": {
                  "type": "carousel",
                  "columns": [
                      {
                        "thumbnailImageUrl": "https://i.imgur.com/Ypt9UWL.jpg",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "this is menu",
                        "text": "麥當勞-台灣最棒的速食",
                        "defaultAction": {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "http://www.mcdonalds.com.tw/tw/ch/index.html"
                        },
                        "actions": [
                            {
                                "type": "postback",
                                "label": "Buy",
                                "data": "buy_m"
                            },
                            {
                                "type": "uri",
                                "label": "View detail",
                                "uri": "http://www.mcdonalds.com.tw/tw/ch/index.html"
                            }
                        ]
                      },
                      {
                        "thumbnailImageUrl": "https://i.imgur.com/1wcUMB3.jpg",
                        "imageBackgroundColor": "#000000",
                        "title": "this is menu",
                        "text": "pizza hot-hot到家!",
                        "defaultAction": {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "https://www.pizzahut.com.tw/menu/"
                        },
                        "actions": [
                            {
                                "type": "postback",
                                "label": "Buy",
                                "data": "buy_h"
                            },
                            {
                                "type": "uri",
                                "label": "View detail",
                                "uri": "https://www.pizzahut.com.tw/menu/"
                            }
                        ]
                      }
                  ],
                  "imageAspectRatio": "rectangle",
                  "imageSize": "cover"
              }
                      });
        break;
        case '記帳~':
          event.reply(
          {
            "type": "template",
            "altText": "this is a image_carousel template",
            "template": {
            "type": "image_carousel",
            "Text" : "記帳事件很重要的事!要記得保持唷~",
            "columns": [{
                    "imageUrl": "https://i.imgur.com/BOKL5Y5.png",
                    "action": {
                      "type": "datetimepicker",
                      "label": "選日期",
                      "data": "q1",
                      "mode": "date"
                    }
                  }]
          }
        });
              break;
        case 'Push':
          bot.push('U17448c796a01b715d293c34810985a4c', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
          break;
        case 'Push2':
          bot.push('Cba71ba25dafbd6a1472c655fe22979e2', 'Push to group');
          break;
        case 'Multicast':
          bot.push(['U17448c796a01b715d293c34810985a4c', 'Cba71ba25dafbd6a1472c655fe22979e2'], 'Multicast!');
          break;
        case 'Confirm':
          event.reply({
            type: 'template',
            altText: 'this is a confirm template',
            template: {
              type: 'confirm',
              text: 'Are you sure?',
              actions: [{
                type: 'message',
                label: 'Yes',
                text: 'yes'
              }, {
                type: 'message',
                label: 'No',
                text: 'no'
              }]
            }
          });
          break;
        case 'Multiple':
          return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
          break;
        case 'Version':
          event.reply('linebot@' + require('../package.json').version);
          break;
        default:
          event.reply(event.message.text).then(function (data) {
            console.log('Success', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
          break;
      }
      break;
    case 'image':
      event.message.content().then(function (data) {
        const s = data.toString('hex').substring(0, 32);
        return event.reply('Nice picture! ' + s);
      }).catch(function (err) {
        return event.reply(err.toString());
      });
      break;
    case 'video':
      event.reply('Nice video!');
      break;
    case 'audio':
      event.reply('Nice audio!');
      break;
    case 'location':
      event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
      break;
    case 'sticker':
          var maxNum = 25;  
          var minNum = 1;  
          var n = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
          var m = Math.floor(Math.random() * (4 - minNum + 1)) + minNum;
      event.reply({
        type: 'sticker',
        packageId: m,
        stickerId: n
      });
      break;
    default:
      event.reply('Unknow message: ' + JSON.stringify(event));
      break;
  }
});

bot.on('postback', function (event) {
    switch (event.postback.data){
        case 'Location':
            event.reply({
            type: 'location',
            title: '國立交通大學',
            address: '臺灣新竹市東區大學路1001號',
            latitude: 24.789071,
            longitude: 120.999645
          });
          break;
        case 'Green island':
            event.reply({
                 "type": "template",
              "altText": "this is a image carousel template",
              "template": {
                  "type": "image_carousel",
                  "columns": [{
                        "imageUrl": "https://i.imgur.com/tcTinPZ.jpg",
                        "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_green1"
                        }
                          },
                          {
                            "imageUrl": "https://i.imgur.com/JwECJO9.jpg",
                              "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_green2"
                              }
                          },
                          {
                            "imageUrl": "https://i.imgur.com/8N8br5l.jpg",
                              "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_green3"
                          }
                              }
                      ]}
                });
            break;
        case 'Fintech':
            event.reply({
                "type": "template",
              "altText": "this is a image carousel template",
              "template": {
                  "type": "image_carousel",
                  "columns": [{
                        "imageUrl": "https://i.imgur.com/ijckgFq.jpg",
                        "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_fintech1"
                        }
                          },
                          {
                            "imageUrl": "https://i.imgur.com/TK0BorI.jpg",
                              "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_fintech2"
                              }
                          },
                          {
                            "imageUrl": "https://i.imgur.com/D63Kz0R.jpg",
                              "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_fintech3"
                                }
                          }
                      ]}
            });
            break;
        case 'camp':
            event.reply({
                "type": "template",
              "altText": "this is a image carousel template",
              "template": {
                  "type": "image_carousel",
                  "columns": [{
                        "imageUrl": "https://i.imgur.com/SWePEi1.jpg",
                        "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_camp1"
                        }
                          },
                          {
                            "imageUrl": "https://i.imgur.com/sMT7zUW.jpg",
                              "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_camp2"
                              }
                          },
                          {
                            "imageUrl": "https://i.imgur.com/V9JQoMu.jpg",
                              "action": {
                          "type": "postback",
                          "label": "story",
                          "data": "story_camp3"
                                }
                        }
                      ]}
            });
            break;
        case '2016school':
            event.reply({
              "type": "template",
              "altText": "this is a carousel template",
              "template": {
                  "type": "carousel",
                  "columns": [{
                        "thumbnailImageUrl": "https://i.imgur.com/jvAfVe4.png",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "2016資創大賽-VRTraderoom",
                        "text": "利用VR建立一個虛擬的交易室，讓交易員可以自行選擇想要的時間點，訓練交易員的危機處理",
                        "defaultAction": {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "https://www.youtube.com/watch?v=gTQ6xpOPVtc"
                        },
                        "actions": [
                            {
                                "type": "uri",
                                "label": "video:功能介紹",
                                "uri": "https://www.youtube.com/watch?v=gTQ6xpOPVtc"
                            }
                        ]
                      }]
              }
                      });
            break;
            case '2017school2':
            event.reply({
              "type": "template",
              "altText": "this is a carousel template",
              "template": {
                  "type": "carousel",
                  "columns": [{
                        "thumbnailImageUrl": "https://i.imgur.com/FJxB3pa.png",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "2017資創大賽-好家在",
                        "text": "利用原先被棄置的舊手機，連接我們所開發的好家在系統，提供許多功能達成智慧家庭。",
                        "defaultAction": {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "https://www.youtube.com/watch?v=Ejh6nfXZgeQ"
                        },
                        "actions": [
                            {
                                "type": "uri",
                                "label": "video:功能介紹",
                                "uri": "https://www.youtube.com/watch?v=Ejh6nfXZgeQ"
                            }
                        ]
                      }]
              }
                      });
            break;
            case '2017school1':
            event.reply({
              "type": "template",
              "altText": "this is a carousel template",
              "template": {
                  "type": "carousel",
                  "columns": [{
                        "thumbnailImageUrl": "https://i.imgur.com/mQlYQAi.png",
                        "imageBackgroundColor": "#FFFFFF",
                        "title": "2017資創大賽-shopping趣",
                        "text": "shopping趣,利用AR、beacon、IOT技術，讓賣場虛實整合更具人性化,並獲得應用組第二名",
                        "defaultAction": {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "https://www.youtube.com/watch?v=RAazTcKZmpY&feature=youtu.be"
                        },
                        "actions": [
                            {
                                "type": "uri",
                                "label": "video:功能介紹",
                                "uri": "https://www.youtube.com/watch?v=RAazTcKZmpY&feature=youtu.be"
                            }
                        ]
                      }]
              }
                      });
            break;
        case 'q1':
            event.reply(['你花了多少錢呢?','還在計畫和google的連結,botty之後會再改進']);
            break;
        case 'buy_m':
            event.reply('請你直接在網頁上訂,目前botty還沒跟商家進行合作,無法幫忙訂餐Q');
            break;
        case 'buy_h':
            event.reply('請你直接在網頁上訂,目前botty還沒跟商家進行合作,無法幫忙訂餐Q');
            break;
        case 'myself':
            event.reply(['我是交通大學資訊管理與財務金融學系的大三生，對寫程式很有興趣，有額外多修校內與校外的程式課，像是智慧型和swift，還有參加比賽去磨練的自己能力。','除了對程式的喜愛外，我也很喜歡參加活動，可以跟大家一起合作、努力是我覺得最棒的部份，我有參加吉他社和資財營（系上營隊），也都擔任活動長的角色。我也喜歡運動，尤其是游泳，運動可以讓我專注在運動上，好好放鬆自己，重新開始。']);
            break;
        case 'story_green1':
            event.reply('我在2017/8月自己一個人去綠島打工換宿一個月,這是我一職很想完成的一個心願,覺得之後就會沒有時間能好好享受一個人的假期,所以下定決心,一個人去體驗海島生活。而到了現在,我依舊覺得這是一個非常正確的決定,因為一個人去外地生活工作,真的能成長很多,如何自己解決問題,如何和孤獨相處也不覺得孤單,讓我更能珍惜生活中的每一刻。');
            break;
        case 'story_green2':
            event.reply('綠島非常多梅花鹿,非常的可愛,這隻叫錢錢,是店鹿XD,我很常跟我的同事一起出來玩水吃冰或跟錢錢玩,店裡的工作很辛苦,每天客人都很多,要招呼客人還要在廚房幫忙配菜,真的需要投入許多心力,但下班後的娛樂真的讓一切都值得。');
            break;
        case 'story_green3':
            event.reply('來綠島,最重要的當然是玩水。綠島真的很美,不只風景還有海裡,我幾乎天天下水,因為海裡的世界真的很奇妙,每天都不一樣,不一樣的顏色生物和海流,每次的體驗都不一樣,潛到最後真的會變環保人士,只要看到有垃圾在海裡,立刻下潛去把它撿起來丟掉,這麼美的地方不應該被汙染。');
            break;
        case 'story_fintech1':
            event.reply('這是我第二次參加全國大專校院資訊應用服務創新競賽,第一次是在2016大一下學期的時候參加,因為是第二次參加比賽,所以在團隊裡擔任隊長的腳色,雖然依舊是一起討論主題一起分工合作做出成品,但時間管理和帶領組員是之前沒體會過的。');
            break;
        case 'story_fintech2':
            event.reply('當組長最怕的就是和組員產生摩擦,畢竟是同學也是夥伴,缺點該講的還是要說出來,當組員間產生摩擦時,該如何平復大家的心情和解決問題,真的需要技巧,還好大家都是好好人,不計較而且發揮出團隊合作的精神,把成品完美呈現。');
            break;
        case 'story_fintech3':
            event.reply('最後我們拿了第二名,照片中的第一名板子是跟別組借來拍照的,因為這次只有第一名有板子XD,當公布是第二名的時候,其實大家都有點小失望,因為每個人真的都非常努力去做,付出了100分的努力,所以沒得到第一名當然有點失望,但大家在這次中真的學到很多,讓一切都值得了。');
            break;
        case 'story_camp1':
            event.reply('這是我們系上的營隊,而我在這當中扮演活動長的腳色,活動長是個吃力不討好的腳色,但也是個感受最深的腳色,要管理所有活動和表演,要和其他組像是美宣協商工作內容,場地規劃,時間管理,都是很重要也很費神的工作。但到營期最後一天的時候,最感動也是活動長。');
            break;
        case 'story_camp2':
            event.reply('資財營是個一整個學期的活動,從策劃到執行到總驗到營期,花了一整個學期。而這是在2017大三上握課業壓力最大的時候,同時還要參加資創大賽,真的是常常忙到三更半夜,還好我在一開學的時候就做好時間規劃,並且按部就班地把所有事情一件一件解決,才能解決所有問題。');
            break;
        case 'story_camp3':
            event.reply('在當資財營活動長,學到最寶貴的就是溝通能力和策劃能力,活動長要看的廣看得遠,要不然很容易東漏西露而導致或棟進行不下去,我也是從挫敗中成長,練習如何和其他組長溝通達成協議和總攬大局,不要只顧小部分,雖然過程很疲累,但收穫滿滿也感動滿滿。');
            break;
        default:
            {
                let data;
            rp(aqiOpt)
            .then(function (repos) {
                data = readAQI(repos,event.postback.data);
                event.reply(data.County + data.SiteName + 
                '\n\nPM2.5指數：'+ data["PM2.5_AVG"] + 
                '\n狀態：' + data.Status);
            })
            .catch(function (err) {
                event.reply('rp要求錯誤,無法取得空氣品質資料～');
                                });
            }
            break;
        
    }
});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});