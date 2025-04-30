import React, { useState, useEffect, useRef } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { MapPin, Clock, CloudSun, Sun, Cloud, CloudRain, Wind, Coffee, Utensils, Train, Hotel, Mountain, ShoppingBag, Camera, Star, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TravelGuide = () => {
  const [activeDay, setActiveDay] = useState(1);
  const [mapInstance, setMapInstance] = useState(null);
  const mapContainerRef = useRef(null);
  const weatherData = {
    "柳州": [
      {
        date: "2025-05-02",
        temp_high: 34,
        temp_low: 23,
        condition: "多云",
        humidity: 67,
        wind: "南风1级"
      },
      {
        date: "2025-05-03",
        temp_high: 34,
        temp_low: 23,
        condition: "阴",
        humidity: 73,
        wind: "南风1级"
      }
    ],
    "南宁": [
      {
        date: "2025-05-03",
        temp_high: 32,
        temp_low: 23,
        condition: "多云",
        humidity: 74,
        wind: "南风1级"
      },
      {
        date: "2025-05-04",
        temp_high: 31,
        temp_low: 23,
        condition: "阵雨",
        humidity: 79,
        wind: "南风1级"
      },
      {
        date: "2025-05-05",
        temp_high: 32,
        temp_low: 24,
        condition: "阵雨",
        humidity: 79,
        wind: "南风1级"
      }
    ]
  };

  const days = [
    {
      id: 1,
      title: 'Day 1 · 柳州 | 抵达与夜游',
      date: '5月2日',
      schedule: [
        { time: '12:52-17:07', activity: '深圳北→柳州高铁', icon: <Train />, highlight: '建议提前购买靠窗座位，欣赏喀斯特地貌' },
        { time: '17:30-18:30', activity: '入住酒店（位于五星步行街）', icon: <Hotel /> },
        { time: '19:00-21:00', activity: '柳江夜游\n1. 游船音乐喷泉（20:00场次）\n2. 风情港夜市（螺蛳粉+炒冰）', icon: <Utensils />, highlight: '游船票提前1小时购买，夜市推荐聚宝螺蛳粉、卢姐炒冰', alternative: '若错过游船，可步行至窑埠古镇拍夜景' },
        { time: '21:30后', activity: '江边清吧小酌/酒店休息', icon: <Coffee />, highlight: '推荐：柳江边的「微醺码头」或「夜莺酒吧」', alternative: '体力充沛可夜爬马鞍山看全景（电梯20:30关闭）' }
      ]
    },
    {
      id: 2,
      title: 'Day 2 · 柳州→南宁',
      date: '5月3日',
      schedule: [
        { time: '9:00-10:00', activity: '青云菜市早餐', icon: <Utensils />, highlight: '必吃：露水汤圆+虾饺+五彩糯米饭，7:30后人流暴增', alternative: '若起晚可去广雅茶楼吃早茶' },
        { time: '10:30-12:00', activity: '龙潭公园漫步', icon: <Mountain />, highlight: '重点：风雨桥+镜湖+侗寨建筑，穿舒适鞋子', alternative: '若下雨改去柳州工业博物馆（免费，工业风拍照）' },
        { time: '12:30-14:00', activity: '午餐肥螺庄', icon: <Utensils />, highlight: '鸭脚煲+炒螺蛳粉必点，总店排队快', alternative: '替代店：新菊螺蛳粉（本地人推荐）' },
        { time: '15:00-18:00', activity: '酒店休整/乌托邦音乐城', icon: <Coffee />, highlight: '复古街区适合拍照，咖啡厅推荐「旧时光咖啡馆」', alternative: '文艺向可逛柳州博物馆（免费，铜鼓展）' },
        { time: '19:07-20:10', activity: '柳州→南宁东高铁', icon: <Train />, highlight: '建议选靠右座位，日落时分可能看到晚霞' },
        { time: '20:30-22:00', activity: '建政路夜市', icon: <ShoppingBag />, highlight: '古记卷筒粉+黄记八宝粥+葛师傅水果酸嘢', alternative: '若太累可外卖「舒记老友粉」到酒店' }
      ]
    },
    {
      id: 3,
      title: 'Day 3 · 南宁 | 自然疗愈',
      date: '5月4日',
      schedule: [
        { time: '9:30-11:30', activity: '青秀山风景区', icon: <Mountain />, highlight: '北门进→荫生植物园→龙象塔，观光车票10元/次', alternative: '懒人路线：西门直接坐车到龙象塔' },
        { time: '12:00-13:30', activity: '午餐中山路美食街', icon: <Utensils />, highlight: '复记老友粉+阿光豆浆油条，避开13:00旅游团高峰', alternative: '替代店：桂小厨（广西菜连锁）' },
        { time: '14:00-17:00', activity: '三街两巷慢逛', icon: <Camera />, highlight: '推荐：城隍庙红墙拍照、「邕城茶档」手打柠檬茶', alternative: '文化向可去广西民族博物馆（需提前预约）' },
        { time: '18:00-20:00', activity: '晚餐甘家界柠檬鸭+南湖散步', icon: <Utensils />, highlight: '柠檬鸭微辣，搭配芋头饭绝佳，南湖夜景灯光秀20:30开始', alternative: '若排队人多改吃808饭堂（南宁家常菜）' }
      ]
    },
    {
      id: 4,
      title: 'Day 4 · 南宁 | 返程日',
      date: '5月5日',
      schedule: [
        { time: '10:00-12:00', activity: '南湖公园骑行', icon: <Route />, highlight: '租双人自行车（30元/小时），推荐环湖西侧林荫道', alternative: '若炎热可改逛广西图书馆（网红旋转楼梯）' },
        { time: '12:30-14:00', activity: '午餐瑶王府', icon: <Utensils />, highlight: '油茶+簸箕宴体验民族特色，需提前订位', alternative: '简餐可选米马河粉饺（本地小吃集合店）' },
        { time: '15:00-18:00', activity: '自由活动/广西博物馆', icon: <Camera />, highlight: '博物馆重点：铜鼓展厅+汉代文物，16:30停止入馆', alternative: '购物向：万象城（6楼观景台俯瞰南宁）' },
        { time: '19:48-23:40', activity: '南宁东→深圳北', icon: <Train />, highlight: '建议提前1小时到站，南宁东站餐饮较少' }
      ]
    }
  ];

  const foodList = [
    { city: '柳州', category: '正餐', name: '肥螺庄、新菊螺蛳粉、桂小厨' },
    { city: '南宁', category: '正餐', name: '甘家界柠檬鸭、808饭堂、瑶王府' },
    { city: '柳州', category: '小吃', name: '青云菜市糯米饭、张飞木薯羹、卢姐炒冰' },
    { city: '南宁', category: '小吃', name: '古记卷筒粉、复记老友粉、酸品王' },
    { city: '柳州', category: '饮品', name: '乌托邦音乐城咖啡店、阿嬷手作（广西限定）' },
    { city: '南宁', category: '饮品', name: '邕城茶档、阿嬷手作（万象城店）' },
    { city: '柳州', category: '应急方案', name: '外卖螺蛳粉（西环肥仔）、KFC' },
    { city: '南宁', category: '应急方案', name: '外卖老友粉（舒记）、奶茶（煲珠公）' }
  ];

  useEffect(() => {
    AMapLoader.load({
      key: 'd17c17f8f712c81a7e4241aff4faa7b0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.MarkerClusterer']
    }).then((AMap) => {
      const center = activeDay <= 2 ? [109.4113, 24.3272] : [108.3663, 22.8176];
      const map = new AMap.Map(mapContainerRef.current, {
        zoom: 14,
        center: center
      });
      setMapInstance(map);

      // 添加标记点
      if (activeDay <= 2) {
        new AMap.Marker({
          position: [109.4113, 24.3272],
          title: '五星步行街酒店',
          map: map
        });
        new AMap.Marker({
          position: [109.3965, 24.3189],
          title: '青云菜市',
          map: map
        });
      } else {
        new AMap.Marker({
          position: [108.3663, 22.8176],
          title: '青秀山风景区',
          map: map
        });
      }

      return () => map?.destroy();
    }).catch(e => console.error(e));
  }, [activeDay]);

  const getWeatherIcon = (condition) => {
    switch(condition) {
      case '多云':
        return <CloudSun className="text-yellow-500" />;
      case '阴':
        return <Cloud className="text-gray-400" />;
      case '阵雨':
        return <CloudRain className="text-blue-400" />;
      default:
        return <Sun className="text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-blue-50 h-12 flex items-center justify-between px-4 shadow-sm">
        <h1 className="text-xl font-bold text-blue-800">柳州 & 南宁 · 4天3晚放松版双人攻略</h1>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* 主题和交通原则 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">主题：慢节奏·美食·自然·轻文化</h2>
          <p className="text-gray-600">交通原则：柳州打车为主，南宁地铁+共享电单车</p>
        </motion.div>

        {/* 每日行程导航 */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {days.map(day => (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`flex-shrink-0 px-4 py-2 mx-1 rounded-full ${activeDay === day.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            >
              {day.title.split('·')[0]}
            </button>
          ))}
        </div>

        {/* 天气显示 */}
        <div className="flex justify-between mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 w-1/2 mr-2 flex items-center">
            <div className="text-3xl mr-3">
              {getWeatherIcon(weatherData.柳州[activeDay <= 2 ? 0 : 1].condition)}
            </div>
            <div>
              <h3 className="font-medium">柳州</h3>
              <p className="text-gray-600">
                {weatherData.柳州[activeDay <= 2 ? 0 : 1].temp_high}°C / {weatherData.柳州[activeDay <= 2 ? 0 : 1].temp_low}°C {weatherData.柳州[activeDay <= 2 ? 0 : 1].condition}
              </p>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 w-1/2 ml-2 flex items-center">
            <div className="text-3xl mr-3">
              {getWeatherIcon(weatherData.南宁[activeDay <= 2 ? 0 : activeDay === 3 ? 1 : 2].condition)}
            </div>
            <div>
              <h3 className="font-medium">南宁</h3>
              <p className="text-gray-600">
                {weatherData.南宁[activeDay <= 2 ? 0 : activeDay === 3 ? 1 : 2].temp_high}°C / {weatherData.南宁[activeDay <= 2 ? 0 : activeDay === 3 ? 1 : 2].temp_low}°C {weatherData.南宁[activeDay <= 2 ? 0 : activeDay === 3 ? 1 : 2].condition}
              </p>
            </div>
          </div>
        </div>

        {/* 地图容器 */}
        <div className="mb-6">
          <div ref={mapContainerRef} className="w-full h-64 rounded-xl"></div>
        </div>

        {/* 每日行程详情 */}
        <AnimatePresence mode="wait">
          {days.filter(day => day.id === activeDay).map(day => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">{day.title} ({day.date})</h2>
              
              {day.schedule.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-4 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-1 text-blue-600">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <Clock className="text-gray-500 mr-1" size={16} />
                        <span className="text-sm font-medium text-gray-500">{item.time}</span>
                      </div>
                      <h3 className="text-lg font-medium mb-2">{item.activity}</h3>
                      {item.highlight && (
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">提示：</span>{item.highlight}
                        </p>
                      )}
                      {item.alternative && (
                        <div className="bg-blue-50 rounded-lg p-3 mt-2">
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">备选方案：</span>{item.alternative}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 美食备选清单 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-sm hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-4">美食备选清单</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">城市</th>
                  <th className="text-left py-2">类别</th>
                  <th className="text-left py-2">推荐</th>
                </tr>
              </thead>
              <tbody>
                {foodList.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3">{item.city}</td>
                    <td className="py-3">{item.category}</td>
                    <td className="py-3">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 灵活调整指南 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-4">灵活调整指南</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-2">天气应变：</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li className="mb-1">柳州雨天：龙潭公园→工业博物馆→乌托邦音乐城</li>
              <li>南宁暴雨：青秀山→广西民族博物馆（室内）→万象城</li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">体力管理：</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li className="mb-1">Day2下午若疲惫，可取消乌托邦行程直接转场南宁</li>
              <li>Day4南湖骑行改为湖心岛茶室喝茶</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">错峰技巧：</h3>
            <ul className="list-disc pl-5 text-gray-600">
              <li className="mb-1">青云市场7:30前到达，肥螺庄11:30前到店</li>
              <li>青秀山周末早9点前入园，避开旅游团</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* 页脚 */}
      <footer className="bg-gray-800/95 py-4 px-6 text-center mt-8">
        <p className="text-sm text-gray-300">
          Created by <a href="https://space.coze.cn" className="text-blue-400 hover:text-blue-300 transition-colors">coze space</a>
        </p>
        <p className="text-xs text-gray-400 mt-1">页面内容均由AI生成，仅供参考</p>
      </footer>
    </div>
  );
};

export default TravelGuide;